<template>
    <el-dialog title="添加活动" :visible.sync="dialogVisible" size="small">
        <el-form :model="formAdd" label-position="top" :rules="ruleAdd" ref="formAdd">
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="formAdd.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="活动简介：" prop="introduction">
                <el-input
                        type="textarea"
                        :rows="3"
                        v-model="formAdd.introduction">
                </el-input>
            </el-form-item>
            <el-form-item label="活动时间：" prop="date">
                <el-date-picker
                        v-model="formAdd.date"
                        type="date"
                        :editable=false
                        :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="额外信息：">
                <el-tag
                        :key="tag"
                        :hit=true
                        type="primary"
                        v-for="tag in formAdd.message"
                        :closable="true"
                        :close-transition="false"
                        @close="handleClose(tag)"
                >
                    {{tag}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="mini"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                >
                </el-input>
                <el-button class="button-new-tag" v-else size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addActivity" :loading="loadingAdd">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {add} from '../../api/api'
    export default{
        data(){
            return{
                dialogVisible:false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                formAdd: {
                    name: '',
                    date: '',
                    introduction: '',
                    message: [],
                },
                ruleAdd: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    introduction: [
                        {required: true, message: '请输入活动简介', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ],
                    date: [
                        {required: true, message: '请选择活动时间'},
                        //{ validator: validaePass2 }
                    ]
                },

                inputVisible: false,
                inputValue: '',
                loadingAdd: false,
            }
        },
        methods:{
            addActivity(){
                this.$refs.formAdd.validate((valid) => {
                    if (valid) {
                        this.loadingAdd = true
                        add(this.formAdd.name,
                            this.formAdd.introduction,
                            this.formAdd.date.Format("yyyy-MM-dd"),
                            this.formAdd.message).then(() => {
                            this.getMessage()
                            this.formAdd = {
                                name: '',
                                date: '',
                                introduction: '',
                                message: [],
                            }
                            this.loadingAdd = false
                            this.dialogVisible = false
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            })
                        })
                    } else {
                        return false
                    }
                })
            },
            handleClose(tag){
                this.formAdd.message.splice(this.formAdd.message.indexOf(tag), 1);
            },
            showInput(){
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm(){
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.formAdd.message.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            getMessage(){
                this.$emit("get")
            }
        }
    }
</script>