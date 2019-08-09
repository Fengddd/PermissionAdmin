<template>
    <el-container style="margin-left: -20px;">

        <el-header>
            <br/>
            <template>
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="名称">
                        <el-input v-model="searchName" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input v-model="searchPwd"  placeholder="电话号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="SearchUser()">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="">确定</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-header>

        <el-main>
            <el-table
                    ref="multipleTable"
                    :data="userList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="SelectedChk"
            >

                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column
                        prop="UserName"
                        label="姓名"
                        width="120">
                </el-table-column>

                <el-table-column
                        prop="UserPassword"
                        label="密码"
                        show-overflow-tooltip>
                </el-table-column>

                <el-table-column
                        prop="UserPhone"
                        label="电话"
                        show-overflow-tooltip>
                </el-table-column>

                <el-table-column
                        prop="Address.AddressDetails"
                        label="地址"
                        show-overflow-tooltip>
                </el-table-column>

            </el-table>
        </el-main>

        <el-footer align="center">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </el-footer>

    </el-container>

</template>

<script>
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
    import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
    import ElFooter from "../../../node_modules/element-ui/packages/footer/src/main.vue";
    export default {
        components: {
            ElFooter,
            ElMain,
            ElHeader
        },
        data() {
            return {
                userList:[],
                multipleSelection:[],
                total:0,
                pagesize:5,
                pageIndex:1,
                searchName:"",
                searchPwd:""
            }
        },
        mounted:function () { //生命周期的一部分，在实例化创建完成后，需要查询某一个方法 需要定义一个mounted 方法
            this.UserView();
        },
        methods: {
            UserView:function () {
                var params={
                    pagesize:this.pagesize,
                    pageIndex:this.pageIndex,
                    searchName:this.searchName,
                    searchPwd:this.searchPwd
                };
                var vm=this;
                this.axios({
                    method: 'post',
                    url: 'http://localhost:25960/api/User/GetUserList',
                    data: params
                }).then(function (response) {
                    vm.userList=response.Result;
                    vm.total=response.Total;
                }).catch(function (error) {
                    console.log(error);
                });

            },
            handleSizeChange:function(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize=val;
                this.UserView();
            },
            handleCurrentChange:function(val) {
                console.log(`当前页: ${val}`);
                this.pageIndex=val;
                this.UserView();
            },
            SearchUser:function () {
                this.UserView();
            },
            SelectedChk:function (val) {
                this.multipleSelection=val;
                console.log(this.multipleSelection);
            }

        }
    }

</script>


