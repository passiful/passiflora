(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* globals TetherBase */

const {getBounds, updateClasses, defer} = TetherBase.Utils;

TetherBase.modules.push({
  position({top, left}) {
    const {height, width} = this.cache('element-bounds', () => {
      return getBounds(this.element);
    });

    const targetPos = this.getTargetBounds();

    const bottom = top + height;
    const right = left + width;

    const abutted = [];
    if (top <= targetPos.bottom && bottom >= targetPos.top) {
      ['left', 'right'].forEach(side => {
        const targetPosSide = targetPos[side];
        if (targetPosSide === left || targetPosSide === right) {
          abutted.push(side);
        }
      });
    }

    if (left <= targetPos.right && right >= targetPos.left) {
      ['top', 'bottom'].forEach(side => {
        const targetPosSide = targetPos[side];
        if (targetPosSide === top || targetPosSide === bottom) {
          abutted.push(side);
        }
      });
    }

    const allClasses = [];
    const addClasses = [];

    const sides = ['left', 'top', 'right', 'bottom'];
    allClasses.push(this.getClass('abutted'));
    sides.forEach(side => {
      allClasses.push(`${ this.getClass('abutted') }-${ side }`);
    });

    if (abutted.length) {
      addClasses.push(this.getClass('abutted'));
    }

    abutted.forEach(side => {
      addClasses.push(`${ this.getClass('abutted') }-${ side }`);
    });

    defer(() => {
      if (!(this.options.addTargetClasses === false)) {
        updateClasses(this.target, addClasses, allClasses);
      }
      updateClasses(this.element, addClasses, allClasses);
    });

    return true;
  }
});

},{}]},{},[1])