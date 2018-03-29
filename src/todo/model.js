(function (window) {
  'use strict';

  /**
   * Creates a new Model instance and hooks up the storage.
   *
   * @constructor
   * @param {object} storage A reference to the client side storage class
   */
  function Model(name) {
    this.loaded = Convergence.connectAnonymously(DOMAIN_URL).then(domain => {
      this.domain = domain;
      return domain.models().openAutoCreate({
        collection: 'examples',
        id: name,
        data: {
          todos: []
        }
      })
    }).then(model => {
      this.rtModel = model;
      this.rtTodos = model.elementAt('todos');
    });
  }

  Model.prototype = {
    /* filters the todos and returns the base data associated with each. */
    getViewTodos: function () {
      var viewTodos = [];
      this.rtTodos.forEach(function (rtTodo) {
        if (!this.filter || this.filter === 'all') {
          viewTodos.push(rtTodo.value());
        } else if (this.filter === 'active' && !rtTodo.value().completed) {
          viewTodos.push(rtTodo.value());
        } else if (this.filter === 'completed' && rtTodo.value().completed) {
          viewTodos.push(rtTodo.value());
        }
      }.bind(this));
      return viewTodos;
    },
    getActiveTodoCount: function () {
      var count = 0;
      this.rtTodos.forEach(function (rtTodo) {
        if (!rtTodo.value().completed) {
          count++;
        }
      });
      return count;
    },
    resetFilter: function () {
      this.filter = 'all';
    },
    setFilter: function (filter) {
      this.filter = filter;
    },
    getTodo: function (id) {
      var todo;
      this.rtTodos.forEach(function (rtTodo) {
        if (!todo && rtTodo.get('id').value() === id) {
          todo = rtTodo;
        }
      });
      return todo;
    },
    getTodoIndex: function (id) {
      var index = -1;
      this.rtTodos.forEach(function (rtTodo, i) {
        if (index < 0 && rtTodo.get('id').value() === id) {
          index = i;
        }
      });
      return index;
    },
    toggleTodo: function (id) {
      var rtTodo = this.getTodo(id);
      if (rtTodo) {
        rtTodo.get('completed').value(!rtTodo.get('completed').value());
      }
    },
    toggleAll: function (completed) {
      this.rtTodos.forEach(function (rtTodo) {
        rtTodo.set('completed', completed);
      });
    },
    addTodo: function (todo) {
      this.rtTodos.push(todo);
    },
    editTodo: function (id, data) {
      var rtTodo = this.getTodo(id);
      if (rtTodo) {
        for (var key in data) {
          // the syntax here is important.  We could just call rtTodo.set(key, dta[key]), but that would
          // blow away any listeners on that rtString (the value of the "title" property), because we're
          // replacing the value via the parent.
          // Instead, we get the child rtString and replace its value with a new string.
          rtTodo.get(key).value(data[key]);
        }
      }
    },
    moveTodo: function (id, idToReplace) {
      var index = this.getTodoIndex(id);
      var newIndex = this.getTodoIndex(idToReplace);
      if (newIndex >= 0) {
        this.rtTodos.reorder(index, newIndex);
      }
    },
    deleteTodo: function (id) {
      var index = this.getTodoIndex(id);
      if (index >= 0) {
        this.rtTodos.remove(index);
      }
    },
    deleteCompletedTodos: function () {
      // start at the end so the indices don't shift while we're deleting elements
      for (var i = this.rtTodos.length(); i--; i >= 0) {
        if (this.rtTodos.get(i).get('completed').value() === true) {
          this.rtTodos.remove(i);
        }
      }
    },
    onRemote: function (eventType, callback) {
      switch (eventType) {
        case 'insert':
          this.rtTodos.on('insert', function (event) {
            callback(event.value.value(), event.index);
          });
          break;
        case 'remove':
          this.rtTodos.on('remove', function (event) {
            callback(event.index);
          });
          break;
        case 'reorder':
          this.rtTodos.on('reorder', function (event) {
            callback(event.fromIndex, event.toIndex);
          });
          break;
        case 'toggle':
          // Listen to any changes on the model, ignoring any that don't involve the 'completed' key.
          // We can get the appropriate todo from the relativePath of the event
          this.rtTodos.on('model_changed', function (event) {
            if (event.relativePath.length) {
              if (event.childEvent.name === 'set' && event.childEvent.key === 'completed') {
                var changedTodo = event.element.elementAt(event.relativePath).value();
                callback(changedTodo.id, changedTodo.completed);
              } else if (event.childEvent.name.toLowerCase() === 'value' && event.relativePath[1] === 'completed') {
                var changedTodo = event.element.elementAt(event.relativePath[0]).value();
                callback(changedTodo.id, changedTodo.completed);
              }
            }
          });
          break;
      }
    },
    onTodoRemote: function (todoIndex, eventType, callback) {
      var rtTodo = this.rtTodos.get(todoIndex);
      if (rtTodo) {
        var rtTitle = rtTodo.get('title');
        switch (eventType) {
          case 'text-change':
            rtTitle.on('value', function (event) {
              callback(rtTodo.value().id, rtTodo.value().title);
            });
            break;
        }
      }
    }
  };

  // Export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);
