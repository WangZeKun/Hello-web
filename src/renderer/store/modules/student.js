import {getStudentActivity} from '../../api/api'
const state = {
    root: [],
    class:[],
    grade:[],
    router: [{
        name: '参与活动',
        iconCls: 'fa fa-id-card-o',
        type: 'student',
        leaf: true,
        path: '/student/activitied',
    }, {
        name: '学校活动',
        iconCls: 'fa fa-id-card-o',
        type: 'student',
        children: []
    }, {
        name: '年级活动',
        iconCls: 'fa fa-id-card-o',
        type: 'student',
        children: []
    }, {
        name: '班级活动',
        iconCls: 'fa fa-id-card-o',
        type: 'student',
        children: []
    }]
}

const getters ={
    getRoot: state => {
        let tmp = []
        for (let i of state.root){
            tmp.push({id:'/student/activity/'+i.Id,name:i.Name})
        }
        return tmp
    },
    getClass:state =>{
        let tmp = []
        for (let i of state.class){
            tmp.push({id:'/student/activity/'+i.Id,name:i.Name})
        }
        return tmp
    },
    getGrade:state=>{
        let tmp = []
        for (let i of state.grade){
            tmp.push({id:'/student/activity/'+i.Id,name:i.Name})
        }
        return tmp
    },
    getRouter:(state)=>{
        return state.router
    }
}

const mutations = {
    DECREMENT_MAIN_COUNTER (state) {
        state.main--
    },
    INCREMENT_MAIN_COUNTER (state) {
        state.main++
    },
    updateActivity(state,payload){
        state[payload.type] = payload.value
    }
}

const actions = {
    updateActivity ({commit}) {
        // do something async
        getStudentActivity({who:'root'}).then(val=>{
            commit('updateActivity',{type:'root','value':val})
        })
        getStudentActivity({who:'class'}).then(val=>{
            commit('updateActivity',{type:'class','value':val})
        })
        getStudentActivity({who:'grade'}).then(val=>{
            commit('updateActivity',{type:'grade','value':val})
        })
    }
}

export default {
    getters,
    state,
    mutations,
    actions
}
