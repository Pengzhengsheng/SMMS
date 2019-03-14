<template>
    <div class="left-nav">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router>
            <el-submenu :index="(index+1)+''" v-for="(menu, index) in subMenuData" :key="index">
                <template slot="title">
                    <span class="icon iconfont" v-html="menu.icon"></span>
                    <span>{{ menu.title }}</span>
                </template>
                <el-menu-item :index="submenu.path" v-for="(submenu, index) in menu.children" :key="index">{{ submenu.title }}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
export default {
    data () {
        return {
            subMenuData: [
                {
                    title: '系统管理',
                    icon: '&#59445',
                    roots:['superaccount','ordinary'],
                    children: [
                        { title: '系统信息', path: '/index' },
                        { title: '个人中心', path: '/index/personal' }
                    ]
                },
                {
                    title: '账号管理',
                    icon: '&#59163',
                    roots:['superaccount'],
                    children: [
                        { title: '添加账号', path: '/index/accountadd' },
                        { title: '账号管理', path: '/index/accountmanage' },
                        { title: '密码修改', path: '/index/passwordmodify' }
                    ]
                },
                {
                    title: '会员管理',
                    icon: '&#59163',
                    roots:['superaccount','ordinary'],
                    children: [
                        { title: '账号管理', path: '/index/vipmanage' },
                        { title: '添加账号', path: '/index/vipadd' }
                    ]
                },
                {
                    title: '商品管理',
                    icon: '&#58973',
                    roots:['superaccount','ordinary'],
                    children: [
                        { title: '商品管理', path: '/index/goodsmanage' },
                        { title: '添加商品', path: '/index/goodsadd' }
                    ]
                },
                {
                    title: '进货管理',
                    icon: '&#58973',
                    roots:['superaccount','ordinary'],
                    children: [
                        { title: '库存管理', path: '/index/stockmanage' },
                        { title: '添加库存', path: '/index/addStock' }
                    ]
                },
                {
                    title: '统计管理',
                    icon: '&#59455',
                    roots:['superaccount'],
                    children: [
                        { title: '销售统计', path: '/index/salesstatistics' },
                        { title: '进货统计', path: '/index/stockstatistics' }
                    ]
                }
            ]
        }
    },
     created () {
        // 获取当前登录用户的用户分组
        this.req.get('/login/getroot')
            .then(res => {
                let { roots } = res;
                // console.log(roots)
                // 定义一个身份数组
                let rootmenu = [];
                // 遍历菜单
                this.subMenuData.forEach(item => {
                    // 循环角色数组
                   roots.forEach(i => {//如果后台返回的数据包含应该有的，就把页面给他看
                        if (item.roots.includes(i)) { 
                            rootmenu.push(item)
                        }
                    })
                })
                
                // 把权限菜单赋值给 menuData
                this.subMenuData = rootmenu;
            })
            .catch(err => {
                    console.log(err);
            })
    }
}
</script>

<style lang="less">
    @import './leftnav.less';
</style>
