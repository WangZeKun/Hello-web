<template>
    <section v-loading="loading">
        <h1>{{activity.Name}}</h1>
        <h3>活动时间：{{activity.Date}}</h3>
        <xmp>{{activity.Introduction}}</xmp>
        <br>
        <br>
        <el-form ref="form" :model="form" label-width="80px" v-if="form.length!==0" :inline="true" class="left"
                 :rules="rules">
            <el-form-item v-for="(m,i) in activity.Message" v-bind:label="m.name" :key="i" v-if="m.type==='input'">
                <el-input  v-model="form[m.name]"></el-input>
            </el-form-item>
        </el-form>
        <el-form :model="form" label-width="80px" v-if="form.length!==0" class="left"
                 :rules="rules" style="padding-right: 60px">
            <el-form-item v-for="(m,i) in activity.Message" v-bind:label="m.name" :key="i" v-if="m.type==='textarea'">
                <el-input  type="textarea" autosize v-model="form[m.name]"></el-input>
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
                loadingbutton: false,
                form: {},
                rules: {}
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
                        for (let x of this.activity.Message) {
                            this.form[x.name] = ''
                            this.rules[x.name] = [
                                {required: true, message: '请输入信息', trigger: 'blur'},
                            ]
                        }
                        console.log(this.form)
                    })
            },
            jion1(id){
                this.loadingbutton = true
                setJion(id, JSON.stringify(this.form)).then(m => {
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
        font-size: 15px;
        text-align: left;
        padding-left: 30px;
        padding-right: 30px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .left {
        text-align: left;
    }
</style>