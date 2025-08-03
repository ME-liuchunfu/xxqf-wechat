
const util = require('../../utils/util.js')
const mineapi = require('../../utils/api/mineapi.js')

Page({
  data: {
    userInfo:{
          
      }
  },

  onLoad() {
    // 页面加载时检查登录状态
    util.checkLoginStatus();
    mineapi.getInfo().then(res=>{
        this.setData({
            userInfo: res.data
        })
    })
  },

  onShow() {
    // 页面显示时刷新数据
    util.checkLoginStatus();
    mineapi.getInfo().then(res=>{
        this.setData({
            userInfo: res.data
        })
    })
  },

  /**
   * 点击头像区域
   */
  handleAvatarClick() {
    if (!util.getToken()) {
      // 未登录，跳转到登录页
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } 
  },

  addDish() {
    wx.navigateTo({
      url: '/pages/addDish/addDish',
    })
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出当前账号吗？',
      cancelText: '取消',
      confirmText: '退出',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          // 显示退出成功提示
          wx.showToast({
            title: '已退出登录',
            icon: 'none',
            duration: 1500
          });
          setTimeout(() => {
            wx.redirectTo({
                url: '/pages/login/login'
              });
          }, 1500);
        }
      }
    });
  },
});
