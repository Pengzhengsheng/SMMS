<template>
    <div class="index">
        <el-container>
            <el-aside width="200px">
                <Leftnav></Leftnav>
            </el-aside>
            <el-container>
                <el-header>
                    <Rightheader ref="rightheader"></Rightheader>
                </el-header>
                <el-main>
                    <router-view @updateAvatar="updateAvatar"></router-view>
                </el-main>
                <el-footer>
                    <Rightfooter></Rightfooter>
                </el-footer>
            </el-container>
        </el-container> 
    </div>
</template>
<script>

// 引入左导航栏
import Leftnav from '@/components/Leftnav/Leftnav.vue';
// 引入右侧底部
import Rightfooter from '@/components/Rightfooter/Rightfooter.vue';
// 引入右侧头部
import Rightheader from '@/components/Rightheader/Rightheader.vue';

export default {
    components: {
        Leftnav,
        Rightfooter,
        Rightheader
    },
    methods: {
        updateAvatar () {
            this.$refs.rightheader.getName();
        }
    }
}
</script>
<style lang="less">
    @import './index.less';
</style>


