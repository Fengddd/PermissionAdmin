<template>
  <el-dialog :visible.sync="dialogVisible">
    <div slot="title">维护
      <el-tag>{{userArry.UserName}}</el-tag>角色
    </div>
    <el-form :inline="true" ref="searchForm" size="mini" style="margin-bottom: -18px;">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchRoleName" placeholder="角色名称" style="width: 100px;"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="SearchRole">
          <d2-icon name="search"/>查询
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button>
          <d2-icon name="refresh"/>重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="roleList"
      v-loading="loading"
      size="small"
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="RoleName" label="角色名称" width="120"></el-table-column>

      <el-table-column prop="RoleType" label="角色类型" show-overflow-tooltip></el-table-column>

      <el-table-column prop="RoleDescription" label="角色描述" show-overflow-tooltip></el-table-column>

      <el-table-column label="状态" prop="isAdd">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isAdd==2" size="mini" type="info">未添加</el-tag>
          <el-tag v-if="scope.row.isAdd==1" size="mini" type="success">已添加</el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isAdd==2"
            type="primary"
            title="添加"
            size="mini"
            icon="el-icon-plus"
            circle
            @click="modifyRoleUser(scope.row.id,1)"
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
  </el-dialog>
</template>
<script>
export default {
  name: "userRole",
  props: {
    userArry: Object,
    value: Boolean,
    required: true
  },
  data() {
    return {
      roleList: [],
      total: 0,
      pagesize: 5,
      pageIndex: 1,
      searchRoleName: "",
      dialogVisible: false,
      loading: false,
      tableData: []
    };
  },
  created: function() {
    this.RoleView();
  },
  beforeCreate: function() {
    console.log(this.userArry);
  },
  created: function() {
    console.log(this.userArry);
  },
  beforeMount: function() {
    console.log(this.userArry);
  },
  mounted: function() {
    console.log(this.userArry);
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    RoleView: function() {
      console.log(this.userArry);
      var vm = this;
      var params = {
        pagesize: vm.pagesize,
        pageIndex: vm.pageIndex,
        searchRoleName: vm.searchRoleName
      };
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
    }
  }
};
</script>

