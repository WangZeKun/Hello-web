<template>
    <section v-loading="loading">
          <el-table
                :data="data"
                ref="multipleTable"
                style="width: 100%"
                @selection-change="handleSelectionChange">
             <el-table-column
                    type="selection"
                    width="55">
            </el-table-column> 
             <el-table-column type="expand" v-if="extand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item v-for="(_,item) in form" :label="item" :key="item">
                             <span>{{props.row.Message[item] }}</span> 
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column> 
             <el-table-column
                    label="年级"
                    prop="Grade">
            </el-table-column>
            <el-table-column
                    label="班级"
                    prop="Class">
            </el-table-column>
            <el-table-column
                    label="姓名"
                    prop="Name">
            </el-table-column> 
             <el-table-column
                    prop="Status"
                    label="状态"
                    :filters="[
                        { text: '审核中', value: '审核中' },
                        { text: '审核通过', value: '审核通过'},
                        { text: '审核不通过', value: '审核不通过'}]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end">
                <template scope="scope">
                    <el-tag
                            :type="m[scope.row.Status]"
                            close-transition>{{scope.row.Status}}
                    </el-tag>
                </template>
            </el-table-column> 
        </el-table>  

            <el-col :span="24" class="toolbar" style="padding: 20px;text-align: right">  
            <el-button type="primary" v-on:click="PassSelection">通过</el-button>
            <el-button type="primary" @click="FailSelection">不通过</el-button>
            <el-button type="primary" @click="dialogVIsible = true">添加学生</el-button>
            <el-button type="danger" @click="delActivity">删除活动</el-button>
        </el-col> 
         <el-dialog title="添加同学" :model="formClass" :visible.sync="dialogVIsible" size="tiny">
            <el-form :model="formClass">
                <el-form-item>
                    <el-select v-model="formClass.grade" placeholder="年级" @change="getClass">
                        <el-option
                                v-for="(item,index) in grades"
                                :key="index"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formClass.class" placeholder="班级" :loading="loadingClass"
                               @change="getStudent">
                        <el-option
                                v-for="(item,index) in classes"
                                :key="index"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formClass.id" placeholder="姓名" :loading="loadingClass">
                        <el-option
                                v-for="(item,index) in students"
                                :key="index"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVIsible = false">取 消</el-button>
                <el-button type="primary" @click="addStu" :loading="loadingAddStu">确 定</el-button>
            </div>
        </el-dialog>  
    </section>
</template>

<script>
    import {del, addStu, getClass, getStudent, getSingle, getJions, setStatus} from '../../api/api'
    export default {
        data: function () {
            return {
                dialogVIsible: false,
                grades: ["初一", "初二", "初三", "高一", "高二", "高三"],
                classes: [],
                students: [],
                loading: true,
                loadingClass: false,
                loadingStudent: false,
                loadingAddStu: false,
                isgrade: false,
                data: [],
                form: {},
                extand: false,
                multipleSelection: [],
                m: {
                    审核中: 'success',
                    审核通过: 'primary',
                    审核不通过: 'danger'
                },
                formClass: {
                    grade: '',
                    class: '',
                    id: '',
                },
                activity: {}
            }
        },
        methods: {
            get(){
                this.form = {};
                this.loading = true;
                this.extand = false;
                getSingle(this.$route.params.id)
                    .then(res => {
                        this.activity = res;
                        for (let x of this.activity.Message) {
                            this.extand = true;
                            this.form[x.name] = ''
                        }
                        this.getJions()
                    })

            },
            getJions(){
                getJions(this.activity.Id)
                    .then(res => {
                        this.data = res;
                        console.log(this.data);
                        if (this.extand) {
                            for (let x in this.data) {
                                this.data[x].Message = JSON.parse(this.data[x].Message)
                            }
                        }
                        this.loading = false;
                    })
            },
            getClass(){
                this.loadingClass = true
                getClass(this.formClass.grade)
                    .then(res => {
                        this.loadingClass = false
                        this.classes = res
                    })
            },
            getStudent(){
                this.loadingStudent = true
                getStudent(this.formClass.grade, this.formClass.class)
                    .then(res => {
                        this.loadingStudent = false
                        this.students = res
                    })
            },
            addStu(){
                this.loadingAddStu = true
                addStu(this.formClass.id, this.activity.Id)
                    .then(() => {
                        this.loadingAddStu = false
                        this.dialogVIsible = false
                        this.formClass = {
                            grade: '',
                            class: '',
                            id: '',
                        }
                        this.$message({
                            message: "添加成功！",
                            type: 'success'
                        })
                        this.getJions()
                    })
            },
            filterTag(value, row) {
                return row.Status === value;
            },
            PassSelection(){
                if (this.multipleSelection.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请选择要修改的同学！'
                    })
                } else {
                    this.$confirm('确定要通过吗？', '确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        console.log(this.multipleSelection)
                        setStatus(this.multipleSelection, '审核通过')
                            .then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.getJions()
                            })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });
                    });
                }
            },
            FailSelection(){
                if (this.multipleSelection.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请选择要修改的同学！'
                    })
                } else {
                    this.$confirm('确定设置为不通过吗？', '确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        console.log(this.multipleSelection)
                        setStatus(this.multipleSelection, '审核不通过')
                            .then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.getJions()
                            })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });
                    });
                }
            },
            handleSelectionChange(val){
                this.multipleSelection = val.map(val => val.Id);
            },
            delActivity(){
                this.$confirm('确定要删除此活动吗？', '确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    del(this.activity.Id).then(() => {
                        this.$router.push("/teacher")
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                    })
                }).catch((err) => {
                    console.log(err)
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                });
            }
        },

        mounted: function () {
            this.get()
        }
        ,
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'get'
        }
        ,
    }

</script>
<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>