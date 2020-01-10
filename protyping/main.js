$(document).ready(function () {
    var $editableContent, height;
    $editableContent = $("#editableContent");
    height = $editableContent.height();
    console.log(height);

    $editableContent.keyup(function () {
        if ($editableContent.height() == height) {
            return;
        }
        height = $editableContent.height();
        alert('height changed');
        console.log(height);
    });

    $(function() {
        $('#test').focus();
    });

    $('#test').on('keypress', function(event) {
        console.log(event.keyCode);
        document.getElementById('test').innerHTML += String.fromCharCode(event.keyCode);

        // switch(event.keyCode){
        //     //....your actions for the keys .....
        // }
    });


});
