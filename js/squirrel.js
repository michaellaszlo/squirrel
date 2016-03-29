var Squirrel = (function () {

  function load() {
    console.log('load');
  }

  return {
    load: load
  };
})();

onload = Squirrel.load;
