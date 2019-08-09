<template >
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
                        <el-button type="primary" @click="ConfirmBtn()">确认分配</el-button>
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
                        ref="tableGroup"
                        :data="userGroupList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="SelectedGroup"
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
                userGroupList:[],
                roleList:[],
                SelectedGroupList:[],
                SelectedRoleList:[],
                total:0,
                pagesize:100,
                pageIndex:1,
                searchName:""

            }
        },
        created :function () { //生命周期的一部分，在实例化创建完成后，需要查询某一个方法 需要定义一个mounted 方法
            this.$nextTick(function () {
                this.UserGroupView();
                this.RoleView();
            })
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
            SearchUserGroup:function () {
                this.UserGroupView();
            },
            SelectedGroup:function (val) {
                this.SelectedGroupList=val;
            },
            SelectedRole:function (val) {
                this.SelectedRoleList=val;
            },
            ConfirmBtn:function () {
                var seRoleList=this.SelectedRoleList;
                var seUserGroupList=this.SelectedGroupList;
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
                if(seUserGroupList.length==0){
                    this.$message({
                        showClose:true,
                        message: "请选择用户组!"
                    });
                    return;
                }
                var roleId=seRoleList[0].Id;
                var userGroupIdStr="";
                for (var i=0;i<seUserGroupList.length;i++){
                    userGroupIdStr+=seUserGroupList[i].Id;
                    if(i<seUserGroupList.length-1){
                        userGroupIdStr+=",";
                    }
                }
                var params = new URLSearchParams();
                params.append('roleId', roleId);
                params.append('userGroupIdStr', userGroupIdStr);
                var vm=this;
                this.axios({
                    method: 'post',
                    url: 'http://localhost:25960/api/User/AssignGroupRole',
                    data: params
                }).then(function (response) {

                    if(response.IsSucceed==true){
                       // alert(response.Message);
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
                    this.$refs.tableGroup.clearSelection();
                    return;
                }
                if(selection.length==1){
                    var vm=this;
                    this.axios({
                        method: 'get',
                        url: 'http://localhost:25960/api/User/GetUserGroupUnRoleList',
                        params: {roleId:row.Id}
                    }).then(function (response) {

                        var data=response.Result;
                        var userGroupData=vm.userGroupList;
                        for (var i=0;i<data.length;i++)
                        {
                            for (var j=0;j<userGroupData.length;j++)
                            {
                                if (data[i]==userGroupData[j].Id){
                                    vm.$refs.tableGroup.toggleRowSelection(userGroupData[j],true);
                                }
                            }
                        }

                    }).catch(function (error) {
                        console.log(error);
                    });
                }
                if(selection.length==0){
                    this.$refs.tableGroup.clearSelection();
                }
            },
            SelectionAll:function (selection) {
                this.$message({
                    showClose:true,
                    message: "角色只能选择一项,不能全选！",
                });
                this.$refs.multipleTable.clearSelection();
            },
            DateFormat:function (row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD");
            }
        }
    }

</script>

<style>
    #userRoleMain div{
        float: left;
    }
</style>