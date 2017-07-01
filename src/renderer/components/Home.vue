<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed ? '' : sysName}}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img
                            :src="this.sysUserAvatar"/> {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <template v-if="type === 'teacher'">
                            <el-dropdown-item @click.native="addOpen">添加活动</el-dropdown-item>
                            <el-dropdown-item @click.native="endOpen">结束活动</el-dropdown-item>
                        </template>
                        <el-dropdown-item :divided="type === 'teacher'">我的消息</el-dropdown-item>
                        <el-dropdown-item @click.native="changeOpen">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="getMessage">刷新</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'"
                   v-loading="loading"
                   element-loading-text="加载活动列表中">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo"
                         unique-opened router v-show="!collapsed" style="overflow: auto">
                    <template v-for="(item,index) in router" v-if="item.type === type">
                        <el-submenu :index="index+''" v-if="!item.leaf" :disabled="item.children.length===0">
                            <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                          v-if="!child.hidden">{{child.name}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :index="item.path"><i
                                :class="item.iconCls"></i>{{item.name}}
                        </el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in router" v-if="item.type === type" class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                                 @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                                @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
                                    class="el-menu-item" style="padding-left: 40px;"
                                    :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{child.name}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <ul style="padding: 0px">
                                <li class="el-submenu">
                                    <div class="el-submenu__title el-menu-item"
                                         style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                                         :class="$route.path==item.path?'is-active':''"
                                         @click="$router.push(item.path)"><i :class="item.iconCls"></i>
                                    </div>
                                </li>
                            </ul>
                        </template>
                    </li>
                </ul>
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
        <add ref="add" v-if="type === 'teacher'" @get="getMessage"></add>
        <end ref="end" :nowActivity="nowActivity" v-if="type === 'teacher'"></end>
        <change ref="change" v-if="type === 'teacher'"></change>
    </el-row>
</template>

<script>
    import {getStudentActivity, getTeacherActivity, exit} from '../api/api';
    import userPng from '../assets/user.png'
    import change1 from './other/change'
    import end1 from './other/end'
    import add1 from './other/add'
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
    export default {
        components: {
            ElButton,
            'change': change1,
            'end': end1,
            'add': add1
        },
        data() {
            return {
                nowActivity: [],
                dialogEndVisible: false,
                dialogVisible: false,
                dialogChangeVisible: false,
                sysName: '广中志愿活动管理',
                type: '',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                    loading: 0,
            }
        },
        methods: {
            getStudentMessage: function () {
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
            getTeacherMessage: function () {
                this.loading = 2
                getTeacherActivity('now').then(res => {
                    this.loading -= 1
                    console.log(res)
                    this.router[4].children = []
                    if (res !== null && res.length !== 0) {
                        this.router[4].children = res.map(a => {
                            return {path: '/teacher/now/' + a.Id, name: a.Name}
                        })
                        this.nowActivity = res.map(a => {
                            return {id: a.Id, name: a.Name}
                        })
                    } else {
                        this.router[4].children.push({name: '还没有活动哦', path: ''})
                    }
                    console.log(this.loading)
                });
                getTeacherActivity('end').then(res => {
                    this.loading -= 1
                    console.log(res)
                    this.router[5].children = []
                    if (res !== null && res.length !== 0) {
                        this.router[5].children = res.map(a => {
                            return {path: '/teacher/end/' + a.Id, name: a.Name}
                        })
                    } else {
                        this.router[5].children.push({name: '还没有活动哦', path: ''})
                    }
                    console.log(this.loading)
                })
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
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status){
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            },
            getMessage(){
                if (this.type === 'student') {
                    this.getStudentMessage()
                } else if (this.type === 'teacher') {
                    this.getTeacherMessage()
                }
            },
            change(){
                let path = this.$route.path;
                if (path === '/student' || path === '/teacher') {
                    this.getMessage()
                }
            },
            addOpen(){
                this.$refs.add.dialogVisible = true
                console.log(this.$refs.add.dialogVisible = true)
            },
            endOpen(){
                this.$refs.end.dialogVisible = true
            },
            changeOpen(){
                this.$refs.change.dialogVisible = true
            },
        },
        mounted() {
            this.type = sessionStorage.getItem('type');
            let user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.Name || user.Id;
                this.sysUserAvatar = user.Avatar || userPng;
            }
            this.getMessage()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'change'
        },
    }

</script>

<style scoped lang="scss">

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            background-color: #20a0ff;
            line-height: 60px;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: #fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                //width:230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
            // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px;
                // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }

                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
            }
            .content-container {
                // background: #f1f2f7;
                flex: 1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>