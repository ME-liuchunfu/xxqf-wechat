const request = require('../requestapi.js')

const dailyList = ()=>{
    return request.get('/xxqf/daily_record_info/miniapp/list');
}

module.exports = {
    dailyList
}