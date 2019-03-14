<template>
    <div class="system-info">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>系统信息</span>
            </div>

            <div class="text item">
                <el-alert class="goods" title="商品总数 : 5 。已经销售的总金额 : 890.00。库存商品总价 : 1235.82" type="warning" show-icon></el-alert>  
                <el-alert class="data" title="导入数据" type="warning" show-icon :closable="false"></el-alert>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>销售排行</span>
                            </div>

                            <div class="text item">
                                <el-table :data="rankingData" stripe style="width: 100%">
                                    <el-table-column prop="goodsname" label="商品名称"> </el-table-column>
                                    <el-table-column prop="sales" label="销量" width="180"></el-table-column>
                                </el-table>
                            </div>
                        </el-card>      
                    </el-col>
                    <el-col :span="12">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>缺货的商品</span>
                            </div>

                            <div class="text item">
                                <el-table :data="oosData" stripe style="width: 100%">
                                    <el-table-column prop="goodsname" label="商品名称"> </el-table-column>
                                    <el-table-column prop="stock" label="库存" width="180"></el-table-column>
                                    <el-table-column label="操作" width="120">
                                        <template>
                                            <el-button @click="jump" type="text" size="small">入库</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>  
                
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            rankingData: [
                { goodsname: '海飞丝去屑洗发水', sales: 8 },
                { goodsname: '茅台酒', sales: 6 },
                { goodsname: '龙凤呈祥', sales: 5 },
                { goodsname: '龙凤呈祥2', sales: 2 }
            ],
            oosData: [
                { goodsname: '我的优乐美', stock: 0 }
            ]
        }
    },
    methods: {
        jump () {
            this.$router.push('/index/addStock');
        }
    }
}
</script>
<style lang="less">
@import './Systeminfo.less';
</style>


