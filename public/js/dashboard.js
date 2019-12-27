function menuToggle() {
  $('#menu-hide').toggle();
  $('#menu-show').toggle();
  $("#wrapper").toggleClass("toggled");
  $("#page-content-wrapper").toggleClass("menu-toggled");
}

function dropdownSubject(item) {
  $('#click'+item).toggleClass('subject-sidebar-link-active');
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

function deleteSubModal(subjectId) {
  $('#deleteSub').modal('show');
  document.getElementById('deleteSubModalLink').href = "/removesub/" + subjectId;
}

function showPage(page) {
  $('iframe').hide();

  $('#' + page).show();
}

function settingsPage() {
  $('iframe').hide();
  $('#iframeMain').show();
  document.getElementById('iframeMain').src = "/settings";
}
