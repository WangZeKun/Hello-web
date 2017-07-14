<template>
    <div>
        <home :router="router" :loading="loading" ref="home">
            <template slot="menu">
                <el-dropdown-item>我的消息</el-dropdown-item>
                <el-dropdown-item @click.native="changeOpen">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="getStudentMessage">刷新</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </template>
        </home>
        <change ref="change"></change>
    </div>
</template>

<script>
    import {getStudentActivity,exit,getNotice,readNotice} from '../../api/api'
    import home from '../other/home.vue'
    import change from '../other/change.vue'
    export default {
        components: {
            home, change
        },
        data() {
            return {
                router: [
                    {
                        name: '参与活动',
                        iconCls: 'fa fa-soccer-ball-o',
                        type: 'student',
                        leaf: true,
                        path: '/student/activitied',
                    }, {
                        name: '学校活动',
                        iconCls: 'fa fa-bank',
                        type: 'student',
                        children: []
                    }, {
                        name: '年级活动',
                        iconCls: 'fa fa-address-book',
                        type: 'student',
                        children: []
                    }, {
                        name: '班级活动',
                        iconCls: 'fa fa-archive',
                        type: 'student',
                        children: []
                    },{
                        name:'文本编辑',
                        leaf:true,
                        path:'/student/text'
                    }],
                loading: 0,
                notices:[]
            }
        },
        methods: {
            getStudentMessage: function () {
                getNotice().then(val =>{
                    for (let x of val){
                        this.$notify({
                            title: '通知',
                            message: x.Message,
                            duration: 0,
                            onClose(){
                                readNotice(x.Id)
                            }
                        });
                    }
                })
                this.loading = 3
                getStudentActivity('root').then(res => {
                    this.router[1].children = []
                    if (res !== null) {
                        for (let x of res) {
                            this.router[1].children.push({path: '/student/activity/' + x.Id, name: x.Name});
                        }
                    } else {
                        this.router[1].children.push({name: '还没有活动哦', path: ''})
                    }
                    this.loading -= 1
                    console.log(this.loading)
                });
                getStudentActivity('grade').then(res => {
                    this.router[2].children = []
                    if (res !== null) {
                        for (let x of res) {
                            this.router[2].children.push({path: '/student/activity/' + x.Id, name: x.Name});
                        }
                    } else {
                        this.router[2].children.push({name: '还没有活动哦', path: ''})
                    }
                    this.loading -= 1
                    console.log(this.loading)
                });
                getStudentActivity('class').then(res => {
                    this.router[3].children = []
                    if (res !== null) {
                        for (let x of res) {
                            this.router[3].children.push({path: '/student/activity/' + x.Id, name: x.Name});
                        }
                    } else {
                        this.router[3].children.push({name: '还没有活动哦', path: ''})
                    }
                    this.loading -= 1
                    console.log(this.loading)
                });
            },
            //退出登录
            logout: function () {
                let _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem('user');
                    _this.$router.push('/login');
                    exit()
                }).catch(() => {

                });
            },
            change(){
                let path = this.$route.path;
                if (path === '/student') {
                    this.getStudentMessage()
                }
            },
            changeOpen(){
                console.log(this.$refs)
                this.$refs.change.dialogVisible = true
            },
        },
        mounted() {
            this.getStudentMessage()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'change'
        },
    }

</script>