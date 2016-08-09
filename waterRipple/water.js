$("ul li").click(function(e) {
 
  if ($(this).hasClass('slider')) {
    return;
  }
 
  var whatTab = $(this).index();
 
  var howFar = 160 * whatTab;
 
  $(".slider").css({
    left: howFar + "px"
  });
 
  $(".ripple").remove();
 
  var posX = $(this).offset().left,
      posY = $(this).offset().top,
      buttonWidth = $(this).width(),
      buttonHeight = $(this).height();
 
  $(this).prepend("<span class='ripple'></span>");
 
  if (buttonWidth >= buttonHeight) {
    buttonHeight = buttonWidth;
  } else {
    buttonWidth = buttonHeight;
  }
 
  var x = e.pageX - posX - buttonWidth / 2;
  var y = e.pageY - posY - buttonHeight / 2;
 
  $(".ripple").css({
    width: buttonWidth,
    height: buttonHeight,
    top: y + 'px',
    left: x + 'px'
  }).addClass("rippleEffect");
   
}); 