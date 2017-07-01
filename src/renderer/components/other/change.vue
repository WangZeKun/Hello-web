<template>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" size="tiny">
        <el-form :model="formChange" label-position="left" :rules="ruleChange" ref="formChange">
            <el-form-item label="原密码：" prop="p">
                <el-input v-model="formChange.p" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="pass">
                <el-input v-model="formChange.pass" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkPass">
                <el-input v-model="formChange.checkPass" type=password></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changePass" :loading="loadingChange">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {change} from '../../api/api'
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.formChange.checkPass !== '') {
                        this.$refs.formChange.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formChange.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible:false,
                loadingChange: false,
                formChange: {
                    p: '',
                    pass: '',
                    checkPass: ''
                },
                ruleChange: {
                    p: [{
                        required: true, message: '请输入原密码'
                    }],
                    pass: [{
                        validator: validatePass, tigger: 'blur'
                    }],
                    checkpass: [{
                        validator: validatePass2, tigger: 'blur'
                    }]
                },
            }
        },
        methods: {
            changePass:function(){
                console.log(123456)
                this.$refs.formChange.validate((valid) => {
                    if (valid) {
                        this.loadingChange = true
                        change(this.formChange.p, this.formChange.pass)
                            .then(res => {
                                this.dialogVisible = false
                                this.loadingChange = false
                                this.formChange = {
                                    p: '',
                                    pass: '',
                                    checkPass: ''
                                }
                                this.$message({
                                    message: res,
                                    type: (res === '原密码错误！') ? 'error' : 'success'
                                })
                            })
                    }
                })
            },
        }
    }
</script>