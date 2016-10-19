var Squirrel = (function () {
  var containers = {},
      dimensions = {};

  function Icon(kind) {
    this.element = document.createElement('div');
    this.element.className = 'icon ' + kind;
    this.width = dimensions[kind].width;
    this.height = dimensions[kind].height;
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    containers.chute.appendChild(this.element);
    this.place(0, 0);
  }
  Icon.prototype.place = function (x, y) {
    this.x = x;
    this.y = y;
    this.element.style.left = x - this.width / 2 + 'px';
    this.element.style.top = y - this.height / 2 + 'px';
  };
  Icon.prototype.slide = function (x1, y1, totalSeconds, x0, y0) {
    var seconds,
        icon = this,
        startTime = Date.now();
    if (x0 === undefined) {
      x0 = this.x;
      y0 = this.y;
    }
    function update() {
      seconds = (Date.now() - startTime) / 1000;
      icon.place(Math.min(x0 + (x1 - x0) * seconds / totalSeconds, x1),
                 Math.min(y0 + (y1 - y0) * seconds / totalSeconds, y1));
      if (seconds < totalSeconds) {
        requestAnimationFrame(update);
      }
    }
    update();
  };

  function Acorn(kind) {
    this.kind = kind;
    this.icon = new Icon(kind);
  }
  Acorn.prototype.drop = function () {
    this.icon.place(dimensions.chute.width / 2, 0 - this.icon.height / 2);
    this.icon.slide(dimensions.chute.width / 2,
                    dimensions.chute.height / 2, 1);
  };

  function processClick(event) {
    var pos = M.getMousePosition(event),
        offset = this.offset,
        x = pos.x - offset.left,
        y = pos.y - offset.top;
    console.log(x, y);
  }

  function destroyAcorn() {
    var acorn = this;
  }

  function dropOneAcorn() {
    var acorn = new Acorn('acorn');
    acorn.clickResponse = destroyAcorn;
    acorn.drop();
  }
  
  function startGame() {
    containers.chute.onclick = processClick;
    dropOneAcorn();
  }

  function load() {
    containers.chute = document.getElementById('chute');
    containers.chute.offset = M.getOffset(containers.chute, document.body);
    console.log(containers.chute.offset);
    dimensions.chute = {
      width: containers.chute.offsetWidth,
      height: containers.chute.offsetHeight
    };
    dimensions.acorn = {
      width: 50,
      height: 50
    }
    startGame();
  }

  return {
    load: load
  };
})();

onload = Squirrel.load;
