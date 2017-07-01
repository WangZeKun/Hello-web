<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="formClass">
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
                    <el-select v-model="formClass.class" placeholder="班级" :loading="loadingClass">
                        <el-option
                                v-for="(item,index) in classes"
                                :key="index"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getScore">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="score" highlight-current-row v-loading="ListLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column v-if="isName" prop="Class" label="班级">
            </el-table-column>
            <el-table-column v-else prop="Name" label="姓名">
            </el-table-column>
            <el-table-column prop="Score" label="学分">
            </el-table-column>
            <el-table-column prop="Num" label="参与活动次数">
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    import {getScore, getClass} from '../../api/api';
    export default {
        data() {
            return {
                ListLoading: false,
                loadingClass: false,
                grades: ["初一", "初二", "初三", "高一", "高二", "高三"],
                classes: [],
                formClass: {
                    grade: '',
                    class: '',
                },
                isName: true,
                score: []
            }
        },
        methods: {
            getClass(){
                this.loadingClass = true
                getClass(this.formClass.grade)
                    .then(res => {
                        this.loadingClass = false
                        this.classes = res
                        this.classes.push("全年级")
                    })
            },
            getScore(){
                this.ListLoading = true;
                if (this.formClass.class === "全年级") {
                    this.formClass.class = "";
                }
                getScore(this.formClass.grade, this.formClass.class)
                    .then(res => {
                        this.score = res
                        console.log(this.score)
                        this.ListLoading = false
                        this.isName = this.score.filter(val => !val.Name).length !== 0
                    })
            }
        }
    }
</script>

<style scoped>
</style>