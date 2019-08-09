<template>
    <el-container style="margin-left: -20px;margin-top: 10px;">
        <el-header>

            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
                <el-radio-button label="top">top</el-radio-button>
                <el-radio-button label="right">right</el-radio-button>
                <el-radio-button label="bottom">bottom</el-radio-button>
                <el-radio-button label="left">left</el-radio-button>
            </el-radio-group>

        </el-header>

        <el-main style="margin-top: -20px;" id="tabUser">
            <el-tabs :tab-position="tabPosition">

                <el-tab-pane id="userTab" label="分配用户组">
                   <div>
                       <el-AssignUserGroup></el-AssignUserGroup>
                   </div>

                </el-tab-pane>
                <el-tab-pane label="分配角色" >
                    <div>
                        <el-AssignRole></el-AssignRole>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="分配用户组角色">
                    <div>
                        <el-AssignGroupRole></el-AssignGroupRole>
                    </div>
                </el-tab-pane>

            </el-tabs>
        </el-main>

    </el-container>
</template>
<script>
    import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
    import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
    import AssignUserGroup from "../../../src/pages/User/AssignUserGroup.vue";
    import AssignRole from '../../../src/pages/User/AssignRole.vue';
    import AssignGroupRole from '../../../src/pages/User/AssignGroupRole.vue';
    export default {
        components: {
            ElMain,
            ElHeader,
            "el-AssignUserGroup":AssignUserGroup,
            "el-AssignRole":AssignRole,
            "el-AssignGroupRole":AssignGroupRole
        },
        data() {
            return {
                tabPosition: 'top'
            };
        }
    };
</script>

<style>

</style>