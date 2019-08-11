<template>
  </template>

<script>
import Oidc from "oidc-client";
  new Oidc.UserManager({ response_mode: "query" }).signinRedirectCallback().then(function () {
             window.location = "/#/index";
        }).catch(function (e) {
              
        });
  export default{

  }
</script>