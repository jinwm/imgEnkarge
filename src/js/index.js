(function (n) {
    let enlargeWrap;
    let isHandleClose = true;
    let resizeTimer = null;
    let attrs = null;
    let duration = 200;
    if ($("#enlargeWrap").length == 0) {
        enlargeWrap = create();
    }

    $(window).on('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = null;
        resizeTimer = setTimeout(function () {
            bigImgToMiddle(duration);
        }, duration)
    })

    $("#enlargeWrap").on('click', '.enlarge-close', function () {
        if (!isHandleClose) return;
        enlargeWrap.find('.enlarge-layer').fadeOut(duration);
        enlargeWrap.find('.enlargeImgBox').animate({
            //  ...attrs,
            opacity: 0
        }, duration, () => {
            attrs = null;
            enlargeWrap.hide().find('.enlargeImgBox').remove();
            $('body').css('overflow', 'initial');
            setTimeout(function () {
                isHandleClose = false
            }, 50);
        });
    })

    function create() {
        let enlargeWrap = document.createElement('div');
        enlargeLayer = document.createElement('div');
        enlargeWrap = $(enlargeWrap);
        enlargeLayer = $(enlargeLayer);

        enlargeLayer.attr({
            'class': 'enlarge-layer'
        }).css({
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0, 0, 0, 0.8)',
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'display': 'none'
        })
        enlargeWrap.attr({
            'id': 'enlargeWrap'
        }).css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100vw',
            'height': '100vh',
            'z-index': '100000',
            'display': 'none'
        }).append(enlargeLayer);
        $('body').append(enlargeWrap);
        return enlargeWrap;
    }

    function bigImgToMiddle(duration, callback) {
        const enlargeImgBox = enlargeWrap.find('.enlargeImgBox')
        let winWidth = document.documentElement.clientWidth,
            winHeight = document.documentElement.clientHeight,
            bigImgWidth, bigImgHeight;

        if (/iphone|android|ipod/i.test(navigator.userAgent.toLowerCase()) == true) {
            bigImgWidth = winWidth;
            bigImgHeight = winHeight * 0.8
        } else {
            bigImgWidth = winWidth * 0.8;
            bigImgHeight = winHeight * 0.8;
        }

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

    function imgEnkarge(el) {
        $(this).on('click', el || 'img', function () {
            const self = $(this);
            if (self.data('name') == 'imgEnkargeImg') {
                return;
            }
            let src = $(this).attr('src');
            img = new Image();
            img = $(img).css({
                'display': 'block',
                'pointer-events': 'auto',
                'width': 'auto',
                'height': 'auto',
                'max-width': '100%',
                'max-height': 'calc(100% - 15vw)'
            }).attr({
                'data-name': 'imgEnkargeImg',
                'src': src,
            });
            attrs = {
                width: self.width(),
                height: self.height(),
                left: self.offset().left,
                top: self.offset().top - $(window).scrollTop(),
            }
            let attrs2 = JSON.parse(JSON.stringify(attrs));
            attrs2.opacity = 1;
            let enlargeImgBox = document.createElement('div'),
                enlargeClose = document.createElement('div');
            enlargeImgBox = $(enlargeImgBox);
            enlargeClose = $(enlargeClose);
            enlargeClose.attr({
                'class': 'enlarge-close'
            }).css({
                'width': '10vw',
                'height': '10vw',
                'marginTop': '2%',
                'color': '#ffffff',
                'pointer-events': 'auto'
            }).html(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" style="display:block;" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>`)
            enlargeImgBox.attr({
                "class": "enlargeImgBox"
            }).css({
                'position': 'absolute',
                'left': '0',
                'top': '0',
                'z-index': '1',
                'width': 'fit-content',
                'height': 'fit-content',
                'max-width': '100vw',
                'max-height': '100vh',
                'pointer-events': 'none',
                'opacity': '0',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'flex-direction': 'column'
            }).css(attrs2).append(img).append(enlargeClose);
            $('body').css('overflow', 'hidden');
            enlargeWrap.append(enlargeImgBox).show().find('.enlarge-layer').fadeIn(500);
            bigImgToMiddle(500, function () {
                isHandleClose = true
            });
        })
    }
    n.prototype.imgEnkarge = imgEnkarge;
})($);

// 调用
// $('.imgBox').imgEnkarge('.img');
// $('.imgBox').imgEnkarge();
