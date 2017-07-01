<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left"
             class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="教育ID"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="select" >
            <el-select v-model="ruleForm.select" placeholder="登录用户" style="width: 100%">
                <el-option
                        v-for="item in options"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录
            </el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
    </el-form>
</template>

<script>
    import {requestLogin} from '../api/api';
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
    //import NProgress from 'nprogress'
    export default {
        components: {
            ElFormItem,
            ElButton},
        data() {
            return {
                logining: false,
                ruleForm: {
                    account: '',
                    checkPass: '',
                    select:''
                },
                options:[
                    '学生登陆',
                    '教师登陆'
                ],
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ],
                    select: [
                        {required: true, message: '请选择用户'},
                        //{ validator: validaePass2 }
                    ]
                },
            };
        },
        methods: {
            handleSubmit2(ev) {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        requestLogin(
                            this.ruleForm.account,
                            this.ruleForm.checkPass,
                            this.ruleForm.select
                        ).then(data => {
                            this.logining = false;
                            //NProgress.done();
                            let msg = data.Message;
                            if (msg ==="成功，教师登录！"){
                                let user = data.Data.user;
                                sessionStorage.setItem('user', JSON.stringify(user));
                                sessionStorage.setItem('type', 'teacher');
                                console.log(user);
                                this.$router.push({path: '/teacher'});
                            }else if(msg ==="成功，学生登录！"){
                                console.log(user);
                                let user = data.Data.user;
                                sessionStorage.setItem('user', JSON.stringify(user));
                                sessionStorage.setItem('type', 'student');
                                this.$router.push({path: '/student'});
                            }else{
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style scoped lang="scss">
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        background-color: #fff;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
    }
</style>