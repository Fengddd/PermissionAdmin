<template></template>

<script>
import Oidc from "oidc-client";

var config = {
  authority: "http://localhost:17491",
  client_id: "js",
  redirect_uri: "http://localhost:8080/#/IdentityServerCallBack",
  silent_redirect_uri:"http://localhost:8080/#/IdentityServerRefreshToken",
  response_type: "code",
  scope: "openid profile identityServerApi delimitClaim offline_access",
  post_logout_redirect_uri: "http://localhost:8080/#/IdentityServerClient"
};
var mgr = new Oidc.UserManager(config);
export default {
 
  mounted() {   
    mgr.signinRedirect();
  }
};
</script>
