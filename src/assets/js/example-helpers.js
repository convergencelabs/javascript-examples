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
};

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

function randomDisplayName() {
  return "User-" + Math.round(Math.random() * 10000);
}

function exampleLoaded() {
  const loading = document.getElementById("loading");
  if (loading.parentNode) {
    loading.parentNode.removeChild(loading);
  }

  const content = document.getElementById("example-content");
  content.style.visibility = "visible";
}
