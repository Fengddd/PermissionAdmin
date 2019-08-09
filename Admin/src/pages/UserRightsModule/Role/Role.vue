<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="角色名称">
          <el-input v-model="searchRoleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="SearchRole()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ShowAddOrEditRole('add')">添加</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table ref="multipleTable" :data="roleList" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="RoleName" label="角色名称" width="120"></el-table-column>

      <el-table-column prop="RoleType" label="角色类型" show-overflow-tooltip></el-table-column>

      <el-table-column prop="RoleDescription" label="角色描述" show-overflow-tooltip></el-table-column>

      <el-table-column prop="CreateUserName" label="创建人" show-overflow-tooltip></el-table-column>

      <el-table-column
        prop="CreatDateTime"
        label="创建时间"
        :formatter="DateFormat"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="ShowAddOrEditRole(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="DelRole(scope.row)">删除</el-button>
          <el-button size="mini" @click="AssignRoleMenu(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="角色信息" :visible.sync="dialogFormVisible">
      <el-radio-group v-model="labelPosition" size="small">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
        <el-radio-button label="top">顶部对齐</el-radio-button>
      </el-radio-group>
      <div style="margin: 20px;"></div>

      <el-form :model="userRole" :label-position="labelPosition">
        <el-form-item label="角色名称">
          <el-input v-model="userRole.roleName" style="width: 600px;"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="userRole" :label-position="labelPosition">
        <el-form-item label="角色类型">
          <el-input v-model="userRole.roleType" style="width: 600px;"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="userRole" :label-position="labelPosition">
        <el-form-item label="角色描述">
          <el-input v-model="userRole.roleDescription" style="width: 600px;"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddOrEditRole()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="菜单信息" :visible.sync="dialogRoleMenu">
      <el-tree
        :data="data2"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddOrEditRole()">确 定</el-button>
      </div>
    </el-dialog>

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
  </d2-container>
</template>

<script>
import moment from "moment";
export default {
  components: {

  },
  data() {
    return {
      roleList: [],
      total: 0,
      pagesize: 5,
      pageIndex: 1,
      addOrEdit: "",
      searchRoleName: "",
      dialogFormVisible: false,
      dialogRoleMenu: false,
      labelPosition: "right",
      userRole: {
        roleName: "",
        roleType: "",
        roleDescription: "",
        roleId: ""
      },
      data2: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted: function() {
    //生命周期的一部分，在实例化创建完成后，需要查询某一个方法 需要定义一个mounted 方法
    this.RoleView();
  },
  methods: {
    RoleView: function() {
      var vm = this;
      var params = {
        pagesize: vm.pagesize,
        pageIndex: vm.pageIndex,
        searchRoleName: vm.searchRoleName
      };
      console.log(params);
      this.axios({
        method: "post",
        url: "http://localhost:44375/api/User/GetRoleList",
        data: params
      })
        .then(function(response) {
          vm.roleList = response.Result;
          vm.total = response.Total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleSizeChange: function(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.RoleView();
    },
    handleCurrentChange: function(val) {
      console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.RoleView();
    },
    SearchRole: function() {
      this.RoleView();
    },
    DateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    ShowAddOrEditRole: function(data) {
      var vm = this;
      vm.userRole.roleName = "";
      vm.userRole.roleType = "";
      vm.userRole.roleDescription = "";
      if (data == "add") {
        vm.addOrEdit = data;
      } else {
        vm.addOrEdit = data.Id;
        this.axios({
          method: "get",
          url: "http://localhost:25960/api/User/GetRole",
          params: { roleId: vm.addOrEdit }
        })
          .then(function(response) {
            if (response.IsSucceed == true) {
              vm.userRole.roleName = response.Result.RoleName;
              vm.userRole.roleType = response.Result.RoleType;
              vm.userRole.roleDescription = response.Result.RoleDescription;
              return;
            } else {
              vm.$message({
                showClose: true,
                message: response.Message
              });
            }
          })
          .catch(function(error) {
            vm.$message(error);
          });
      }
      vm.dialogFormVisible = true;
    },
    AddOrEditRole: function() {
      var addOrEdit = this.addOrEdit;
      var vm = this;
      console.log(vm.userRole);
      if (addOrEdit == "add") {
        this.axios({
          method: "post",
          url: "http://localhost:25960/api/User/AddRole",
          data: vm.userRole
        })
          .then(function(response) {
            if (response.IsSucceed == true) {
              vm.userRole.roleName = "";
              vm.userRole.roleType = "";
              vm.userRole.roleDescription = "";
              vm.dialogFormVisible = false;
              vm.RoleView();
              return;
            } else {
              vm.$message(response.Message);
            }
          })
          .catch(function(error) {
            vm.$message(error);
          });
      } else {
        var roleId = addOrEdit;
        vm.userRole.roleId = roleId;
        var params = vm.userRole;
        this.axios({
          method: "post",
          url: "http://localhost:25960/api/User/EditRole",
          data: params
        })
          .then(function(response) {
            if (response.IsSucceed == true) {
              vm.userRole.roleName = "";
              vm.userRole.roleType = "";
              vm.userRole.roleDescription = "";
              vm.dialogFormVisible = false;
              vm.RoleView();
              return;
            } else {
              vm.$message(response.Message);
            }
          })
          .catch(function(error) {
            vm.$message(error);
          });
      }
    },
    DelRole: function(role) {
      var vm = this;
      var roleId = role.Id;
      this.axios({
        method: "delete",
        url: "http://localhost:25960/api/User/DelRole",
        params: { roleId: roleId }
      })
        .then(function(response) {
          if (response.IsSucceed == true) {
            vm.$message({
              showClose: true,
              message: response.Message
            });
            vm.RoleView();
            return;
          } else {
            vm.$message({
              showClose: true,
              message: response.Message
            });
          }
        })
        .catch(function(error) {
          vm.$message(error);
        });
    },
    AssignRoleMenu: function(value) {
      this.dialogRoleMenu = true;
    }
  }
};
</script>


