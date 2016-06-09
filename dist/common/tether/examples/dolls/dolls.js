(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var tethers = [];

document.addEventListener('DOMContentLoaded', function(){
  dragging = null;

  document.body.addEventListener('mouseup', function(){
    dragging = null;
  });

  document.body.addEventListener('mousemove', function(e){
    if (dragging){
      dragging.style.top = e.clientY + 'px';
      dragging.style.left = e.clientX + 'px';

      Tether.position()
    }
  });

  document.body.addEventListener('mousedown', function(e){
    if (e.target.getAttribute('data-index'))
      dragging = e.target;
  })

  var count = 60;
  var parent = null;
  var dir = 'left';
  var first = null;

  while (count--){
    var el = document.createElement('div');
    el.setAttribute('data-index', count);
    document.querySelector('.scroll').appendChild(el);

    if (!first)
      first = el;
 
    if (count % 10 === 0)
      dir = dir == 'right' ? 'left' : 'right';

    if (parent){
      tethers.push(new Tether({
        element: el,
        target: parent,
        attachment: 'middle ' + dir,
        targetOffset: (dir == 'left' ? '10px 10px' : '10px -10px')
      }));

    }

    parent = el;
  }

  initAnim(first);
});

function initAnim(el){
  var start = performance.now()
  var last = 0;
  var lastTop = 0;
  var tick = function(){
    var diff = performance.now() - last;

    if (!last || diff > 50){
      last = performance.now();

      var nextTop = 50 * Math.sin((last - start) / 1000);

      var curTop = parseFloat(el.style.top || 0);
      var topChange = nextTop - lastTop;
      lastTop = nextTop;

      var top = curTop + topChange;

      el.style.top = top + 'px';

      Tether.position();
    }

    requestAnimationFrame(tick);
  };

  tick();
}

},{}]},{},[1])