<template>
    <section v-loading="loading">
        <el-table
                :data="data"
                ref="multipleTable"
                style="width: 100%">
            <el-table-column type="expand" v-if="extand">
                <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item v-for="(_,item) in form" :label="item" :key="item">
                            <span>{{props.row.Message[item] }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="index" width="60">
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
        <section style="padding-left: 20px">
            <h3>获得学分：{{activity.Score}}</h3>
        </section>
        <section class="web">
            <h3>活动感受：</h3>
            <xmp>{{activity.Impression}}</xmp>
        </section>
        <section v-if="photos.length !==0" class="web">
            <h3>活动照片</h3>
            <el-row>
                <el-col :span="8" v-for="(data, index) in photos" :key="index">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="data.Photo" class="img" :alt="activity.Name+'的活动照片'">
                    </el-card>
                </el-col>
            </el-row>
        </section>
        <el-col :span="24" class="toolbar" style="padding: 20px;text-align: right">
            <el-button type="danger" @click="delActivity">删除活动</el-button>
        </el-col>
    </section>
</template>

<script>
    import {del, getSingle, getJions, setStatus,getPhotos} from '../../api/api'
    export default {
        data: function () {
            return {
                photos:[],
                data: [],
                form: {},
                loading: false,
                extand: false,
                m: {
                    审核中: 'success',
                    审核通过: 'primary',
                    审核不通过: 'danger'
                },
                activity: {
                    ImagePath:[]
                }
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
                            this.form[x] = ''
                        }
                        this.getJions()
                        this.getPhotos()
                    })
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
                        });
                    })
                }).catch((err) => {
                    console.log(err)
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                });
            },
            getJions(){
                this.loading = true
                getJions(this.activity.Id)
                    .then(res => {
                        this.data = res;
                        console.log(this.data);
                        this.loading = false;
                    })
            },
            getPhotos(){
                getPhotos(this.activity.Id)
                    .then(val =>{
                        if (val !== null){
                            this.photos = val
                        }
                    })
            },
            filterTag(value, row) {
                return row.Status === value;
            },
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

    .web {
        padding: 20px;
    }

    .img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }
</style>