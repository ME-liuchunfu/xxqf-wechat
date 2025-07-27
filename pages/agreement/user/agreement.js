Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 可以从options中获取参数，如是否是注册流程中打开
    this.setData({
      fromRegister: options.fromRegister || false
    });
  },

  /**
   * 同意协议
   */
  onAgree() {
    // 记录用户已同意协议
    wx.setStorageSync('agreementAccepted', true);
    
    // 根据来源决定跳转页面
    if (this.data.fromRegister) {
      // 如果是从注册流程过来，返回上一页
      wx.navigateBack();
    } else {
      // 否则跳转到首页
      wx.redirectTo({
        url: '/pages/index/index'
      });
    }
  },

  /**
   * 不同意协议
   */
  onDisagree() {
    // 显示提示
    wx.showModal({
      title: '提示',
      content: '不同意协议将无法使用本小程序的全部功能',
      cancelText: '再看看',
      confirmText: '退出',
      success: (res) => {
        if (res.confirm) {
          // 用户确认退出，返回上一页或关闭小程序
          if (getCurrentPages().length > 1) {
            wx.navigateBack();
          } else {
            // 如果是第一个页面，退出小程序
            wx.navigateBack({
              delta: 0
            });
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
      title: '用户协议',
      path: '/pages/agreement/agreement'
    };
  }
});
