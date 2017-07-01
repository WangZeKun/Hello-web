import axios from 'axios'

// const url = 'http://47.94.91.118/v1';
const url = 'https://api.gqmms.wang/v1'

let http = axios.create({
    withCredentials: true
});

/**
 *
 @method 系统登录
 *
 * @param username {string} 用户名
 * @param password {string} 密码
 * @param select {string} 用户类型
 * @return {Object}
 */
export function requestLogin(username, password, select) {
    let params = new URLSearchParams();
    params.append('select', select);
    params.append('password', password);
    params.append('username', username);
    return http.post(`${url}/message/login`, params)
        .then(res => res.data)
        .catch(err => {
            console.log(err);
            return {Message: '服务器错误，请稍后重试'}
        })
}

/**
 *@method 获得学生活动信息
 * @param who string [root,grade,class] 活动类型
 * @return {Object}
 */
export function getStudentActivity(who) {
    return http.get(`${url}/student/activity`, {params: {who: who}})
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}

/**
 @method 获得学生参加的活动
 @return {Object}
 */
export function getCanjia() {
    return http.get(`${url}/student/canjia`)
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}

/**
 * @method 得到一个活动的信息
 * @param id {number} 活动id
 * @return {Object}
 * */
export function getSingle(id) {
    return http.get(`${url}/message/single`, {params: {id: id}})
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}

/**
 * @method 报名活动
 * @param id {number} 活动id
 * @param message 活动的额外信息
 */
export function setJion(id, message) {
    return http.get(`${url}/student/join`, {params: {id: id, message: message}})
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}

/**
 *
 * @method 得到老师发起的活动
 * @param status {string} ['now','end']
 * */
export function getTeacherActivity(status) {
    return http.get(`${url}/teacher/activities`, {params: {status: status}})
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}

/**
 * @method 退出登录*/
export function exit() {
    http.get(`${url}/message/exit`).catch(err => console.log(err))
}

/**
 * @method 获得参加活动的同学
 * @param id {number} 活动id
 * */
export function getJions(id) {
    return http.get(`${url}/teacher/joins`, {params: {id: id}})
        .then(res => res.data)
        .catch(err => console.log(err))
}

/**
 * @method 审核同学
 * @param id {Array<number>} 包含审核同学Id的数组
 * @param status {string} 审核的状态,通过或不通过
 * @return {Promise}
 * */
export function setStatus(id, status) {
    let params = new URLSearchParams();
    params.append('id', id);
    params.append('status', status);
    return http.post(`${url}/teacher/set`, params).catch(err => {
        console.log(err)
    })

}

/**
 * @method 添加同学
 * @param studentId {string} 教育Id
 * @param activityId {string} 活动Id
 * @return {Promise}
 * */
export function addStu(studentId, activityId) {
    let params = new URLSearchParams()
    params.append('studentId', studentId)
    params.append('activityId', activityId)
    return http.post(`${url}/teacher/addStu`, params)
        .catch(err => console.log(err))
}

/**
 * @method 删除活动
 * @param id {string} 活动ID
 * @return {Promise}
 * */
export function del(id) {
    let params = new URLSearchParams()
    params.append('id', id)
    return http.post(`${url}/teacher/del`, params)
        .catch(err => {
            console.log(err)
        })
}

/**
 * @mothed 结束活动
 * @param id {string} 活动Id
 * @param score {number} 结束活动获得的学分
 * @param impression {string} 活动感受
 * @param img {string} 活动图片（base64）
 * @return {Promise}
 * */
export function end(id, score, impression, img) {
    let params = new URLSearchParams()
    params.append('id', id)
    params.append('score', score)
    params.append('impression', impression)
    params.append('img', img)
    return http.post(`${url}/teacher/end`, params)
        .catch(err => console.log(err))
}

/**
 * @method 获得班级列表
 * @param grade {string} 年级
 * @return {Promise<string[]>}
 * */
export function getClass(grade) {
    return http.get(`${url}/teacher/getClass`, {params: {grade: grade}})
        .then(res => res.data)
        .catch(err => console.log(err))

}

/**
 * @method 获得学生列表
 * @param grade {string} 年级
 * @param classes {string} 班级
 * @return {Promise<string[]>}
 * */
export function getStudent(grade, classes) {
    return http.get(`${url}/teacher/getStudent`, {params: {grade: grade, class: classes}})
        .then(res => res.data)
        .catch(err => console.log(err))

}

/**
 *@mothed 获得学分
 * @param grade {string} 年级
 * @param classes {string} 班级
 * @return {Promise<object[]>}
 * */
export function getScore(grade, classes) {
    return http.get(`${url}/teacher/score`, {params: {grade: grade, class: classes}})
        .then(res => res.data)
        .catch(err => console.log(err))
}

/**
 * @method 添加活动
 * @param name {string} 活动名称
 * @param introduction {string} 活动介绍
 * @param date {string} 活动时间
 * @param message {Array<string>} 活动。。
 * @return {Promise}
 * */
export function add(name, introduction, date, message) {
    let params = new URLSearchParams()
    params.append('name', name)
    params.append('introduction', introduction)
    params.append('date', date)
    params.append('message', JSON.stringify(message))
    return http.post(`${url}/teacher/add`, params)
        .catch(err => console.log(err))
}

/**
 * @method 修改密码
 * @return {Promise.<string>}
 * @param p {string} 原密码
 * @param pass {string} 新密码
 * */
export function change(p, pass) {
    let params = new URLSearchParams()
    params.append('password', p)
    params.append('newPassword', pass)
    return http.post(`${url}/message/change`, params)
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}


/**
 * @method 获取图片
 * @return {Promise.<object>}
 * @param activityid {int} 活动Id
 */
export function getPhotos(activityid) {
    return http.get(`${url}/teacher/getPhotos`, {params: {id: activityid}})
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}


/**
 *获取消息
 * @return {Promise.<object[]>}
 */
export function getNotice() {
    return http.get(`${url}/student/notice`)
        .then(res => res.data)
        .catch(err => {
            console.log(err)
        })
}

/**
 * 消息已读
 * @return {void}
 * @param id 消息Id
 */
export function readNotice(id) {
    http.get(`${url}/student/readNotice`, {params: {id: id}})
}

//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}