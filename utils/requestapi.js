// 基础API地址
const BASE_URL = 'http://192.168.31.169:8080';

// 请求拦截器
const requestInterceptor = (config) => {
  // 可以在这里添加通用的请求头，如Token
  const token = wx.getStorageSync('token');
  if (token) {
    config.header.Authorization = `Bearer ${token}`;
  }
  
  // 显示加载提示
  if (config.showLoading) {
    wx.showLoading({
      title: config.loadingText || '加载中...',
      mask: true
    });
  }
  
  return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
    debugger
  // 隐藏加载提示
  if (response.config.showLoading) {
    wx.hideLoading();
  }
  
  // 统一处理响应码
  const res = response.data;
  if (res.code === 200) {
    // 成功状态
    return res.data;
  } else if (res.code === 401) {
    // 未授权，需要重新登录
    wx.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none',
      duration: 2000
    });
    
    // 清除本地token
    wx.removeStorageSync('token');
    
    // 跳转到登录页
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }, 1000);
    
    return Promise.reject(new Error(res.msg || '登录已过期'));
  } else {
    // 其他错误状态
    wx.showToast({
      title: res.msg || '请求失败',
      icon: 'none',
      duration: 2000
    });
    return Promise.reject(new Error(res.msg || '请求失败'));
  }
};

// 错误处理
const errorHandler = (error, config) => {
  // 隐藏加载提示
  if (config.showLoading) {
    wx.hideLoading();
  }
  
  // 网络错误处理
  wx.showToast({
    title: '网络异常，请稍后重试',
    icon: 'none',
    duration: 2000
  });
  
  console.error('请求错误:', error);
  return Promise.reject(error);
};

/**
 * 通用请求方法
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求地址
 * @param {string} options.method - 请求方法
 * @param {Object} options.data - 请求数据
 * @param {Object} options.header - 请求头
 * @param {boolean} options.showLoading - 是否显示加载提示
 * @param {string} options.loadingText - 加载提示文本
 */
const request = (options) => {
  // 默认配置
  const config = {
    url: options.url,
    method: options.method || 'GET',
    data: options.data || {},
    header: options.header || {
      'Content-Type': 'application/json'
    },
    showLoading: options.showLoading !== undefined ? options.showLoading : true,
    loadingText: options.loadingText || '加载中...'
  };
  
  // 处理完整URL
  if (!config.url.startsWith('http')) {
    config.url = BASE_URL + config.url;
  }
  
  // 应用请求拦截器
  const processedConfig = requestInterceptor(config);
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...processedConfig,
      success: (res) => {
        try {
          // 应用响应拦截器
          const result = responseInterceptor({
            ...res,
            config: processedConfig
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      fail: (err) => {
        // 处理请求失败
        errorHandler(err, processedConfig);
        reject(err);
      }
    });
  });
};

// 封装GET请求
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
};

// 封装POST请求
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

// 封装PUT请求
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

// 封装DELETE请求
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

// 导出请求方法
module.exports = {
  request,
  get,
  post,
  put,
  del,
  setBaseUrl: (url) => { BASE_URL = url; }
};
