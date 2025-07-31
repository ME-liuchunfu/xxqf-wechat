const request = require('../requestapi.js')



const getInfo = () => {
    return request.post(
        '/xxqf/wechat/getInfo'
    )
}


module.exports = {
    getInfo
}
