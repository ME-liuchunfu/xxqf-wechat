const { post } = require('../requestapi.js');
const request = require('../requestapi.js')

const menuTypeDatas = ()=>{
    return request.get(
        '/xxqf/menu_type_info/miniapp/list'
    )
}

const uploadTask = (path) => {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: request.BASE_URL + '/xxqf/disk/info/upload', // 服务器地址
            filePath: path,
            method: 'post',
            header: {
                ...request.headers(),
                'content-type': 'multipart/form-data',
            },
            name: 'file',
            success: (res) => {
                wx.hideLoading();
                console.log('上传成功：', res);
                resolve(JSON.parse(res.data));
            },
            fail: (err) => {
                wx.hideLoading();
                console.error('上传失败：', err);
                reject(err);
            },
        });
    });
}

const addMenuInfo = (data)=>{
    return request.post(
        '/xxqf/menu_info/miniapp',
        data
    )
}

module.exports = {
    menuTypeDatas,
    uploadTask,
    addMenuInfo
}