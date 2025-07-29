
const request = require('../requestapi.js')


const login = (data={}) =>{
    return request.post(
        '/xxqf/wechat/login',
        data
    )
}

const ping = () => {
    return request.post(
        '/xxqf/wechat/ping'
    )
}


module.exports = {
    login,
    ping
}