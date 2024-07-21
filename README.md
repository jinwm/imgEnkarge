# viewLargeImage
<img src="xxx" view-image="xxx" view-large-image>

// 调用
 let obj = window.viewLargeImage({
    width:document.documentElement.clientWidth * 0.8, // 宽度
    height:document.documentElement.clientHeight * 0.5, // 高度
    effect: 'moveIn', // 过度方式，默认fadeIn，可选moveIn
    objectFit: 'contain', // 填充方式(contain/cover/fill)，默认contain
    closeOnClick: false, // 是否开启点击遮罩关闭，默认false
    hideFooter: false, // 是否隐藏底栏，默认false
    resize: true // 默认false
  });
  // img需要加上view-large-image
  // view-image 大图地址
  // obj.update // 更新配置
  // obj.close // 关闭弹层
  // obj.destroy // 销毁
