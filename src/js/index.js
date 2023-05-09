(function ($) {
    if ($("#enlargeWrap").length === 0) {
        $('body').append(`
         <div id="enlargeWrap"><div class="enlarge-layer"></div></div>
         <style>
         #enlargeWrap {
             position: fixed;
             top: 0;
             left: 0;
             width: 100vw;
             height: 100vh;
             z-index: 100000;
             display: none;
           }
           #enlargeWrap .enlarge-layer {
             width: 100%;
             height: 100%;
             background: rgba(0, 0, 0, 0.8);
             position: absolute;
             left: 0;
             top: 0;
             display: none;
           }
           #enlargeWrap .enlargeImgBox {
             position: absolute;
             left: 0;
             top: 0;
             z-index: 1;
             width: fit-content;
             height: fit-content;
             max-width: 100vw;
             max-height: 100vh;
             pointer-events: none;
             opacity: 0;
             display: flex;
             align-items: center;
             justify-content: center;
           }
           #enlargeWrap .enlargeImgBox img {
             display: block;
             pointer-events: auto;
             width: auto;
             height: auto;
             max-width: 100%;
             max-height: 100%;
           }
         </style>
         `);
    }
    const enlargeWrap = $("#enlargeWrap");
    let isHandleClose = true;
    let resizeTimer = null;
    let attrs = null;

    $(window).on('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            bigImgToMiddle();
        }, 50)
    })

    function bigImgToMiddle(duration = 300, callback) {
        const enlargeImgBox = enlargeWrap.find('.enlargeImgBox')

        let winWidth = document.documentElement.clientWidth,
            winHeight = document.documentElement.clientHeight,
            bigImgWidth = winWidth * 0.8,
            bigImgHeight = winHeight * 0.8;

        let left = winWidth / 2 - bigImgWidth / 2;
        let top = winHeight / 2 - bigImgHeight / 2;

        enlargeImgBox.animate({
            width: bigImgWidth,
            height: bigImgHeight,
            left,
            top,
        }, duration, function () {
            typeof callback === 'function' && callback();
        })
    }

    $("#enlargeWrap").on('click', '.enlarge-layer', function () {
        if (!isHandleClose) return;
        enlargeWrap.find('.enlarge-layer').fadeOut(300);
        enlargeWrap.find('.enlargeImgBox').animate({
            //  ...attrs,
            opacity: 0
        }, 200, () => {
            attrs = null;
            enlargeWrap.hide().find('.enlargeImgBox').remove();
            $('body').css('overflow', 'initial');
            setTimeout(function () {
                isHandleClose = false
            }, 50);
        });
    })

    function imgEnkarge(el, child) {
        const elem = $(el);
        elem.css('cursor', 'pointer');
        elem.on('click', child, function () {
            const self = $(this);
            let src = $(this).attr('src');
            let img = new Image();
            img.src = src;
            attrs = {
                width: self.width(),
                height: self.height(),
                left: self.offset().left,
                top: self.offset().top - $(window).scrollTop(),
            }
            let attrs2 = JSON.parse(JSON.stringify(attrs));
            attrs2.opacity = 1;
            enlargeWrap.append('<div class="enlargeImgBox"></div>');
            enlargeWrap.find('.enlargeImgBox').css(attrs2).html(img);
            $('body').css('overflow', 'hidden');
            enlargeWrap.show();
            enlargeWrap.find('.enlarge-layer').fadeIn(500);
            bigImgToMiddle(500, function () {
                isHandleClose = true
            });
        })
    }
    $.__proto__.imgEnkarge = imgEnkarge;
})($);