(() => {
  let initParam = {}
  const images = new WeakMap();
  const attrName = 'view-large-image';
  let $viewLargeImage = document.getElementById('view-large-image');
  let $viewLargeMain = document.getElementById('view-large-main');
  let $viewLargeImageWrap = document.getElementById('view-large-image-wrap');
  let $viewLargeLoadingLayer = document.getElementById('view-large-loading-layer');
  let $viewLargeImageContainer = document.getElementById('view-large-image-container');
  let $viewLargeImg = document.getElementById('view-large-img');
  let $viewLargeImageClose = document.getElementById('view-large-image-close');
  let $viewLargeImageTransform = document.getElementById('view-large-image-transform');
  let isTransitioning = false;
  let $imgTarget = null;
  // 初始传入的容器与屏幕的倍率
  let containerScaleW = 1;
  let containerScaleH = 1;

  // 获取位置信息
  const getPosition = (target) => target.getBoundingClientRect();

  // 数据初始化
  const initData = (params) => {
    initParam = {
      ...initParam,
      ...params
    }

    // 获取所有view-large-image
    const $images = Array.from(document.querySelectorAll(`img[${attrName}]`)).filter(item => {
      return !item.hasAttribute('processed');
    })
    if ($images.length) {
      $images.forEach(item => {
        if (item.src) {
          if (!item.getAttribute('view-image')) {
            item.setAttribute('view-image', item.src);
          }
          item.setAttribute('processed', '');
          images.set(item, getPosition(item));
        }
      })
    }

    containerScaleW = initParam.width / document.documentElement.clientWidth;
    containerScaleH = initParam.height / document.documentElement.clientHeight;
    // console.log(images, 'images');
  }

  // 获取缩放后的图片尺寸
  const getScaleSize = () => {
    const { width, height } = initParam;
    const { naturalWidth } = $viewLargeImg;
    const { naturalHeight } = $viewLargeImg;

    const method = {
      'contain': () => {
        const result = {};
        const widthScale = width / naturalWidth;
        const heightScale = height / naturalHeight;
        const scale = Math.min(widthScale, heightScale);
        result.width = naturalWidth * scale;
        result.height = naturalHeight * scale;
        result.imgWidth = result.width;
        result.imgHeight = result.height;
        return result;
      }, 'cover': () => {
        const result = {};
        let scale = 1;
        if (width > height) {
          scale = width / naturalWidth;
        } else {
          scale = height / naturalHeight;
        }
        result.width = scale * naturalWidth;
        result.height = scale * naturalHeight;
        result.imgWidth = result.width
        result.imgHeight = result.height
        return result;
      }, 'fill': () => {
        const result = {};
        result.width = width;
        result.height = height;
        result.imgWidth = width;
        result.imgHeight = height;
        return result;
      }
    }
    return method[initParam.objectFit] ? method[initParam.objectFit]() : method.contain();
  }

  const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };

  const transition = (target) => {
    const targetRace = images.get(target);
    const { width, height, imgWidth, imgHeight } = getScaleSize();
    $viewLargeImageWrap.style.width = `${Math.min(width, initParam.width)}px`;
    $viewLargeImageWrap.style.height = `${Math.min(height, initParam.height)}px`;
    $viewLargeImg.style.width = `${imgWidth}px`;
    $viewLargeImg.style.height = `${imgHeight}px`;
    isTransitioning = true;
    const method = {
      fadeIn: () => {
        $viewLargeImg.style.opacity = 0;
        $viewLargeImg.style.transition = 'none';
        $viewLargeImageTransform.style.transition = 'none';
        $viewLargeImageTransform.style.width = `${Math.min(width, initParam.width)}px`;
        $viewLargeImageTransform.style.height = `${Math.min(height, initParam.height)}px`;
        requestAnimationFrame(() => {
          $viewLargeImg.style.transition = 'opacity 0.5s';
          $viewLargeImg.style.opacity = 1;
          setTimeout(() => {
            isTransitioning = false;
          }, 500)
        })
      },
      moveIn: () => {
        const viewLargeImageTransformPos = getPosition($viewLargeImageTransform);
        // console.log(targetRace, 'targetRace');
        // console.log(viewLargeImageTransformPos, 'viewLargeImageTransformPos');
        const startPos = {
          left: targetRace.left - viewLargeImageTransformPos.left,
          top: targetRace.top - viewLargeImageTransformPos.top
        };
        const endPos = {
          left: 0,
          top: 0
        }
        $viewLargeImg.style.transition = 'none';
        $viewLargeImg.style.opacity = 1;
        $viewLargeImageTransform.style.transition = 'none';
        $viewLargeImageTransform.style.width = `${targetRace.width}px`;
        $viewLargeImageTransform.style.height = `${targetRace.height}px`;
        $viewLargeImageTransform.style.transform = `translate(${startPos.left}px, ${startPos.top}px)`
        requestAnimationFrame(() => {
          $viewLargeImageTransform.style.transition = 'all .5s';
          $viewLargeImageTransform.style.width = `${Math.min(width, initParam.width)}px`;
          $viewLargeImageTransform.style.height = `${Math.min(height, initParam.height)}px`;
          $viewLargeImageTransform.style.transform = `translate(${endPos.left}px, ${endPos.top}px)`
          setTimeout(() => {
            isTransitioning = false;
          }, 500)
        })
      }
    }

    return method[initParam.effect] ? method[initParam.effect]() : method.fadeIn();
  }

  const toViewImage = (target) => {
    const { src } = target;
    const loadSrc = target.getAttribute('view-image') || src;
    $viewLargeImage.classList.add('show');
    $imgTarget = target;
    requestAnimationFrame(() => {
      if ($viewLargeImg.src != loadSrc) {
        $viewLargeImg.src = loadSrc;
        $viewLargeLoadingLayer.classList.add('show');
        $viewLargeImg.onload = () => {
          setTimeout(() => {
            $viewLargeLoadingLayer.classList.remove('show');
            if (!initParam.hideFooter) {
              $viewLargeImageContainer.classList.add('show');
            }
            transition(target);
          }, 300)
        }
      } else {
        if (!initParam.hideFooter) {
          $viewLargeImageContainer.classList.add('show');
        }
        transition(target);
      }
    })
  }

  const layerEvent = () => {
    window.addEventListener('click', (e) => {
      if (isTransitioning) return;
      const { type, target } = e;
      if (String(type).toLocaleLowerCase() === 'click' && target.hasAttribute(attrName)) {
        toViewImage(target);
      }
    })

    $viewLargeImageClose.addEventListener('click', () => {
      if (isTransitioning) return;
      $imgTarget = null;
      $viewLargeImageTransform.style = '';
      $viewLargeLoadingLayer.classList.remove('show');
      $viewLargeImageContainer.classList.remove('show');
      $viewLargeImage.classList.remove('show');
      $viewLargeImg.classList.remove('show');
    })

    $viewLargeImageWrap.addEventListener('click', (e) => {
      e.stopPropagation();
    })

    if (initParam.closeOnClick) {
      $viewLargeImage.addEventListener('click', () => {
        $viewLargeImageClose.click();
      })
    }

    if (initParam.resize) {
      let timer = null;
      window.addEventListener('resize', () => {
        if (!$imgTarget) return;
        if (initParam.resize) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            initParam.width = document.documentElement.clientWidth * containerScaleW;
            initParam.height = document.documentElement.clientHeight * containerScaleH;
            transition($imgTarget);
            timer = null;
          }, 100)
        }
      });
    }
  }

  // 初始化弹层
  const initLayer = () => {
    const style = document.createElement('style');
    style.innerHTML = `img[view-large-image] {
  cursor: pointer;
  user-select: none;
}
#view-large-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  padding: 0;
  display: none;
  z-index: 99999;
}
#view-large-image.show {
  display: block;
}
#view-large-image-inner {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
#view-large-main {
  width: fit-content;
  height: fit-content;
  max-width: 100%;
  max-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#view-large-image-wrap {
  width: fit-content;
  height: fit-content;
  margin-bottom: 6px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
#view-large-loading-layer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}
#view-large-loading-layer.show {
  opacity: 1;
  pointer-events: auto;
}
#view-large-loading-layer::before {
  content: '';
  display: block;
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, #ccc 94%, #0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%, #ccc);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13 {
  100% {
    transform: rotate(1turn)
  }
}
#view-large-image-transform {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(0%, 0%);
  overflow: hidden;
  border-radius: 5px;
  background: #fff;
}
#view-large-image-transform::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid #fff;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  border-radius: 3px;
  box-sizing: border-box;
}
#view-large-image-wrap img {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
}
#view-large-image-container {
  flex-shrink: 0;
  width: 100%;
  height: 32px;
  position: relative;
  opacity: 0;
  pointer-events: none;
  transition: opacity .5s .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
#view-large-image-container.show {
  opacity: 1;
  pointer-events: auto;
}
#view-large-image-close {
  display: block;
  width: 32px;
  height: 32px;
  transition: opacity, transform .4s;
  transform: rotate(0);
}
#view-large-image-close:hover {
  transform: rotate(180deg);
  opacity: .7;
}
#view-large-image-close svg {
  width: 100%;
  height: 100%;
  color: #fff;
}`;
    style.setAttribute('view-large-image', '');
    document.head.appendChild(style);

    const viewWrap = `<div id=view-large-image><div id=view-large-image-inner><div id=view-large-main><div id=view-large-image-wrap><div id=view-large-image-transform><img alt="image" id=view-large-img></div><div id=view-large-loading-layer></div></div><div id=view-large-image-container><a href=javascript:void(0); id=view-large-image-close><svg class=size-6 fill=none stroke=currentColor stroke-width=1.5 viewBox="0 0 24 24"xmlns=http://www.w3.org/2000/svg><path d="M6 18 18 6M6 6l12 12"stroke-linecap=round stroke-linejoin=round /></svg></a></div></div></div></div>`

    document.body.insertAdjacentHTML('beforeend', viewWrap);

    $viewLargeImage = document.getElementById('view-large-image');
    $viewLargeMain = document.getElementById('view-large-main');
    $viewLargeImageWrap = document.getElementById('view-large-image-wrap');
    $viewLargeLoadingLayer = document.getElementById('view-large-loading-layer');
    $viewLargeImageContainer = document.getElementById('view-large-image-container');
    $viewLargeImg = document.getElementById('view-large-img');
    $viewLargeImageTransform = document.getElementById('view-large-image-transform');
    $viewLargeImageClose
      = document.getElementById('view-large-image-close');
    $viewLargeImageWrap.style.width = `${initParam.width}px`;
    $viewLargeImageWrap.style.height = `${initParam.height}px`;
    layerEvent();
  }

  const viewLargeImage = (params) => {
    initData(params);
    initLayer();

    return {
      // view: (target) => {
      //  // test...
      //   toViewImage(target);
      // },
      close: () => {
        $viewLargeImageClose.click();
      },
      update(params) {
        if (!params || typeof params !== 'object' || params instanceof Array) return;
        initData(params);
        $viewLargeImageWrap.style.width = `${initParam.width}px`;
        $viewLargeImageWrap.style.height = `${initParam.height}px`;
        if ($imgTarget) {
          transition($imgTarget);
        }
      },
      destroy: () => {
        $viewLargeImage.remove();
        document.head.removeChild(document.head.querySelector('style[view-large-image]'));
        viewLargeImageFn = null;
      },
    }
  }

  window.viewLargeImage = viewLargeImage;
})();
