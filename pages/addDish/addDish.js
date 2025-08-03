const util = require('../../utils/util.js')
const dishapi = require('../../utils/api/dishapi.js')
const request = require('../../utils/requestapi.js')

Page({
  data: {
    // 菜品分类列表
    typeList: [],
    // 选中的分类索引
    typeIndex: null,
    // 菜品名称
    dishTitle: '',
    // 图片上传相关
    image: {
      url: [] // 存储图片URL
    },
    // 是否可以提交
    canSubmit: false
  },

  onLoad() {
    // 页面加载时获取菜品分类列表
    dishapi.menuTypeDatas().then(res=>{
        this.setData({"typeList": res.rows || []})
    });
  },

  // 监听页面数据变化，判断是否可以提交
  onDataChange() {
    const { typeIndex, dishTitle, image } = this.data;
    // 分类已选择、菜品名称不为空、至少有一张图片时可以提交
    const canSubmit = typeIndex !== null && dishTitle.trim() !== '' && image.url.length > 0;
    this.setData({ canSubmit });
  },

  // 选择菜品分类
  bindTypeChange(e) {
    this.setData({
      typeIndex: e.detail.value
    });
    this.onDataChange();
  },

  // 菜品名称变化
  onTitleChange(e) {
    this.setData({
      dishTitle: e.detail.value
    });
    this.onDataChange();
  },

  // 选择图片
  chooseImage() {
    const that = this;
    const { url } = this.data.image;
    wx.chooseMedia({
        count: 3 - url.length,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          console.log(res.tempFiles[0].tempFilePath)
          console.log(res.tempFiles[0].size)
            that.uploadImages(res.tempFiles);
        }
      })
  },

  // 上传图片到服务器
  uploadImages(tempFilePaths) {
    const that = this;
    const { url } = this.data.image;
    
    tempFilePaths.forEach(fileObj => {
        const tempFilePath = fileObj.tempFilePath;
        wx.showLoading({
            title: '上传中...',
            mask: true
        });
        // 更新图片列表
        dishapi.uploadTask(tempFilePath).then(res=>{
            url.push({uri: res.data.uri, url: request.join_uri(res.data.uri)});
            that.setData({
                'image.url': url
            });
            that.onDataChange();
        });
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const { url } = this.data.image;
    
    // 删除对应的图片
    url.splice(index, 1);
    this.setData({
      'image.url': url
    });
    this.onDataChange();
  },

  // 表单提交
  formSubmit(e) {
    const { typeList, typeIndex, dishTitle, image } = this.data;
    
    // 构建提交的数据
    const dishData = {
      typeId: typeList[typeIndex].id,
      title: dishTitle,
      groupId: typeList[typeIndex].groupId,
      urls: image.url.map(item=>item.uri).join('|||')
    };
    
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    

    dishapi.addMenuInfo(dishData).then(res=>{
        wx.hideLoading();
        wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
    });
  }
});
