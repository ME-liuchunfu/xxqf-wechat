const request = require('../requestapi.js')


const getAllFool = ()=>{
    return request.post(
        '/xxqf/menu_info/miniapp/all/list'
    )
}

const pushDetail = (data)=>{
    return request.post(
        '/xxqf/menu_info/miniapp/pushDetail',
        data
    )
}

module.exports = {
    getAllFool,
    pushDetail
}