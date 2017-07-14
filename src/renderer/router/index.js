import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import StudentHome from '../components/student/student.vue'
import TeacherHome from '../components/teacher/teacher.vue'
import Home from '../components/Home.vue'
import Text from '../components/student/text.vue'
import Table from '../components/student/huodong.vue'
import Message from '../components/student/activity.vue'
import Jion from '../components/teacher/Jion.vue'
import End from '../components/teacher/end.vue'
import Score from '../components/teacher/score.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'landing-page',
            component: Login
        },
        {
            path: '/student',
            component: StudentHome,
            children: [
                {path: '/student/activitied', component: Table},
                {path: '/student/activity/:id', component: Message},
                {path: '/student/text', component: Text}
            ]
        },
        {
            path: '/teacher',
            component: TeacherHome,
            children: [
                {path: '/teacher/activitied', component: Table},
                {path: '/teacher/now/:id', component: Jion},
                {path: '/teacher/end/:id', component: End},
                {path: '/teacher/score', component: Score}
            ]
        },
    ]
})
