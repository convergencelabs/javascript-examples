(function() {
  var sidebarEl = document.querySelector('#sidebar');
  var togglerEl = document.querySelector('#content .nav-toggle .collapse');
  document.querySelector('#content .nav-toggle').addEventListener('click', function() {
    sidebarEl.classList.toggle('hidden');

    setTimeout(function() {
      togglerEl.classList.toggle('show');
    }, 250);
  });

  if(window.innerHeight <= 800) {
    sidebarEl.classList.add('hidden');
    togglerEl.classList.remove('show');
  }
}());