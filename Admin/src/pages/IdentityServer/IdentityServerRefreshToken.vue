<template>
   <div>
     静默更新Token的页面
   </div>
  </template>

<script>
import Oidc from "oidc-client";
  
new Oidc.UserManager().signinSilentCallback();
  export default{
      
  }
</script>