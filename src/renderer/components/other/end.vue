<template>
    <el-dialog title="结束活动" :visible.sync="dialogVisible" size="small">
        <el-form :model="formEnd" label-position="top" :rules="ruleEnd" ref="formEnd">
            <el-form-item label="活动名称" prop="name">
                <el-select v-model="formEnd.select" style="width: 100%">
                    <el-option
                            v-for="item in nowActivity"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动学分：" prop="score">
                <el-input-number v-model="formEnd.score" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="活动感受：" prop="impression">
                <el-input
                        type="textarea"
                        :rows="3"
                        v-model="formEnd.impression">
                </el-input>
            </el-form-item>
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="/"
                    :on-change="Imgchange"
                    :on-remove="Imgchange"
                    accept="image/*"
                    :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过2Mb</div>
            </el-upload>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="endActivity" :loading="loadingEnd">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {end} from '../../api/api'
    export default{
        props:['nowActivity'],
        data(){
            return {
                dialogVisible:false,
                formEnd: {
                    select: '',
                    impression: '',
                    score: 0,
                    image: [],
                    fileList: [],
                },
                ruleEnd: {
                    select: [
                        {required: true, message: '请选择活动', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    impression: [
                        {required: true, message: '请输入活动感受', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ],
                    score: [
                        {required: true, message: '请选择活动学分'},
                        //{ validator: validaePass2 }
                    ]
                },
                loadingEnd: false,
            }
        },
        methods:{
            Imgchange(file, fileList){
                this.formEnd.fileList = fileList
            },
            ReadImg(file) {
                let reader = new FileReader();

                reader.onload = (e) => {
                    this.formEnd.image.push(e.target.result)
                    console.log(this.formEnd.image)
                };
                reader.readAsDataURL(file);
            },
            endActivity(){
                this.$refs.formEnd.validate((valid) => {
                    if (valid) {
                        this.loadingEnd = true
                        for (let x of this.formEnd.fileList) {
                            this.ReadImg(x.raw)
                        }
                        setTimeout(() => {
                            end(this.formEnd.select,
                                this.formEnd.score,
                                this.formEnd.impression,
                                JSON.stringify(this.formEnd.image))
                                .then(() => {
                                    this.formEnd = {
                                        select: '',
                                        impression: '',
                                        score: 0,
                                        image: [],
                                        fileList: [],
                                    }
                                    this.loadingEnd = false
                                    this.dialogVisible = false
                                    this.$router.push('/teacher')
                                    this.$message({
                                        type: 'success',
                                        message: '提交成功'
                                    })
                                })
                        }, 1000)
                    }
                })
            },
        }
    }
</script>