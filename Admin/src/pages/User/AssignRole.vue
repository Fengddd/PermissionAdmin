<template >
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
                        <el-button type="primary" @click="ConfirmBtn()">确定分配</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-header>

        <el-main id="userRoleMain">

            <div style="width: 175px;">
                <el-table
                        ref="multipleTable"
                        :data="roleList"
                        tooltip-effect="dark"
                        @selection-change="SelectedRole"
                        @select="SelectionRole"
                        @select-all="SelectionAll"
                >

                    <el-table-column
                            prop="id"
                            type="selection"
                            width="55">
                    </el-table-column>

                    <el-table-column
                            prop="RoleName"
                            label="角色名称"
                            width="120">
                    </el-table-column>




                </el-table>
            </div>

            <div style="width: 1000px;margin-left: 20px;">

                <el-table
                        ref="tableUser"
                        :data="userList"
                        tooltip-effect="dark"
                        @selection-change="SelectedUser"
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

            </div>

        </el-main>

    </el-container>
</template>

<script>
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
    import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
    import ElFooter from "../../../node_modules/element-ui/packages/footer/src/main.vue";
    import moment from 'moment';
    export default {
        components: {
            ElFooter,
            ElMain,
            ElHeader
        },
        data() {
            return {
                userList:[],
                roleList:[],
                SelectedUserList:[],
                SelectedRoleList:[],
                total:0,
                pagesize:100,
                pageIndex:1,
                searchName:"",
                searchPwd:""
            }
        },
        created :function () { //生命周期的一部分，在实例化创建完成后，需要查询某一个方法 需要定义一个mounted 方法

            this.$nextTick(function () {
                this.UserView();
                this.RoleView();
            })
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
            RoleView:function () {
                var params={
                    pagesize:this.pagesize,
                    pageIndex:this.pageIndex,
                };
                var vm=this;
                this.axios({
                    method: 'post',
                    url: 'http://localhost:25960/api/User/GetRoleList',
                    data: params
                }).then(function (response) {
                    vm.roleList=response.Result;

                }).catch(function (error) {
                    console.log(error);
                });

            },
            SearchUser:function () {
                this.UserView();
            },
            SelectedUser:function (val) {
                this.SelectedUserList=val;
            },
            SelectedRole:function (val) {
                this.SelectedRoleList=val;
            },
            ConfirmBtn:function () {
                var seRoleList=this.SelectedRoleList;
                var seUserList=this.SelectedUserList;
                if(seRoleList.length==0){
                    this.$message({
                        showClose:true,
                        message: "请选择角色!"
                    });
                    return;
                }
                if(seRoleList.length>1){
                    this.$message({
                        showClose:true,
                        message: "角色只能选择一项!"
                    });
                    return;
                }
                if(seUserList.length==0){
                    this.$message({
                        showClose:true,
                        message: "请选择用户!"
                    });
                    return;
                }
                var roleId=seRoleList[0].Id;
                var userIdStr="";
                for (var i=0;i<seUserList.length;i++){
                    userIdStr+=seUserList[i].Id;
                    if(i<seUserList.length-1){
                        userIdStr+=",";
                    }
                }
                var params = new URLSearchParams();
                params.append('roleId', roleId);
                params.append('userIdStr', userIdStr);
                var vm=this;
                this.axios({
                    method: 'post',
                    url: 'http://localhost:25960/api/User/AssignRole',
                    data: params
                }).then(function (response) {

                    if(response.IsSucceed==true){
                       alert(response.Message);
                        vm.$message({
                            showClose:true,
                            message: response.Message
                        });

                    }else{
                        vm.$message({
                            showClose:true,
                            message: response.Message
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });

            },
            SelectionRole:function (selection, row) {
                if(selection.length>1){
                    this.$message({
                        showClose:true,
                        message: "角色只能选择一项！",
                    });
                    this.$refs.multipleTable.clearSelection();
                    this.$refs.tableUser.clearSelection();
                    return;
                }
                if(selection.length==1){
                    var vm=this;
                    this.axios({
                        method: 'get',
                        url: 'http://localhost:25960/api/User/GetUserUnRoleList',
                        params: {roleId:row.Id}
                    }).then(function (response) {

                        var data=response.Result;
                        var userData=vm.userList;
                        for (var i=0;i<data.length;i++)
                        {
                            for (var j=0;j<userData.length;j++)
                            {
                                if (data[i]==userData[j].Id){
                                    vm.$refs.tableUser.toggleRowSelection(userData[j],true);
                                }
                            }
                        }

                    }).catch(function (error) {
                        console.log(error);
                    });
                }
                if(selection.length==0){
                    this.$refs.tableUser.clearSelection();
                }
            },
            SelectionAll:function (selection) {
                this.$message({
                    showClose:true,
                    message: "角色只能选择一项,不能全选！",
                });
                this.$refs.multipleTable.clearSelection();
            }
        }
    }

</script>

<style>
    #userRoleMain div{
        float: left;
    }
</style>