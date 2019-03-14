<template>
    <div class="goods-manage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品管理</span>
            </div>
            <div class="text item">

                <el-select v-model="cateName" size="small" placeholder="------------选择分类------------">
                    <el-option label="全部" value="全部"></el-option>
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

                <!-- 搜索 -->
                关键字&nbsp;:&nbsp;<el-input size="small" placeholder="请输入商品名称或条形码" v-model="searchValue" clearable></el-input>
                &nbsp;&nbsp;<el-button type="primary" @click="search" size="mini">查询</el-button>
                
                <div class="border"></div>

                <!-- 商品列表 -->
                <el-table :data="tableData" ref="tableData" @selection-change="handleSelectionChange" style="width: 100%">
                    <el-table-column type="selection" width="55"></el-table-column>

                    <el-table-column label="商品条形码" width="130">
                        <template slot-scope="scope">
                            <span>{{ scope.row.barcode }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="商品名称" width="130">
                        <template slot-scope="scope">
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="所属分类" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.classification }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="售价(元)" width="100">
                        <template slot-scope="scope">
                            <span style="color:red;">{{ scope.row.price }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="促销价(元)" width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.promotion }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="市场价(元)" width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.marketprice }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="库存" width="100">
                        <template slot-scope="scope">
                            <span style="color:red;">{{ scope.row.number }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="库存总额(元)" width="120">
                        <template slot-scope="scope">
                            <span style="color:red;">{{ scope.row.stockall }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="销售总额(元)" width="120">
                        <template slot-scope="scope">
                            <span style="color:red;">{{ scope.row.saleall }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="管理" width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary">编辑</el-button>
                            <el-button size="mini" @click="handleDelete( scope.row.id )" type="danger">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <!-- 分页和批量删除 -->
                <el-row :gutter="20" class="foot">
                    <el-col :span="7">
                        <div class="batchDelBtn">
                            <el-button type="danger" size="small" @click="batchDel">批量删除</el-button>
                            <el-button type="primary" size="small" @click="toggleSelection">取消选择</el-button>
                        </div>
                    </el-col>
                    <el-col :span="17">
                        <div class="page">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[3, 5, 10, 20]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>

            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
      return {
        cateName: '', // 顶部选择分类查找的值
        searchValue: '', // 顶部搜索框的值
        options: [ // 顶部选择分类的选项
            { name: '海飞丝', value: '海飞丝' },
            { name: '清扬', value: '清扬' },
            { name: '乐事', value: '乐事' },
            { name: '可口可乐', value: '可口可乐' },
            { name: '百事', value: '百事' }
        ],
        tableData: [], // 列表数据
        currentPage: 1, // 默认当前页
        pageSize: 3, // 默认每页显示的数据条数
        total: 0, // 数据总条数
        selectionId: [], // 存储选中的id
      }
    },
    methods: {
        // 查询数据
        search () {
            // 调取分页显示数据函数
            this.getListByPage();
        },

        // 获取分页显示数据和查询数据
        getListByPage () {
            // 保存数据
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                cateName: this.cateName,
                searchValue: this.searchValue
            };

            this.req.post('/goods/goodslistandsearch', params)
            .then(res => {
                if (!res.data.length && this.currentPage !== 1) {
                    this.currentPage -= -1;
                    this.getListByPage();
                }
                // 渲染数据
                this.tableData = res.data;
                // 渲染总数据条数
                this.total = res.total;
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 批量删除
        batchDel () {
            // 判断用户选没选中
            if (!this.selectionId.length) {
                this.$message.error('请选择需要删除的数据');
                return;
            }

            this.$confirm('是否删除这些数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                // 发送请求
                this.req.get('/goods/goodsbatchdel', { id: this.selectionId })
                .then(res => {
                    if (res.code === 0) {
                        // 成功
                        this.$message.success(res.reason);
                        // 刷新列表
                        this.getListByPage();
                    } else if (res.code === 1) {
                        // 失败
                        this.$message.error(res.reason);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },

        // 取消选择
        toggleSelection () {
            this.$refs.tableData.clearSelection();
        },

        // 每页显示多少条数据
        handleSizeChange (val) {
            this.pageSize = val;
            this.getListByPage();
        },

        // 当前页数
        handleCurrentChange (val) {
            this.currentPage = val;
            this.getListByPage();
        },

        // 获取选中的id
        handleSelectionChange (val) {
            // 保存id
            this.selectionId = val.map(v => v.id);
        },

        // 删除数据
        handleDelete (id) {
            this.$confirm('是否确定删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.req.get('/goods/goodsdel', { id })
                    .then(res => {
                        if(res.code === 0){
                            // 成功
                            this.$message.success(res.reason);
                            // 刷新页面
                            this.getListByPage();
                        } else if (res.code === 1) {
                            // 失败
                            this.$message.error(res.reason);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            
        }
    },
    // 生命周期钩子函数
    created () {
        // 调用获取分页显示数据函数
        this.getListByPage();
    }
}
</script>
<style lang="less">
@import './Goodsmanage.less';
</style>


