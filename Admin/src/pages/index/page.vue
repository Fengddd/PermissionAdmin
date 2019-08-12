<template>
  <d2-container>
    <d2-page-cover
      title="My First Vue Project"
      sub-title=".Net Core 简单权限系统">
      <d2-icon-svg style="width: 120px;" name="d2admin"/>
      <div slot="footer" class="index-btn-group">
        <span @click="CeShiApi()">测试API</span> |
        <span @click="CeShiRefreshToken()">测试刷新Token</span> |
        <span @click="SilentCallback()">静默刷新Token</span> |
        <span @click="$open('https://github.com/d2-projects/d2-admin/issues/new')">提问</span>
      </div>
    </d2-page-cover>
  </d2-container>

</template>

<style lang="scss" scoped>
@import '~@/assets/style/public.scss';
.index-btn-group {
  color: $color-text-placehoder;
  span {
    color: $color-text-sub;
    &:hover {
      color: $color-text-main;
    }
  }
}
</style>
<script>
import Oidc from "oidc-client";
import util from '/src/libs/util.js'
// import axios from 'axios'
var config = {
  authority: "http://localhost:17491",
  client_id: "js",
  redirect_uri: "http://localhost:8080/#/IdentityServerCallBack",
  silent_redirect_uri:"http://localhost:8080/#/IdentityServerRefreshToken",
  response_type: "code",
  scope: "openid profile identityServerApi delimitClaim offline_access",
  post_logout_redirect_uri: "http://localhost:8080",
  automaticSilentRenew:true
};
var mgr = new Oidc.UserManager(config);
export default {
   data() {
    return {
          accessToken:'',
          refreshToken:''              
    }
  },
  mounted() {
    var that = this;
    mgr.getUser().then(function(user) {
      console.log(user);
      that.accessToken=user.access_token;
      that.refreshToken=user.refresh_token;
      util.cookies.set('accessToken', user.access_token)
      util.cookies.set('refreshToken', user.refresh_token)
      
    });
  },
  methods: {
    CeShiRefreshToken:function() {
      console.log("测试CeShiRefreshToken");
        var that=this;
     
         var url = "http://localhost:17491/connect/token";
     
         let param = new URLSearchParams();
         param.append("client_id", 'js');
         param.append("client_secret", '');
         param.append("grant_type", 'refresh_token');
         param.append("refresh_token", that.refreshToken);
                  that.$axios({
                      method: 'post',
                      url: url,
                      data: param,
                      params: param,
                      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}//设置header信息
                  }).then(function (response) {
                     console.log(response);
                        that.accessToken=response.access_token;
                        that.refreshToken=response.refresh_token;
                    
                  }).catch(function (error) {
                      console.log(error);
                  });

                                 
    
    },
    CeShiApi:function() {
      console.log("测试API");
      var that=this;
      mgr.getUser().then(function(user) {

          var params = {
          pagesize: 10,
          pageIndex: 1,
          searchName: '',
          searchPwd: ''
        };

        that.$axios({
          method: "post",
          url: "http://localhost:44375/api/User/GetUserList",
          data: params,
          headers: {'Authorization': 'Bearer ' + that.accessToken}//设置header信息
        }).then(function (response) {
                   console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });

                                 
      });
    },
    SilentCallback:function() {

      new Oidc.UserManager().signinSilentCallback().then(function () {
           console.log("我自己更新了");
             mgr.getUser().then(function(user) {
            console.log(user);

              });
        }).catch(function (e) {
           console.log(e);
        });
    }
  },
}
</script>
