(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(window).load(function(){
    var $form = $('.cont_create_board');
    $form.submit(function(){
        var $this = $(this);
        var board_theme = $this.find('input[name=board_theme]').val();
        alert(board_theme);
        $.ajax({
            'url': '/apis/create',
            'type': 'POST',
            'data': {
                'board_theme': board_theme
            } ,
            'success': function(data){
                console.log(data);
            },
            'error': function(err){
                console.log('ERROR: '+err);
            },
            'complete': function(){
                console.info('done');
            }
        });
    });
});

},{}]},{},[1])