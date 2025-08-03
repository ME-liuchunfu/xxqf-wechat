const { post } = require('../requestapi.js');
const request = require('../requestapi.js')

const groupDatas = ()=>{
    return request.get(
        '/xxqf/group_info/miniapp/list',
        {
            "orderByColumn": 'id',
            "isAsc": 'desc'
        }
    )
}

const addGroupInfo = (data)=>{
    return request.post(
        '/xxqf/group_info/miniapp',
        data
    )
}

const addGroupRef = (data)=>{
    return request.post(
        '/xxqf/plat_group_refinfo/miniapp',
        data
    )
}

const delGroups = (data)=>{
    return request.del(
        '/xxqf/group_info/miniapp/' + data.join(","),
    )
}

module.exports = {
    groupDatas,
    addGroupInfo,
    addGroupRef,
    delGroups
}