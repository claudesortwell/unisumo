var docTextArea = document.getElementById('docTextArea');
var docName = document.getElementById('documentTitle');
var docId = document.getElementById('secretIdValue');
var docTimeSaved = document.getElementById('docTimeSaved');

//
$('#docTextArea').keyup(function(event) {
    if($('#docTextArea').height() > 1122.52){
        console.log(1);
    }
});

// Save the document updates
function saveDocData(){
    $.post('/doc/savedoc', {
        docId: docId.value,
        docName: docName.innerText,
        docText: docTextArea.innerHTML
    })
    return;
}

// Saving auto on keypresses
var timeout = null;
var keyPressed = 0;
// On key up after ammount of ms
docTextArea.onkeyup = function (e) {
    // If key pressed more than 500 times will save instantly
    keyPressed += 6;
    if(keyPressed > 3000){
        keyPressed = 3000;
    }
    
    docTimeSaved.innerText = "Saving....."

    clearTimeout(timeout);

    var waitTime = 3000 - keyPressed;
    
    timeout = setTimeout(function (){
        saveDocData();
        docTimeSaved.innerText = "Just Saved "
        keyPressed = 0;
    }, waitTime)
}

function addTags(tags) {
    document.execCommand(tags);
    $('#' + tags + '-option').toggleClass('doc-icon-active');
    docTextArea.focus();
}

// Keeping focus on the docTextArea after clicking a button
$('#bold-option').bind('mousedown',function(e) {
    e.preventDefault();
});
$('#italic-option').bind('mousedown',function(e) {
    e.preventDefault();
});
$('#underline-option').bind('mousedown',function(e) {
    e.preventDefault();
});

$('#docTextArea').mouseup(function(){
    $('#bold-option').removeClass('doc-icon-active');
    $('#italic-option').removeClass('doc-icon-active');
    $('#underline-option').removeClass('doc-icon-active');

    if (document.queryCommandState) {
        if(document.queryCommandState("bold")){
            $('#bold-option').addClass('doc-icon-active');
        }

        if(document.queryCommandState("italic")){
            $('#italic-option').addClass('doc-icon-active');
        }

        if(document.queryCommandState("underline")){
            $('#underline-option').addClass('doc-icon-active');
        }
    }
});

document.addEventListener("keydown", function (event) {
    if(event.ctrlKey && event.keyCode == 66) {
        $('#bold-option').toggleClass('doc-icon-active');
    } else if(event.ctrlKey && event.keyCode == 85) {
        $('#underline-option').toggleClass('doc-icon-active');
    } else if(event.ctrlKey && event.keyCode == 73) {
        $('#italic-option').toggleClass('doc-icon-active');
    }
});

$('#font-size-option').on('click', function(e) {
    // whatever other code this click event needs to run here...
    e.preventDefault();
});

$('#font-size-option').change(function() {
    changeFont($(this).val());
});

function changeFont(font) {
    var selection = window.getSelection(); // Gets selection
    if (selection.rangeCount) {
      // Creates a new element, and insert the selected text with the chosen font inside
      var e = document.createElement('span');
      e.style.fontFamily = font; 
      e.innerHTML = selection.toString();
  
      // https://developer.mozilla.org/en-US/docs/Web/API/Selection/getRangeAt
      var range = selection.getRangeAt(0);
      range.deleteContents(); // Deletes selected text…
      range.insertNode(e); // … and inserts the new element at its place
    }
}