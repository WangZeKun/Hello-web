<template>
    <section>
        <el-table
                v-loading="loading"
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column
                    prop="Date"
                    label="报名日期"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="Adate"
                    label="活动日期"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="Name"
                    label="活动名称">
            </el-table-column>
            <el-table-column
                    prop="WhoBuild"
                    label="发起人">
            </el-table-column>
            <el-table-column
                    prop="Status"
                    label="报名情况"
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

    </section>
</template>

<script>
    //import NProgress from 'nprogress'
    import {getCanjia} from '../../api/api';

    export default {
        data() {
            return {
                tableData:[],
                m:{
                    审核中:'success',
                    审核通过:'primary',
                    审核不通过:'danger'
                },
                loading:true,
            }
        },
        methods: {
            filterTag(value, row) {
                return row.Status === value;
            },
            load(){
                this.loading = true;
                getCanjia().then(res =>{
                    this.tableData = res;
                    console.log(this.tableData);
                    this.loading = false;
                })
            }
        },
        mounted: function () {
            this.load()

        }
    }

</script>

<style scoped>

</style>