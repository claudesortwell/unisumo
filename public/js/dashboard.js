function menuToggle() {
  $('#menu-hide').toggle();
  $('#menu-show').toggle();
  $("#wrapper").toggleClass("toggled");
}

function dropdownSubject(item) {
  $('#'+item).toggle();
}

function radioSelect(choice, item) {
  document.getElementById(choice).checked = true;
  
  for(var i = 0; i < 10; i++) {
    $('#icon-radio' + i).removeClass('icon-radio-select');
  }

  $(item).addClass('icon-radio-select');
}

function radioColorSelect(choice, item) {
  document.getElementById(choice).checked = true;
  
  for(var i = 0; i < 5; i++) {
    $('#icon-radio-color' + i).removeClass('icon-radio-select');
  }

  $(item).addClass('icon-radio-select');
}
