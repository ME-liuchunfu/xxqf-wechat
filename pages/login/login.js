
const loginApi = require('../../utils/api/loginapi.js')

Page({
  data: {
    showSuccess: false,   // 登录成功提示
    homePage: '/pages/index/index'
  },

  onLoad() {
    // 页面加载时检查是否已登录
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        // 如果已有token，直接跳转到首页
        if (res.data) {
            loginApi.ping()
            .then(res=>{
                wx.switchTab({url: this.homePage});
            })
        }
      }
    });
  },

  // 微信一键登录
  wechatLogin() {
    const that = this;
    
    // 调用微信登录接口
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 拿到code后，发送到后端换取token
          that.requestLogin(loginRes.code);
        } else {
          console.error('登录失败：', loginRes.errMsg);
          that.showToast('登录失败，请重试');
        }
      },
      fail: (err) => {
        console.error('登录接口调用失败：', err);
        that.showToast('登录失败，请检查网络');
      }
    });
  },

  // 向后端请求登录
  requestLogin(code) {
    const that = this;
    
    loginApi.login({"code": code})
    .then(data=>{
        console.log('login response', data)
        // 登录成功，保存token
        wx.setStorage({key: 'token', data: data.token});
          
          // 显示成功提示
          that.setData({showSuccess: true});
          
          // 延迟跳转到首页
          setTimeout(() => {
              debugger
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
    }).catch(err => {
        console.error('登录失败:', err);
      });
  },

  // 获取手机号（可选）
  getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 手机号信息，需要发送到后端解密
      console.log('手机号加密信息：', e.detail);
      // 这里可以实现手机号登录逻辑
    } else {
      this.showToast('请允许获取手机号以继续');
    }
  },

  // 跳转到账号密码登录
  toAccountLogin() {
    wx.navigateTo({
      url: '/pages/login/account'
    });
  },

  // 显示提示信息
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    });
  }
});
