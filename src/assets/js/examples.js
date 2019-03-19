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

const copyUrlToClipboard = () => {
  const el = document.createElement('textarea');
  el.value = window.location.href;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }

  toastr["success"]("URL Copied");
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "showDuration": "300",
    "hideDuration": "500",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
};
