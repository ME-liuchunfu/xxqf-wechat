const util = require('../../utils/util.js')
const indexapi = require('../../utils/api/indexapi.js')

Page({
  data: {
      dataList: []
  },

  onLoad() {
    // 页面加载时检查登录状态
    util.checkLoginStatus();
    indexapi.dailyList().then(res=>{
        this.setData({dataList: res.rows})
    })
  },

  onShow() {
    // 页面显示时刷新数据
    util.checkLoginStatus();
    indexapi.dailyList().then(res=>{
        this.setData({dataList: res.rows})
    })
  },

})
