const systemInfo = my.getSystemInfoSync();
const factor = systemInfo.pixelRatio;
import wxbarcode from '../wxbarcode/index';

Component({
  /**
   * 组件的属性列表
   */
  props: {
    width: {
      type: Number,
      default: 750/factor
    },
    height: {
      type: Number,
      default: 1334/factor
    },
    bgimg: {
        type: String,
        default: ''
    },
    headimg: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  onInit() {
  },

  didMount() {
    let that = this;
    that.$page.poster = that;
    that.ctx = my.createCanvasContext("poster");
    that.ctx.drawImage(that.props.bgimg, 0, 0, that.props.width,that.props.height);
    that.ctx.draw(true);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    create() {
      let that = this;
      wxbarcode.qrcode('poster', that.props.url, 180, 180, 90/factor, 954/factor, that.ctx);
      that.ctx.setFontSize(10);
      that.ctx.font = 'bold 10px sans-serif';
      that.ctx.setTextAlign('center')
      that.ctx.fillText(`我是${that.props.nickname}`, 372 / factor, 934 / factor);
      that.ctx.draw(true, that.exportImg(that.ctx, 750, 1334, 0, 0, that.props.width, that.props.height));
    },

    exportImg(ctx, sWidth, sHeight, width, height) {
      let that = this;
      setTimeout(function () {
        ctx.toTempFilePath({
          x: 0,
          y: 0,
          width: sWidth,
          height: sHeight,
          destWidth: width,
          destHeight: height,
          success(res) {
            console.log(res)
            that.$page.onPosterSuccess(res)
          },
          fail: (err) => {
            console.log(err);
          },
          complete(res) {
            console.log(res);
          }
        })
      }, 1000);
    }
  }
})
