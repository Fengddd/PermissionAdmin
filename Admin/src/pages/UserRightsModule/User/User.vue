<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="名称">
          <el-input v-model="searchName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="searchPwd" placeholder="电话号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="SearchUser()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">
            <d2-icon name="refresh"/>重置
          </el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-button type="primary" size="mini" icon="el-icon-circle-plus">新增</el-button>

    <el-table ref="multipleTable" :data="userList" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="UserName" label="姓名" width="120"></el-table-column>

      <el-table-column prop="UserPassword" label="密码" show-overflow-tooltip></el-table-column>

      <el-table-column prop="UserPhone" label="电话" show-overflow-tooltip></el-table-column>

      <el-table-column prop="Address.AddressDetails" label="地址" show-overflow-tooltip></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            title="编辑"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="openEditUserForm(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            title="删除"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="del(scope.row.id)"
          ></el-button>
          <el-button
            type="warning"
            title="角色列表"
            size="mini"
            icon="el-icon-share"
            circle
            @click="UserRoleFrom(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <template slot="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next,jumper"
        :total="total"
      ></el-pagination>
    </template>
    <Add-Edit-User v-model="AddEditUserFormVisible"/>
    <User-Role :userArry="user" v-model="userRoleFormVisible"/>
  </d2-container>
</template>
  
<script>
import AddEditUser from "./AddEditUser";
import UserRole from "./userRole";
export default {
  components: {
    AddEditUser,
    UserRole
  },

  data() {
    return {
      userList: [],
      user: {},
      total: 0,
      pagesize: 5,
      pageIndex: 1,
      searchName: "",
      searchPwd: "",
      AddEditUserFormVisible: false,
      userRoleFormVisible: false
    };
  },
  mounted: function() {
    //生命周期的一部分，在实例化创建完成后，需要查询某一个方法 需要定义一个mounted 方法
    this.UserView();
  },
  methods: {
    UserView: function() {
      var params = {
        pagesize: this.pagesize,
        pageIndex: this.pageIndex,
        searchName: this.searchName,
        searchPwd: this.searchPwd
      };
      var vm = this;
      this.axios({
        method: "post",
        url: "http://localhost:44375/api/User/GetUserList",
        data: params
      })
        .then(function(response) {
          vm.userList = response.Result;
          vm.total = response.Total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleSizeChange: function(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.UserView();
    },
    handleCurrentChange: function(val) {
      console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.UserView();
    },
    SearchUser: function() {
      this.UserView();
    },
    openEditUserForm: function(user) {
      this.AddEditUserFormVisible = true;
    },
    UserRoleFrom: function(user) {
      this.user = user;
      this.userRoleFormVisible = true;
    }
  }
};
</script>


