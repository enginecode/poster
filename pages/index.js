// pages/oneyear/index.js
const systemInfo = my.getSystemInfoSync();
const app = getApp();
const factor = systemInfo.pixelRatio;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 750/factor,
    canvasHeight: 1334/factor,
    canvasBg: "/images/share-bg.png",
    defaultAvatar: "/images/avatar.png", 
    avatar: '', 
    fileAuth: true,
    shareBox: false,
    shareFriend: false,
    has_submit: false,
    is_edit: false,
    is_upload: false,
    post: {
      nickname: '',
      age: 0
    },
    errmsg: false,
    disabled: false,
    qrcode_str: '1111'
  },

  check_post() {
    let that = this;

    if (that.data.avatar.length <= 0) {
      return { errcode: 40001, errmsg: '请上传代言人照片' };
    }

    if (that.data.post.nickname.length <= 0) {
      return {errcode: 40001, errmsg: '请输入代言人昵称'};
    }

    if (!that.data.post.age || that.data.post.age > 100 || that.data.post.age < 0) {
      return { errcode: 40001, errmsg: '请输入代言人实际年龄' };
    }

    return {errcode: 0, errmsg: 'ok'};
  },

  //修改
  edit(e){
    let that = this;
    that.setData({
      disabled: false,
      is_edit: true
    })
  },

  formSubmit(e) {
    let that = this;
    let nickname= e.detail.value.nickname,
      age = e.detail.value.age;
  
    that.data.post.nickname = nickname;
    that.data.post.age = age;

    let result = that.check_post();
    if (result.errcode !== 0) {
      that.setData({
        errmsg: result.errmsg
      })

      setTimeout(function() {
        that.setData({
          errmsg: false
        })
      }, 3000);
      return false;
    }

    //成功
    my.showToast({
      content: '报名成功'
    })

    that.setData({
      "post.nickname": nickname,
      "post.age": age,
      has_submit: true,
      is_edit: false,
      disabled: true, //表单不能填写和提交
    })
  },

  prevent(e) {
    return false;
  },
  tabChange(e) {
      console.log('tab change', e)
      my.redirectTo({
        url: e.detail.item.path
      })
  },

  //保存海报
  saveImg: function () {
    let that = this;
    my.saveImage({
      url: that.data.shareUrl,
      success(res) {
        my.showToast({
          content: '保存成功',
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  //打开保存权限设置
  openSetting() {
    let that = this;
    my.openSetting({
      success(res) {
        console.log(res.authSetting)
        if (res.authSetting["scope.writePhotosAlbum"]) {
          that.setData({
            fileAuth: res.authSetting["scope.writePhotosAlbum"]
          })
        }
      }
    })
  },

  chooseImg(e) {
    let that = this;
    my.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album','camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.apFilePaths
        that.setData({
          originAvatar: tempFilePaths[0]
        })
        my.navigateTo({
          url: `/pages/croper?src=${tempFilePaths}`
        })
      }
    })
  },

  close: function () {
    this.setData({
      shareBox: false,
      shareFriend: false,
      is_upload: false
    })
  },

  product(e) {
    let that = this;
    my.showLoading({
      content: '正在生成'
    });
    that.poster.create();
  },

  //去邀请
  share(e) {
    let that = this;
    that.setData({
      shareBox: true
    })
  },

  onPosterSuccess(e) {
    console.log(e);
    let that = this;
    my.hideLoading({
      page: that
    });
    this.setData({
      shareFriend: true,
      shareBox: false,
      shareUrl: e.apFilePath
    })
  },

  //预览生成的二维码
  previewImg: function (e) {
    let src = e.currentTarget.dataset.src;
    console.log(e);
    let that = this;
    my.previewImage({
      urls: [src],
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  imgLoad(e) {
    let that = this;
    that.poster.ctx.save();
    that.poster.ctx.beginPath();
    that.poster.ctx.arc(376 / factor, 560 / factor, 270 / factor, 0, Math.PI * 2, false);
    that.poster.ctx.clip();
    that.poster.ctx.closePath();

    my.getImageInfo({
      src: that.data.avatar,
      success(res) {
          that.poster.ctx.drawImage(res.path, (376 - 270) / factor, (560 - 270) / factor, 540 / factor, 540 / factor);
          that.poster.ctx.restore();
          that.poster.ctx.draw(true);
      },
      fail(err) {
        console.log("首页加载失败", err);
      }
    })
  },

  imgError(e) {
    console.log(e);
  }
})