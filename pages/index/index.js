const util = require('../../utils/util.js')
const indexapi = require('../../utils/api/indexapi.js')
const request = require('../../utils/requestapi.js')

Page({
    data: {
        dataList: [],
        isLoading: false,
        nowDateStr: '',
        timer: null
    },

    onLoad() {
        // 页面加载时检查登录状态
        util.checkLoginStatus();
        if (this.timer) {
            clearInterval(this.timer);
        }
        let timer = setInterval(()=>{
            let dateStr = this.nowDate();
            this.setData({"nowDateStr": dateStr});
        }, 1000);
        this.setData({'timer': timer});

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
            let rows = res.rows || [];
            if (rows) {
                rows.forEach(item=>{
                    if (item.dailyRecordItems) {
                        item.dailyRecordItems.forEach(it=>{
                            let allUrl = it.urls;
                            it.urls = this.firstUrl(it.urls);
                            it.allUrl = allUrl;
                        });
                    }
                })
                console.log(rows);
            }
            this.setData({dataList: rows, isLoading: false})
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
            let uri = url_arr.length > 0 ? url_arr[0] : ''
            return request.join_uri(uri);
        }
        return ''
    },

    nowDate() {
        return util.formatTime_cn(new Date());
    },

    previewImg(e) {
        // console.log(e)
        let all = e.currentTarget.dataset.urls;
        wx.previewImage({
            current: e.currentTarget.dataset.url, // 当前显示图片的http链接
            urls: all.split("|||").map(u=>request.join_uri(u)) // 需要预览的图片http链接列表
          })
    }

})
