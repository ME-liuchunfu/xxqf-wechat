// app.js
const loginApi = require('utils/api/loginapi.js')

App({
  onLaunch() {
    wx.getStorage({
        key: 'token',
        success: (res) => {
          // 如果已有token，直接跳转到首页
          if (res.data) {
              loginApi.ping()
              .then(res=>{
                  wx.switchTab({url: '/pages/index/index'});
              })
          }
        }
      });
  },
  globalData: {
    userInfo: null
  }
})
