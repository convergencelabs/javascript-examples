(function() {
  const sidebarContent = document.querySelector('#sidebar .sidebar-content');
  document.querySelector('#sidebar-toggle').addEventListener('click', function() {
    sidebarContent.classList.toggle('hidden');
    setTimeout(flipHandle, 250);
  });

  function flipHandle() {
    const togglerEls = document.querySelectorAll('#sidebar-toggle i');
    togglerEls.forEach(function(el) {
      el.classList.toggle('show');
    });
  }

  if(window.innerWidth <= 600) {
    sidebarContent.classList.add('hidden');
    flipHandle();
  }
}());

function convergenceToggleMenu() {
  document.querySelector('nav#header .links').classList.toggle('visible');
}
