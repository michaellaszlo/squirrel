var Squirrel = (function () {
  var containers = {},
      dimensions = {},
      acorns,
      score;

  function Icon(kind, owner) {
    this.owner = owner;
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
      if (icon.destroyed) {
        return;
      }
      seconds = (Date.now() - startTime) / 1000;
      if (seconds >= totalSeconds) {
        icon.owner.destroy();
      }
      icon.place(Math.min(x0 + (x1 - x0) * seconds / totalSeconds, x1),
                 Math.min(y0 + (y1 - y0) * seconds / totalSeconds, y1));
      requestAnimationFrame(update);
    }
    update();
  };

  function Acorn(kind) {
    this.kind = kind;
    this.icon = new Icon(kind, this);
  }
  Acorn.prototype.drop = function () {
    this.icon.place(dimensions.chute.width/2, -this.icon.height/2);
    this.icon.slide(dimensions.chute.width/2,
                    dimensions.chute.height + this.icon.height/2, 3);
  };

  function processClick(event) {
    var pos = M.getMousePosition(event),
        offset = this.offset,
        x = pos.x - offset.left,
        y = pos.y - offset.top,
        i, acorn, icon, left, right, top, bottom;
    for (i = 0; i < acorns.length; ++i) {
      acorn = acorns[i];
      icon = acorn.icon;
      left = icon.x - icon.width/2;
      right = icon.x + icon.width/2;
      top = icon.y - icon.height/2;
      bottom = icon.y + icon.height/2;
      if (left <= x && x <= right && top <= y && y <= bottom) {
        acorn.handleClick();
      }
    }
  }

  function destroyAcorn() {
    var acorn = this,
        icon = acorn.icon;
    icon.destroyed = true;
    icon.element.className += ' destroyed';
    score += 1;
    updateScoreDisplay();
    acorns.splice(acorn.index, 1);
    dropOneAcorn();
  }

  function dropOneAcorn() {
    if (acorns.length >= 1) {
      return;
    }
    var acorn = new Acorn('acorn');
    acorn.destroy = destroyAcorn.bind(acorn);
    acorn.handleClick = acorn.destroy;
    acorn.index = acorns.length;
    acorns.push(acorn);
    acorn.drop();
  }

  function updateScoreDisplay() {
    document.getElementById('score').innerHTML = score;
    document.getElementById('scoreNounSuffix').innerHTML =
        (score == 1 ? '' : 's');
  }
  
  function startGame() {
    acorns = [];
    score = 0;
    containers.chute.onclick = processClick;
    dropOneAcorn();
  }

  function load() {
    containers.chute = document.getElementById('chute');
    containers.chute.offset = M.getOffset(containers.chute, document.body);
    dimensions.chute = {
      width: containers.chute.offsetWidth,
      height: containers.chute.offsetHeight
    };
    dimensions.acorn = {
      width: 50,
      height: 50
    };
    startGame();
  }

  return {
    load: load
  };
})();

onload = Squirrel.load;
