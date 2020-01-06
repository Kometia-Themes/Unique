var win = $(window);

$(document).ready(
  function() {
  // Common functions
  var disabled = function() {
    $('html').on('click', '.disabled', function(event){
       event.preventDefault();
    });
  }
  var formatMoney = function(price) {
    var formatPrice = (price /= 100);
    formatPrice = formatPrice.toFixed(2);
    formatPrice = formatPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "$" + formatPrice + " {{ store.currency }}";
  };
  // Pluriliza qty
  var quantityPluralize = function(data) {
    return data > 1 ? data +' productos' : data +' producto';
  }

  $('[data-toggle="tooltip"]').tooltip({ placement: "bottom" });
  // If a small mobile
  var isSmallMobile = function() {
    return ( win.width() < 320 ? true : false );
  }
  // Init slick slider
  var initSlider = function() {
    $('.slider').slick({
      autoplay: true,
      autoplaySpeed: 4000,
      fade: true,
      prevArrow: $('.arrow-element.left-arrow'),
      nextArrow: $('.arrow-element.right-arrow')
    });
  }
  initSlider();

  var setBodyPaddingTop = function() {
    var headerHeigth = $('header.header').outerHeight();
    $('body').css({'padding-top': headerHeigth});
  }
  setBodyPaddingTop();

  // Define max height for child elements
  var setHeightElement = function(boxArray, tallestElement) {
    for(var i = 0; i < boxArray.length; i++){
      $(boxArray[i]).css({'height' : tallestElement +'px' });
    }
    boxArray = [];
  }
  // Apply height
  var alignHeights = function (){
    if(!isSmallMobile()) {
      var tallestElement = 0,
      currentElementHeight = 0,
      boxArray = [],
      container = $('.symmetrical-container'),
      boxArray = container.children('.symmetrical');
      for(var i = 0; i < boxArray.length; i++){
        $(boxArray[i]).css({'height' : 'auto'});
        currentElementHeight = $(boxArray[i]).outerHeight();
        if(currentElementHeight > tallestElement){
          tallestElement = currentElementHeight;
        }
      }
      setTimeout(setHeightElement(boxArray, tallestElement), 200);
    } else {
      $('.symmetrical').css({'height' : 'auto'});
    }
  }
  // Set product heights
  var getProductHeight = function() {
    var type1 = $('.image_square');
    var type2 = $('.image_landscape');
    var type3 = $('.image_portrait');
    $(type1).css({ "height": type1.width() });
    $(type2).css({ "height": type2.width() * .62 });
    $(type3).css({ "height": type3.width() * 1.62 });
  }
  // Init dropdown menu
  var initMenuDropdown = function() {
    $("li.main-menu_dropdown").on("click", function(event) {
      event.stopPropagation();
      $(this).toggleClass('active');
      $(this).siblings().removeClass('active');
    });
    if (win > 767) {
      $('.main-menu_menu').mouseleave(function() {
       $(this).parent().removeClass('active');
      });
    }
    $(window).click(function() {
      $("li.main-menu_dropdown").removeClass('active');
    });
  }

  // Get Product width
  var getWidth = function(square, rectangle, rectanglefull) {
    var square = $(square).width();
    var rectangle = $(rectangle).width();
    var rectanglefull = $(rectanglefull).width();
    $('.collection__item--square').css({ 'height': square })
    $('.collection__item--rectangle').css({ 'height': rectangle * .62 })
    $('.collection__item--rectangle--full').css({ 'height': rectanglefull * .52 })
  }
  getWidth('.collection__item--square','.collection__item--rectangle', '.collection__item--rectangle--full');

  var getUrlParameter = function() {
    // TODO get orderby params
    var _url = decodeURIComponent(window.location.search.substring(1));
    var _el = $("form.filters select option");
    if (_url.length) {
      var _param = _url.split("=")[1];
      _el.each(function(){
        if ($(this).val() == _param) {
          $(this).prop("selected", true);
        } else {
          $(this).prop("selected", false);
        }
      });
    }
    $("form.filters").selectpicker("refresh");
  }

  var filterBarExist = function() {
    return $('form.filters').length > 0 ? true : false;
  }
  var updateFilterOption = function() {
    var _existFilterBar = filterBarExist();
    if (_existFilterBar) {
      getUrlParameter();
    }
  }
  updateFilterOption();

  $(".sidebar__content .filter_order").change(
    function() {
      this.form.submit();
    }
  );

  $(".filter_order").change(
    function() {
      this.form.submit();
    }
  );

  // AJAX Add to Cart Component
  // Add Product to cart by ajax
  var root = window.location.hostname;
  var PROTOCOL = window.location.protocol;
  var getAjaxStoteUrl = function(type) {
    return PROTOCOL + '//' + root + '/' + type;
  }
  var ajaxConfig = {
    getUrl:   getAjaxStoteUrl('cart.json'),
    postUrl: getAjaxStoteUrl('cart/add.js')
  }
  var showAjaxCart = function() {
    $('.ajaxcart').animate({
      right: "0"
    }, 600);
    setTimeout(function() {
      hideAjaxCart(false);
    }, 3000);
  }

  var ajaxCartImage = $('.ajaxcart .ajaxcart__content .ajaxcart__image');
  var ajaxCartProductCaption = $('.ajaxcart .ajaxcart__content .ajaxcart__description .ajaxcart__caption');
  var ajaxCartProductCaptionVariant = $('.ajaxcart .ajaxcart__content .ajaxcart__description .ajaxcart__caption_variant');
  var ajaxCartProductCaptionAlert = $('.ajaxcart .ajaxcart__content .ajaxcart__description .ajaxcart__caption_alert span.label');
  var ajaxCartProductPrice = $('.ajaxcart .ajaxcart__content .ajaxcart__description .ajaxcart__price strong');
  var ajaxCartResumeSubtotal = $('.ajaxcart .ajaxcart__content .ajaxcart__resume .modal-body__subtotal');
  var ajaxCartResumeItems = $('.ajaxcart .ajaxcart__content .ajaxcart__resume .ajaxcart__number-items');
  var clearAjaxCart = function() {
    ajaxCartImage.attr('src', '');
    ajaxCartProductCaption.empty();
    ajaxCartProductCaptionVariant.empty();
    ajaxCartProductPrice.empty();
    ajaxCartResumeSubtotal.empty();
    ajaxCartResumeItems.empty();
    ajaxCartProductCaptionAlert.text('');
  }

  var hideAjaxCart = function(cursor_is_over) {
    var _cursor_is_over = cursor_is_over;
    var isOver = $('.ajaxcart').is(":hover");
    if (_cursor_is_over || !isOver) {
      $('.ajaxcart').animate({
        right: "-100%"
      }, 600 );
    }
  }
  $( ".ajaxcart" ).mouseleave(function() {
    hideAjaxCart(true);
  });
  var updateCartQty = function(items) {
    var items = items > 0 ? items : 0;
    $(".cart-notification").text(items);
  }
  var displayCartWarning = function(data) {
    ajaxCartProductCaptionAlert.empty();
    var newText = data;
    ajaxCartProductCaptionAlert.html(newText);
    ajaxCartProductCaptionAlert.toggleClass('hidden');
  }
  var mergeArrays = function(arr1, arr2) {
    if (arr1 != null && arr2 != null ) {
      var l = Math.min(arr1.length, arr2.length),
            result = [],
            i;
      for( i=0; i<l; i++) {
          result.push(arr1[i]+": "+arr2[i]);
      }
      return result.join(', ');
    }
    return false;
  }

  var getProductVariants = function(data, sku) {
    var modifiers, values, result;
    $.each(data, function(key, value){
      if (typeof value.product.modifiers !== "undefined" && value.sku.id === sku ) {
        modifiers = value.product.modifiers;
      }
    });
    $.each(data, function(key, value){
      if (typeof value.sku.id !== "undefined" && value.sku.id === sku) {
        values = value.sku.modifiers;
      }
    });
    result = modifiers != null && values != null ? mergeArrays(modifiers, values) : '';
    return result;
  }

  var buildAjaxCart = function(obj, sku, data, total) {
    clearAjaxCart();
      var sku = sku;
      var total = total;
      $.each(data, function(_, value) {
          if (sku === value.sku.id) {
              var image_url = value.sku.image_url ? value.sku.image_url + '&w=100&fit=bounds' : '{{ "placeholders/product-11.jpg" | global_img_url }}'
              ajaxCartImage.attr('src', image_url);
              ajaxCartProductCaption.text(value.product.name);
              ajaxCartProductCaptionVariant.text(getProductVariants(data, sku));
              ajaxCartProductPrice.text(value.quantity + ' x ' +  formatMoney(value.price));
              ajaxCartResumeSubtotal.text('Total ' + formatMoney(total));
              ajaxCartResumeItems.text('Hay ' + quantityPluralize(Object.keys(data).length) + ' en tu carrito.');
          }
      })
  }

  var addSimpleProductToCarByAjax = function(sku, qty) {
    var productSku = sku;
    var qty = qty == null ? 1 : qty;
    $.post(ajaxConfig.postUrl,
            {'sku_id':productSku,'quantity':qty})
    .done(function(data) {
      AjaxCart = data.object || {};
      buildAjaxCart(AjaxCart, sku, AjaxCart.items, AjaxCart.total_price);
      extraData = data.extra ? 1 : 0;
      updateCartQty(AjaxCart.total_items);
      if(extraData){
        displayCartWarning(data.extra[1]);
      }
    showAjaxCart();
    })
    .done(function(data){});
  }

  var addProductToCartByAjax = function() {
    var sku = $("input#js-sku-id").val();
    var qty = $("#quantity").val();
    addSimpleProductToCarByAjax(sku, qty);
  }
  // Add product in product page
  $('#js-add-to-cart').on('click', function(e) {
    e.preventDefault();
    var el = $(this);
    el.prop('disabled', true);
    setTimeout(function(){
      el.prop('disabled', false);
    }, 3000);
    addProductToCartByAjax();
  });

  $('.close-ajax-cart').on('click', function() {
    hideAjaxCart(true);
  });
  // End ajax component


  win.on('load', function() {
    // Load when windows is full loaded
    getProductHeight();
    initMenuDropdown();
    // Remove admin bar if exist
    var $adminBar = $('#admin-bar-iframe');
    if ($adminBar.length) {
      $('body').css({ position: 'initial' });
    }
    $("p:contains('<meta charset=\"utf-8\" \/>')").remove();
  }).resize(function() {
    // Load when windows is resized
    getProductHeight();
    setBodyPaddingTop();
    initMenuDropdown();
  });
  win.on("load resize",function(e){
    // Load when window is loaded or resize
    alignHeights();
  });
});
