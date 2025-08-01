const util = require('../../utils/util.js')
const indexapi = require('../../utils/api/indexapi.js')

Page({
    data: {
        dataList: [],
        isLoading: false
    },

    onLoad() {
        // 页面加载时检查登录状态
        util.checkLoginStatus();
        this.loadData();
    },

    onShow() {
        // 页面显示时刷新数据
        util.checkLoginStatus();
    },

    // 下拉刷新事件处理
    onPullDownRefresh() {
        // 重置页码，重新加载数据
        this.setData({
            page: 1
        }, () => {
            this.loadData(true);
        });
    },

    loadData(isRefresh = false) {
        // 如果正在加载中，则不重复请求
        if (this.data.isLoading) return;
        // 显示加载状态
        this.setData({
            isLoading: true
        });

        indexapi.dailyList().then(res => {
            this.setData({dataList: res.rows, isLoading: false})
            // 停止下拉刷新动画（如果是刷新操作）
            if (isRefresh) {
                wx.stopPullDownRefresh();
            }
        }).catch(res=>{
            // 停止下拉刷新动画（如果是刷新操作）
            if (isRefresh) {
                wx.stopPullDownRefresh();
            }
            this.setData({isLoading: false})
        })
    },

    firstUrl(urls) {
        if (urls) {
            const url_arr = urls.split("|||")
            return url_arr.length > 0 ? url_arr[0] : '';
        }
        return ''
    }

})
