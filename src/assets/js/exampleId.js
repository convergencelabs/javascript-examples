var convergenceExampleId = (function () {
  function createUUID(){
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  const url = new URL(location.href);
  let id = url.searchParams.get('id');
  if (!id) {
    id = createUUID();
    url.searchParams.append('id', id);
    window.history.pushState({},"", url.href);
  }
  return id;
})();

function newWindowWithExample() {
  window.open(window.location.href, "_blank");
}