const util = require('../../utils/util.js')
const groupapi = require('../../utils/api/groupapi.js')
const request = require('../../utils/requestapi.js')

Page({
    data: {
      groups: [],          // 分组列表
      showDialog: false,   // 是否显示新增弹窗
      newGroupName: '',     // 新分组名称
      ygroupId: null,
      platId: null,
      showYaoialog: false,
    },
  
    onLoad() {
      // 页面加载时获取分组列表
      this.loadGroups();
    },
  
    // 加载分组列表
    loadGroups() {
      wx.showLoading({
        title: '加载中...'
      });
      groupapi.groupDatas().then(res=>{
          this.setData({groups: res.rows || []})
      })
    },
  
    // 显示新增分组弹窗
    showAddDialog() {
      this.setData({
        showDialog: true,
        newGroupName: ''
      });
    },
  
    // 隐藏新增分组弹窗
    hideAddDialog() {
      this.setData({
        showDialog: false
      });
    },
  
    // 监听分组名称输入
    onGroupNameChange(e) {
      this.setData({
        newGroupName: e.detail.value.trim()
      });
    },
  
    // 新增分组
    addNewGroup() {
      const { newGroupName} = this.data;
      
      // 验证输入
      if (!newGroupName) {
        wx.showToast({
          title: '请输入分组名称',
          icon: 'none'
          });
          return;
      }
      
      wx.showLoading({
        title: '保存中...'
      });
      groupapi.addGroupInfo({
          title: newGroupName
      }).then(res=>{
        this.setData({"showDialog": false});
        wx.showToast({
            title: '新增成功',
            icon: 'success'
          });
          this.loadGroups()
      })
    },
    showYaoqin(e) {
        const groupId = e.currentTarget.dataset.id;
        this.setData({"ygroupId": groupId, showYaoialog: true});
    },
    onPlatIdChange(e) {
        this.setData({
            platId: e.detail.value.trim()
          });
    },
    hideGroupDialog() {
        this.setData({showYaoialog: false});
    },
    addGroupRef() {
        const { platId, ygroupId} = this.data;
      
        // 验证输入
        if (!ygroupId) {
          wx.showToast({
            title: '请选择分组',
            icon: 'none'
            });
            return;
        }
        if (!platId) {
            wx.showToast({
              title: '请输入用户id',
              icon: 'none'
              });
              return;
          }
        
        wx.showLoading({
          title: '保存中...'
        });
        groupapi.addGroupRef({
            platId: platId,
            groupId: ygroupId
        }).then(res=>{
          this.setData({"showYaoialog": false});
          wx.showToast({
              title: '分享成功',
              icon: 'success'
            });
            this.loadGroups()
        })
    },
  
    // 删除分组
    deleteGroup(e) {
      const groupId = e.currentTarget.dataset.id;
      
      wx.showModal({
        title: '确认删除',
        content: '确定要删除这个分组吗？',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: '删除中...'
            });
            
            groupapi.delGroups([groupId]).then(res=>{
                wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  });
                this.loadGroups();
            });
          }
        }
      });
    }
  })  