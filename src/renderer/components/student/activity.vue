<template>
    <section v-loading="loading">
        <h1>{{activity.Name}}</h1>
        <h3>活动时间：{{activity.Date}}</h3>
        <xmp>{{activity.Introduction}}</xmp>
        <br>
        <br>
        <el-form ref="form" :model="form" label-width="80px" v-if="form.length!==0" :inline="true" class="demo-form-inline left" :rules="rules">
            <el-form-item  v-for="(i,name) in form" v-bind:label="name" :key="name">
                <el-input v-model="form[name]"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="jion1(activity.Id)" v-loading="loadingbutton">报名活动</el-button>
        <br>
        <br>
    </section>
</template>

<script>
    import {getSingle, setJion} from '../../api/api'
    export default {
        data() {
            return {
                activity: {},
                loading: true,
                loadingbutton:false,
                form: {
                },
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
            }
        },
        methods: {
            get(){
                this.form = {};
                this.loading = true;
                getSingle(this.$route.params.id)
                    .then(res => {
                        this.loading = false;
                        this.activity = res;
                        for (let x of this.activity.Message){
                            this.form[x]=''
                            this.rules[x]=[
                                {required: true, message: '请输入信息', trigger: 'blur'},
                            ]
                        }
                        console.log(JSON.stringify(this.activity))
                    })
            },
            jion1(id){
                this.loadingbutton = true
                setJion(id,JSON.stringify(this.form)).then(m => {
                    this.$message({
                        message: m,
                        type: m === '您已经报过名了！' ? 'error' : 'success',
                    });
                    this.loadingbutton = false
                })
            }
        },
        mounted: function () {
            this.get()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'get'
        },
    }

</script>
<style scoped>
    section {
        text-align: center;
    }
    xmp {
        font-size:15px;
        text-align: left;
        padding-left: 30px;
        padding-right: 30px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .left{
        text-align: left;
    }
</style>