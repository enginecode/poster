import WeCropper from '../components/we-cropper/we-cropper.js'

const app = getApp();
const device = my.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    let that = this;
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        let pages = getCurrentPages();
        pages[pages.length-2].setData({
          avatar: avatar
        })
    
        my.showLoading()
        setTimeout(function() {
          my.hideLoading({
            page: that
          })
          my.navigateBack({
            delta: 1
          });
        }, 1000);
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    my.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  
  onLoad(option) {
    const { cropperOpt } = this.data

    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          my.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          my.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})
