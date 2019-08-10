<template>
   <div>
     静默更新Token的页面
   </div>
  </template>

<script>
import Oidc from "oidc-client";


  export default{

    mounted(){
         new Oidc.UserManager().signinSilentCallback().then(function () {
           console.log("我自己更新了");
               window.location = "www.baidu.com";
        }).catch(function (e) {
           console.log(e);
        });
    }
  }
</script>