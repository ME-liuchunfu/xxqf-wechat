Page({
  data: {
    userInfo: {},      // 用户信息
    isLogin: false,    // 是否登录
    unreadCount: 3     // 未读消息数量
  },

  onLoad() {
    // 页面加载时检查登录状态
    this.checkLoginStatus();
  },

  onShow() {
    // 页面显示时刷新数据
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');
    
    if (userInfo && token) {
      this.setData({
        userInfo,
        isLogin: true
      });
      // 获取未读消息数量
      this.getUnreadCount();
    } else {
      this.setData({
        userInfo: {},
        isLogin: false,
        unreadCount: 0
      });
    }
  },

  /**
   * 获取未读消息数量
   */
  getUnreadCount() {
    // 实际项目中替换为真实接口请求
    setTimeout(() => {
      this.setData({
        unreadCount: 3
      });
    }, 500);
  },

  /**
   * 点击头像区域
   */
  handleAvatarClick() {
    if (!this.data.isLogin) {
      // 未登录，跳转到登录页
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      // 已登录，跳转到个人资料页
      wx.navigateTo({
        url: '/pages/mine/profile/profile'
      });
    }
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
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          
          // 更新页面状态
          this.setData({
            userInfo: {},
            isLogin: false,
            unreadCount: 0
          });
          
          // 显示退出成功提示
          wx.showToast({
            title: '已退出登录',
            icon: 'none',
            duration: 1500
          });
        }
      }
    });
  },

  /**
   * 导航到订单页面
   */
  navToOrder() {
    this.checkLoginAndNavigate('/pages/order/order');
  },

  /**
   * 导航到收藏页面
   */
  navToCollection() {
    this.checkLoginAndNavigate('/pages/mine/collection/collection');
  },

  /**
   * 导航到消息页面
   */
  navToMessage() {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      wx.navigateTo({
        url: '/pages/mine/message/message'
      });
    }
  },

  /**
   * 导航到个人资料
   */
  navToProfile() {
    this.checkLoginAndNavigate('/pages/mine/profile/profile');
  },

  /**
   * 导航到收货地址
   */
  navToAddress() {
    this.checkLoginAndNavigate('/pages/mine/address/address');
  },

  /**
   * 导航到我的钱包
   */
  navToWallet() {
    this.checkLoginAndNavigate('/pages/mine/wallet/wallet');
  },

  /**
   * 导航到设置页面
   */
  navToSetting() {
    wx.navigateTo({
      url: '/pages/mine/setting/setting'
    });
  },

  /**
   * 导航到帮助与反馈
   */
  navToHelp() {
    wx.navigateTo({
      url: '/pages/mine/help/help'
    });
  },

  /**
   * 导航到关于我们
   */
  navToAbout() {
    wx.navigateTo({
      url: '/pages/mine/about/about'
    });
  },

  /**
   * 检查登录状态并导航
   */
  checkLoginAndNavigate(url) {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      wx.navigateTo({
        url: url
      });
    }
  }
});
