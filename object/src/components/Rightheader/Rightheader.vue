<template>
    <div class="right-header">
        <el-row :gutter="20" class="topBorder">
            <el-col :span="18">
                <h2 class="title">欢迎使用华联超市管理系统</h2>
            </el-col>
            <el-col :span="6">
                <el-row>
                    <el-col :span="6">
                        <div class="headPortrait" @click="uploadAvatar">
                            <img :src="imgUrl" alt="">
                        </div>
                    </el-col>
                    <el-col :span="18">
                        <div class="user">
                            <el-dropdown @command="handleCommand" :hide-on-click="false">
                                <span class="el-dropdown-link">
                                    {{ name }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="person">个人中心</el-dropdown-item>
                                    <el-dropdown-item command="exit">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            name: '',
            imgUrl: ''
        }
    },
    methods: {
        handleCommand (command) {
            if (command === 'exit') {
                // 清除token
                window.localStorage.removeItem('token');

                // 弹出提示
                this.$message.success('退出成功，欢迎回来');
                
                // 延迟跳转
                setTimeout(() => {
                    // 跳转到登录页
                    this.$router.push('/login');
                }, 1000);
            } else if (command === 'person') {
                // 跳转到个人中心
                this.$router.push('/index/personal');
            }
        },

        // 点击头像跳转到个人中心
        uploadAvatar () {
            this.$router.push('/index/personal');
        },

        // 获取用户登录的名字和头像
        getName () {
            this.req.get('/account/getNameAndAvatar')
            .then(res => {
                this.name = res.name;
                this.imgUrl = `http://127.0.0.1:888/${res.avatar}`;
            })
            .catch(err => {
                console.log(err);
            })
        }
    },
    // 生命周期钩子函数（创建dom后执行）
    created () {
        // 调取获得用户名的函数
        this.getName();
    }
}
</script>

<style lang="less">
    .right-header {
        .topBorder {
            border-bottom: 1px solid #ddd;
        }
        .title {
            font-size: 20px;
            font-weight: normal;
            color: #666;
        }
        .headPortrait {
            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
            }
        }
        .user {
            .el-dropdown-link {
                cursor: pointer;
                color: #409EFF;
            }
            .el-icon-arrow-down {
                font-size: 12px;
            }
        }
        .headPortrait {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: red;
            margin-top: 5px;
        }
    }
</style>

