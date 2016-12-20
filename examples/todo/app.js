/* global window, jQuery, Handlebars, Router */
jQuery(function ($) {
  'use strict';

  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  var App = function () {
    this.model = new window.app.Model('todos-convergence');

    this.todoTemplate = Handlebars.compile($('#todo-template').html());
    this.footerTemplate = Handlebars.compile($('#footer-template').html());
    
    this.bindEvents();
    this.listenToExternalEvents();

    new Router({
      '/:filter': function (filter) {
        this.model.setFilter(filter);
        this.model.loaded.then(function() {
          $('#loading').hide();
          $('#header input').removeAttr('disabled');
          this.render();
        }.bind(this));
      }.bind(this)
    }).init('/all');
  };

  App.prototype = {
    bindEvents: function () {
      this.dragStart = this.dragStart.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragEnter = this.dragEnter.bind(this);
      this.dragLeave = this.dragLeave.bind(this);
      this.dragOver = this.dragOver.bind(this);
      this.drop = this.drop.bind(this);

      this.update = this.update.bind(this);

      $('#new-todo').on('keyup', this.create.bind(this));
      $('#toggle-all').on('change', this.toggleAll.bind(this));
      $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
      $('#todo-list')
        .on('change', '.toggle', this.toggle.bind(this))
        .on('dblclick', 'label', this.edit.bind(this))
        .on('keyup', '.edit', this.editKeyup.bind(this))
        .on('focusout', '.edit', this.update)
        .on('click', '.destroy', this.destroy.bind(this));

      this.enableDrag();
    },
    listenToExternalEvents: function() {
      this.model.loaded.then(function() {
        this.model.onRemote('insert', this.renderNewTodo.bind(this));
        this.model.onRemote('remove', this.renderDeletedTodo.bind(this));
        this.model.onRemote('reorder', this.renderMovedTodo.bind(this));
        this.model.onRemote('toggle', this.renderToggledTodo.bind(this));
        this.model.rtTodos.forEach(function(rtTodo, index) {
          this.listenToTodoEvents(index);
        }.bind(this));
      }.bind(this));
    },
    listenToTodoEvents: function(todoIndex) {
      this.model.onTodoRemote(todoIndex, 'text-change', this.renderChangedTodo.bind(this));
      this.model.onTodoRemote(todoIndex, 'text-insert', this.renderTodoLabelInsert.bind(this));
      this.model.onTodoRemote(todoIndex, 'text-remove', this.renderTodoLabelDelete.bind(this));
    },
    renderNewTodo: function(todo) {
      $('#todo-list').append(this.todoTemplate(todo));
      this.renderCounters();
    },
    renderDeletedTodo: function(index) {
      var elToRemove = $('#todo-list li')[index];
      if(elToRemove) {
        $(elToRemove).remove();
        this.renderCounters();
      }
    },
    renderMovedTodo: function(fromIndex, toIndex) {
      var manipulationFn = fromIndex > toIndex ? 'before' : 'after';
      var elToMove = $($('#todo-list li')[fromIndex]);

      // if this element is currently being edited, prevent the focusout event from being fired, 
      // which would inadvertently persist the current changes.  
      if(elToMove.hasClass('editing')) {
        $('#todo-list').off('focusout', '.edit', this.update);
      }

      $($('#todo-list li')[toIndex])[manipulationFn](function() {
        return elToMove;
      }).each(function() {
        // Re-enable the event and refocus after the move is complete.
        $('#todo-list').on('focusout', '.edit', this.update);
        elToMove.find('input.edit').focus();
      }.bind(this));
    },
    renderToggledTodo: function(id, completed) {
      var el = this.getItemElementById(id);
      el.toggleClass('completed', completed);
      el.find('input.toggle').prop('checked', completed);
      this.renderCounters();
    },
    renderChangedTodo: function(id, newTitle) {
      var el = this.getItemElementById(id);
      el.find('label').html(newTitle);
    },
    renderTodoLabelInsert: function(id, index, value) {
      var labelEl = this.getItemElementById(id).find('label');
      var label = labelEl.html();
      if (index >= 0 && index <= label.length) {
        var newLabel = label.substr(0, index) + value + label.substr(index);
        labelEl.html(newLabel);
        this.getItemElementById(id).find('input.edit').val(newLabel);
      }
    },
    renderTodoLabelDelete: function(id, index) {
      var labelEl = this.getItemElementById(id).find('label');
      var label = labelEl.html();
      if (index >= 0 && index <= label.length - 1) {
        var newLabel = label.substr(0, index) +  label.substr(index + 1);
        labelEl.html(newLabel);
        this.getItemElementById(id).find('input.edit').val(newLabel);
      }
    },
    render: function () {
      var todos = this.model.getViewTodos();
      $('#todo-list').html(this.todoTemplate(todos));
      this.renderCounters();
      $('#new-todo').focus();
    },
    renderCounters: function() {
      var todos = this.model.getViewTodos();
      $('#toggle-all').prop('checked', this.model.getActiveTodoCount() === 0);
      $('#main').toggle(todos.length > 0);
      this.renderFooter();
    },
    renderFooter: function () {
      var todoCount = this.model.rtTodos.length();
      var activeTodoCount = this.model.getActiveTodoCount();
      var template = this.footerTemplate({
        activeTodoCount: activeTodoCount,
        activeTodoWord: util.pluralize(activeTodoCount, 'item'),
        completedTodos: todoCount - activeTodoCount,
        filter: this.model.filter
      });

      $('#footer').toggle(todoCount > 0).html(template);
    },
    toggleAll: function (e) {
      var isChecked = $(e.target).prop('checked');
      this.model.toggleAll(isChecked);
      this.render();
    },
    destroyCompleted: function () {
      this.model.deleteCompletedTodos();
      this.model.resetFilter();
      this.render();
    },
    // accepts an element from inside the `.item` div and
    // returns the corresponding index in the `todos` array
    idFromEl: function (el) {
      return $(el).closest('li').data('id');
    },
    getItemElementById: function(id) {
      return $('#todo-list li[data-id="' + id + '"]');
    },
    create: function (e) {
      var $input = $(e.target);
      var val = $input.val().trim();

      if (e.which !== ENTER_KEY || !val) {
        return;
      }

      this.model.addTodo({
        id: util.uuid(),
        title: val,
        completed: false
      });

      $input.val('');

      this.render();
    },
    toggle: function (e) {
      var id = this.idFromEl(e.target);
      this.model.toggleTodo(id);
      this.render();
    },
    edit: function (e) {
      this.disableDrag();
      var $input = $(e.target).closest('li').addClass('editing').find('.edit');
      $input.val($input.val()).focus();
    },
    editKeyup: function (e) {
      if (e.which === ENTER_KEY) {
        e.target.blur();
      }

      if (e.which === ESCAPE_KEY) {
        $(e.target).data('abort', true).blur();
      }
    },
    update: function (e) {
      var el = e.target;
      var $el = $(el);
      var val = $el.val().trim();

      if (!val) {
        this.destroy(e);
        return;
      }

      if ($el.data('abort')) {
        $el.data('abort', false);
      } else {
        var id = this.idFromEl(el);
        this.model.editTodo(id, {title: val});
      }

      this.render();
      this.enableDrag();
    },
    destroy: function (e) {
      var id = this.idFromEl(e.target);
      this.model.deleteTodo(id);
      this.render();
    },
    dragStart: function(e) {
      var listItemEl = $(e.currentTarget);
      this.draggedEl = listItemEl;
      e.originalEvent.dataTransfer.effectAllowed = 'move';
      e.originalEvent.dataTransfer.setData('text/plain', listItemEl.data('id'));
      listItemEl.addClass('dragging');
    },
    dragEnd: function(e) {
      var listItemEl = $(e.currentTarget);
      listItemEl.removeClass('dragging');
    },
    dragOver: function(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      return false;
    },
    dragEnter: function(e) {
      var el = $(e.currentTarget);
      el.addClass('drag-over');
    },
    dragLeave: function(e) {
      var el = $(e.currentTarget);
      el.removeClass('drag-over');
    },
    drop: function(e) {
      var listItemEl = $(e.currentTarget);
      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // Don't do anything if dropping the same column we're dragging.
      if (this.draggedEl != listItemEl) {
        this.model.moveTodo(this.draggedEl.data('id'), listItemEl.data('id'));
        this.render();
      }
      return false;
    },
    enableDrag: function() {
      $('#todo-list')
        .on('dragstart', 'li', this.dragStart)
        .on('dragend', 'li', this.dragEnd)
        .on('dragenter', 'li', this.dragEnter)
        .on('dragleave', 'li', this.dragLeave)
        .on('dragover', 'li', this.dragOver)
        .on('drop', 'li', this.drop);
      $('#todo-list li').attr('draggable', true);
    },
    disableDrag: function() {
      $('#todo-list')
        .off('dragstart', 'li', this.dragStart)
        .off('dragend', 'li', this.dragEnd)
        .off('dragenter', 'li', this.dragEnter)
        .off('dragleave', 'li', this.dragLeave)
        .off('dragover', 'li', this.dragOver)
        .off('drop', 'li', this.drop);
      $('#todo-list li').removeAttr('draggable');
    }
  };

  var util = {
    // this is from the TodoMVC jQuery example
    uuid: function () {
      /* jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },
    pluralize: function (count, word) {
      return count === 1 ? word : word + 's';
    }
  };

  window.app.main = new App();
});
