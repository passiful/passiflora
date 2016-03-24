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
                alert(data);
            },
            'error': function(err){
                alert('ERROR: '+err);
            },
            'complete': function(){
                alert('done');
            }
        });
    });
});
