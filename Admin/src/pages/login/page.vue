<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <!-- logo部分 -->
      <div class="logo-group">
        <img src="./image/logo.png" alt="logo">
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin">
            <el-form-item  prop="username">
              <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                <i slot="prepend" class="fa fa-user-circle-o"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formLogin.password" placeholder="密码">
                <i slot="prepend" class="fa fa-keyboard-o"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input type="text" v-model="formLogin.code" placeholder="- - - -">
                <template slot="prepend">验证码</template>
                <template slot="append">
                  <img class="login-code" src="./image/login-code.png">
                </template>
              </el-input>
            </el-form-item>
            <el-button @click="submit" type="primary" class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div>
      <!-- 快速登陆按钮 -->
      <el-button type="info" class="button-help" @click="dialogVisible = true">
        快速选择用户（测试功能）
      </el-button>
    </div>
    <el-dialog
      title="快速选择用户"
      :visible.sync="dialogVisible"
      width="400px">
      <el-row :gutter="10" style="margin: -20px 0px -10px 0px;">
        <el-col v-for="(user, index) in users" :key="index" :span="8">
          <div class="user-btn" @click="handleUserBtnClick(user)">
            <d2-icon name="user-circle-o"/>
            <span>{{user.name}}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
require('particles.js')
import config from './config/default'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      // 快速选择用户
      dialogVisible: false,
      users: [
        {
          name: '管理员',
          username: 'admin',
          password: 'admin'
        },
        {
          name: '编辑',
          username: 'editor',
          password: 'editor'
        },
        {
          name: '用户1',
          username: 'user1',
          password: 'user1'
        }
      ],
      // 表单
      formLogin: {
        username: '小丹',
        password: '123456',
        code: 'v9am'
      },
      // 校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 初始化例子插件
    particlesJS('login', config)
  },
  methods: {
      ...mapActions([
          'd2adminLogin'
      ]),
    /**
     * @description 接收选择一个用户快速登陆的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },

    // 提交登陆信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
            // 登陆
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.d2adminLogin({
            vm: this,
            username: this.formLogin.username,
            password: this.formLogin.password
          })
//            var vm=this;
//            var params=vm.formLogin;
//            console.log(params);
//            this.axios({
//                method: 'post',
//                url: 'http://localhost:25960/api/Token/GetSignatureToken',
//                data:params
//            }).then(function (response) {
//                if(response.IsSucceed==true){
//                    var storage = window.localStorage;
//                    storage["Token"] = response.Result;
//                    var token = storage.Token;
//
//                    vm.$message({
//                        showClose:true,
//                        message: response.Message
//                    });
//                    util.cookies.set('uuid', "ddddd")
//                    util.cookies.set('token', response.Result)
//                    // 跳转路由
//                    vm.$router.push({
//                        name: '/index'
//                    })
////                     window.location.href="/pages/index";
//                    return;
//                }else{
//                    vm.$message({
//                        showClose:true,
//                        message: response.Message
//                    });
//                }
//            }).catch(function (error) {
//                vm.$message(error);
//            });
        } else {
          // 登陆表单校验失败
          this.$message.error('表单校验失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './style.scss';
</style>
