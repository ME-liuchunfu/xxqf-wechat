const util = require('../../utils/util.js')
const selectfoolapi = require('../../utils/api/selectfoolapi.js')
const request = require('../../utils/requestapi.js')

Page({
  data: {
    showDatePicker: false,
    selectedDate: '',
    selectedZhou: '',
    // 菜品数据
    menuData: [],
    currentCategoryId: -1,  // 当前选中的分类ID
    currentDishes: [],      // 当前分类下的菜品
    pocket: [],             // 口袋中的菜品
    pocketTotalCount: 0,    // 口袋中菜品总数量
    showPocketSidebar: false // 是否显示口袋侧边栏
  },

  onLoad() {
    this.getAllFool();
    this.setData({selectedDate: util.formatDate(new Date()), selectedZhou: util.get_zhou(new Date())})
  },

  onShow(){
    util.checkLoginStatus();
    this.getAllFool();
  },

  getAllFool(){
    selectfoolapi.getAllFool().then(res=>{
        if (!res.data || res.data.length ===0) {
            wx.showToast({
                title: '暂无数据',
                icon: 'none',
                duration: 2000
              });
            return;
        }
        res.data.forEach(itm=>{
            itm.dishes.forEach(ii=>{
                ii.image = request.join_uri(ii.image);
            })
        });
        this.setData({
            menuData: res.data,
            currentCategoryId: res.data[0].id,
            currentDishes: res.data[0].dishes
          });
    })
  },

  // 切换分类
  switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    // 查找对应的菜品
    const category = this.data.menuData.find(item => item.id === categoryId);
    
    this.setData({
      currentCategoryId: categoryId,
      currentDishes: category.dishes
    });
  },

  // 添加菜品到口袋
  addToPocket(e) {
    const dishId = e.currentTarget.dataset.id;
    // 查找菜品信息
    let dishInfo = null;
    for (const category of this.data.menuData) {
      const dish = category.dishes.find(d => d.id === dishId);
      if (dish) {
        dishInfo = dish;
        break;
      }
    }
    
    if (dishInfo) {
      const pocket = [...this.data.pocket];
      const existingIndex = pocket.findIndex(item => item.id === dishId);
      
      if (existingIndex !== -1) {
        // 已存在，数量加1
        pocket[existingIndex].count += 1;
      } else {
        // 不存在，添加到口袋
        pocket.push({
          id: dishId,
          name: dishInfo.name,
          price: dishInfo.price,
          image: dishInfo.image,
          count: 1
        });
      }
      
      // 更新口袋数据
      this.updatePocket(pocket);
    }
  },

  // 增加口袋中菜品数量
  increaseCount(e) {
    const dishId = e.currentTarget.dataset.id;
    const pocket = [...this.data.pocket];
    const index = pocket.findIndex(item => item.id === dishId);
    
    if (index !== -1) {
      pocket[index].count += 1;
      this.updatePocket(pocket);
    }
  },

  // 减少口袋中菜品数量
  decreaseCount(e) {
    const dishId = e.currentTarget.dataset.id;
    let pocket = [...this.data.pocket];
    const index = pocket.findIndex(item => item.id === dishId);
    
    if (index !== -1) {
      if (pocket[index].count <= 1) {
        // 数量为1时，直接移除
        pocket.splice(index, 1);
      } else {
        // 数量减1
        pocket[index].count -= 1;
      }
      
      this.updatePocket(pocket);
    }
  },

  // 更新口袋数据和计算 totals
  updatePocket(pocket) {
    // 计算总数量
    const totalCount = pocket.reduce((sum, item) => sum + item.count, 0);
    
    this.setData({
      pocket,
      pocketTotalCount: totalCount
    });
  },

  // 检查菜品是否在口袋中
  isInPocket(dishId) {
    return this.data.pocket.some(item => item.id === dishId);
  },

  // 获取口袋中菜品的数量
  getPocketItemCount(dishId) {
    const item = this.data.pocket.find(item => item.id === dishId);
    return item ? item.count : 0;
  },

  // 显示口袋侧边栏
  showPocket() {
    this.setData({
      showPocketSidebar: true
    });
  },

  // 隐藏口袋侧边栏
  hidePocket() {
    this.setData({
      showPocketSidebar: false
    });
  },

  bindDateChange(e){
      this.setData({selectedZhou: util.get_zhou(new Date(e.detail.value)), selectedDate: e.detail.value})
  },
  
  okPushData() {
      if (!this.data.selectedDate || !this.data.selectedZhou) {
        wx.showToast({title: '请选择日期',icon: 'none',duration: 2000});
        return
      }
      if (this.data.pocket.length == 0) {
        wx.showToast({title: '请选择菜品',icon: 'none',duration: 2000});
        return
      }
      wx.showLoading({title: '提交中'})
      selectfoolapi.pushDetail({
          'date': this.data.selectedDate,
          'pockets': this.data.pocket.map(it=>it.id)
      }).then(res=>{
          wx.hideLoading();
          wx.showToast({title: '添加成功',icon: 'none',duration: 2000});
          setTimeout(() => {
            this.getAllFool();
            this.cleanPushData();
          }, 1000);
      })
  },

  cleanPushData(){
      this.setData({pocket:[], pocketTotalCount:0, showPocketSidebar: false})
  }
});
