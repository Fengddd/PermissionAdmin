<template>
    <el-container style="margin-left: -20px;">

        <el-header>
            <br/>
            <template>
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="名称">
                        <el-input v-model="searchName" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="SearchUserGroup()">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="ShowAddOrEditUserGroup('add')">添加</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="AssignUserGroup()">分配用户组</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-header>

        <el-main>

            <el-table
                    ref="multipleTable"
                    :data="userGroupList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="SelectedChk"
            >

                <el-table-column
                        prop="id"
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column
                        prop="UserGroupName"
                        label="用户组名称"
                        width="120">
                </el-table-column>

                <el-table-column
                        prop="CreatDateTime"
                        label="创建时间"
                        :formatter="DateFormat"
                        show-overflow-tooltip>
                </el-table-column>

                <el-table-column
                        prop="CreateUserName"
                        label="创建人"
                        show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">

                        <el-button
                                size="mini"
                                @click="ShowAddOrEditUserGroup(scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="DelUserGroup(scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <el-dialog title="用户组信息" :visible.sync="dialogFormVisible">

                <el-radio-group v-model="labelPosition" size="small">
                    <el-radio-button label="left">左对齐</el-radio-button>
                    <el-radio-button label="right">右对齐</el-radio-button>
                    <el-radio-button label="top">顶部对齐</el-radio-button>
                </el-radio-group>
                <div style="margin: 20px;"></div>

                <el-form :model="userGroup" :label-position="labelPosition">
                    <el-form-item label="用户组名称">
                        <el-input v-model="userGroup.userGroupName" style="width: 600px;"></el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="AddOrEditUserGroup()">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="用户信息" :visible.sync="dialogUserVisible">
               <el-user></el-user>
            </el-dialog>

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
    import GlobalUser from '../../../src/pages/User/GlobalUser.vue'
    import moment from 'moment';
    export default {
        components: {
            ElFooter,
            ElMain,
            ElHeader,
            "el-user":GlobalUser
        },
        data() {
            return {
                userGroupList:[],
                multipleSelection:[],
                total:0,
                pagesize:5,
                pageIndex:1,
                searchName:"",
                dialogFormVisible: false,
                dialogUserVisible:false,
                labelPosition:"right",
                addOrEdit:"",
                userGroup:{
                    userGroupName:""
                }
            }
        },
        mounted:function () { //生命周期的一部分，在实例化创建完成后，需要查询某一个方法 需要定义一个mounted 方法
            this.UserGroupView();
        },
        methods: {
            UserGroupView:function () {
                var params={
                    pagesize:this.pagesize,
                    pageIndex:this.pageIndex,
                    searchName:this.searchName
                };
                var vm=this;
                this.axios({
                    method: 'post',
                    url: 'http://localhost:25960/api/User/GetUserGroupList',
                    data: params
                }).then(function (response) {
                    vm.userGroupList=response.Result;
                    vm.total=response.Total;

                }).catch(function (error) {
                    console.log(error);
                });

            },
            handleSizeChange:function(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize=val;
                this.UserGroupView();
            },
            handleCurrentChange:function(val) {
                console.log(`当前页: ${val}`);
                this.pageIndex=val;
                this.UserGroupView();
            },
            SearchUserGroup:function () {
                this.UserGroupView();
            },AddOrEditUserGroup:function () {
                var addOrEdit=this.addOrEdit;
                var userGroupName=this.userGroup.userGroupName;
                var vm=this;
                if(addOrEdit=="add"){
                    this.axios({
                        method: 'post',
                        url: 'http://localhost:25960/api/User/AddUserGroup',
                        data: {userGroupName:userGroupName}
                    }).then(function (response) {
                        if(response.IsSucceed==true){
                            vm.userGroup.userGroupName="";
                            vm.dialogFormVisible = false;
                            vm.UserGroupView();
                            return;
                        }else{
                            vm.$message(response.Message);
                        }
                    }).catch(function (error) {
                        vm.$message(error);
                    });

                }else{
                    var userGroupId=addOrEdit;
                    this.axios({
                        method: 'put',
                        url: 'http://localhost:25960/api/User/EditUserGroup',
                        params: {userGroupName:userGroupName,groupId:userGroupId}
                    }).then(function (response) {
                        if(response.IsSucceed==true){
                            vm.$message(response.Message);
                            vm.userGroup.userGroupName="";
                            vm.dialogFormVisible = false;
                            vm.UserGroupView();
                            return;
                        }else{
                            vm.$message(response.Message);
                        }
                    }).catch(function (error) {
                        vm.$message(error);
                    });

                }
            },
            ShowAddOrEditUserGroup:function (data){
                 var vm=this;
                if(data=="add"){
                    vm.addOrEdit=data;
                }else{
                    vm.addOrEdit=data.Id;
                    this.axios({
                        method: 'get',
                        url: 'http://localhost:25960/api/User/GetUserGroup',
                        params: {groupId:vm.addOrEdit}
                    }).then(function (response) {
                        if(response.IsSucceed==true){
                            vm.userGroup.userGroupName=response.Result.UserGroupName;
                            return;
                        }else{
                            vm.$message(response.Message);
                        }
                    }).catch(function (error) {
                        vm.$message(error);
                    });
                }
                vm.dialogFormVisible = true
            },
            DelUserGroup:function (userGroup) {
                var vm=this;
                var groupId = userGroup.Id;
                this.axios({
                    method: 'delete',
                    url: 'http://localhost:25960/api/User/DelUserGroup',
                    params:{groupId:groupId}
                }).then(function (response) {
                    if(response.IsSucceed==true){
                        vm.$message({
                            showClose:true,
                            message: response.Message
                        });
                        vm.UserGroupView();
                        return;
                    }else{
                        vm.$message({
                            showClose:true,
                            message: response.Message
                        });
                    }
                }).catch(function (error) {
                    vm.$message(error);
                });

            },DateFormat:function (row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD");
            },
            AssignUserGroup:function () {
                var selectedRows=this.multipleSelection;

                this.dialogUserVisible=true;
            },
            SelectedChk:function (val) {
               this.multipleSelection=val;

            }
        }
    }

</script>
