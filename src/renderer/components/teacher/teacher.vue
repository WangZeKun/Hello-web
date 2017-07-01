<template>
    <div>
        <home :router="router" :loading="loading" ref="home">
            <template slot="menu">
                <el-dropdown-item @click.native="addOpen">添加活动</el-dropdown-item>
                <el-dropdown-item @click.native="endOpen">结束活动</el-dropdown-item>
                <el-dropdown-item divided>我的消息</el-dropdown-item>
                <el-dropdown-item @click.native="changeOpen">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="getTeacherMessage">刷新</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </template>
        </home>
        <add ref="add" @get="getTeacherMessage"></add>
        <end ref="end" :nowActivity="nowActivity"></end>
        <change ref="change"></change>
    </div>
</template>

<script>
    import {getTeacherActivity,exit} from '../../api/api'
    import home from '../other/home.vue'
    import change from '../other/change.vue'
    import add from '../other/add.vue'
    import end from '../other/end.vue'
    export default {
        components: {
            home, change, add, end
        },
        data() {
            return {
                nowActivity: [],
                router: [
                    {
                        name: '正在发布的活动',
                        iconCls: 'fa fa-hand-o-right',
                        children: []
                    }, {
                        name: '已经结束的活动',
                        iconCls: 'fa fa-calendar-check-o',
                        children: []
                    }, {
                        name: '学分查询',
                        iconCls: 'fa fa-search',
                        leaf: true,
                        path: '/teacher/score'
                    }],
                loading: 0,
            }
        },
        methods: {
            getTeacherMessage: function () {
                this.loading = 2
                getTeacherActivity('now').then(res => {
                    this.loading -= 1
                    console.log(res)
                    this.router[0].children = []
                    if (res !== null && res.length !== 0) {
                        this.router[0].children = res.map(a => {
                            return {path: '/teacher/now/' + a.Id, name: a.Name}
                        })
                        this.nowActivity = res.map(a => {
                            return {id: a.Id, name: a.Name}
                        })
                    } else {
                        this.router[0].children.push({name: '还没有活动哦', path: ''})
                    }
                    console.log(this.loading)
                });
                getTeacherActivity('end').then(res => {
                    this.loading -= 1
                    console.log(res)
                    this.router[1].children = []
                    if (res !== null && res.length !== 0) {
                        this.router[1].children = res.map(a => {
                            return {path: '/teacher/end/' + a.Id, name: a.Name}
                        })
                    } else {
                        this.router[1].children.push({name: '还没有活动哦', path: ''})
                    }
                    console.log(this.loading)
                })
            },
            change(){
                let path = this.$route.path;
                if (path === '/teacher') {
                    this.getTeacherMessage()
                }
            },
            changeOpen(){
                console.log(this.$refs)
                this.$refs.change.dialogVisible = true
            },
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
            addOpen(){
                this.$refs.add.dialogVisible = true
            },
            endOpen(){
                this.$refs.end.dialogVisible = true
            },
        },
        mounted() {
            this.getTeacherMessage()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'change'
        },
    }

</script>