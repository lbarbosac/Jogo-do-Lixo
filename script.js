
$('.botao-iniciar').on('focus', function() {
    
    $(this).css({ 'z-index': 99 });
    
    $('escuro').fadeIn(1000);
  });
  
  $('.botao-iniciar').on('blur', function() {
    
    $('escuro').fadeOut(1000);

    $(this).css({ 'z-index': 1 });
  });