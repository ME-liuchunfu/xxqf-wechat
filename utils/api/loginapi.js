
const request = require('../requestapi.js')


const login = (data={}) =>{
    return request.post(
        '/xxqf/wechat/login',
        data
    )
}

module.exports = {
    login
}