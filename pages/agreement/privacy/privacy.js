Page({
  /**
   * 页面的初始数据
   */
  data: {
    fromRegister: false // 是否从注册流程进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 接收参数，判断是否从注册流程进入
    if (options && options.fromRegister) {
      this.setData({
        fromRegister: options.fromRegister === 'true'
      });
    }
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 同意隐私政策
   */
  onAgree() {
    // 记录用户已同意隐私政策
    wx.setStorageSync('privacyAccepted', true);
    
    // 根据来源决定跳转路径
    if (this.data.fromRegister) {
      // 从注册流程进入，返回上一页
      wx.navigateBack();
    } else {
      // 其他情况跳转到首页
      wx.redirectTo({
        url: '/pages/index/index'
      });
    }
  },

  /**
   * 不同意隐私政策
   */
  onDisagree() {
    wx.showModal({
      title: '提示',
      content: '不同意隐私政策将无法使用本小程序',
      cancelText: '再看看',
      confirmText: '退出',
      success: (res) => {
        if (res.confirm) {
          // 用户确认退出
          if (getCurrentPages().length > 1) {
            // 有上一页则返回
            wx.navigateBack();
          } else {
            // 没有上一页则退出小程序
            wx.exitMiniProgram();
          }
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '隐私政策',
      path: '/pages/privacy/privacy'
    };
  }
});
