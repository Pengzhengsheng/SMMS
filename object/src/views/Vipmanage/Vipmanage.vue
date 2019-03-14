<template>
  <div class="vip-manage">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>会员管理</span>
        </div>

        <div class="text item">

            <!-- 搜索 -->
            搜索&nbsp;:&nbsp;<el-input size="small" placeholder="请输入内容" v-model="searchValue" clearable></el-input>&nbsp;会员卡，会员名，电话，手机
            <el-button type="primary" size="mini">查询</el-button>
            
            <div class="border"></div>

            <!-- 会员列表 -->
            <el-table ref="tableData" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column label="会员卡卡号" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.vipcardid }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="会员姓名" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="会员等级" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.usergroup }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="会员积分" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.vipintegral }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="折扣" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.discount }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="手机号" width="140">
                    <template slot-scope="scope">
                        <span>{{ scope.row.tel }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="座机号" width="140">
                    <template slot-scope="scope">
                        <span>{{ scope.row.seatnum }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="管理" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit( scope.row.id )" type="primary">编辑</el-button>
                        <el-button size="mini" @click="handleDelete( scope.row.id )" type="danger">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <el-dialog title="修改账号" :visible.sync="dialogFormVisible">
                <el-form :model="updateForm" ref="updateForm" :rules="rules">

                    <el-form-item label="会员卡卡号" :label-width="formLabelWidth" prop="vipcardid">
                        <el-input v-model.number="updateForm.vipcardid" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="会员姓名" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="updateForm.name" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="会员等级" :label-width="formLabelWidth" prop="usergroup">
                        <el-select v-model="updateForm.usergroup" placeholder="请选择会员等级">
                            <el-option label="普通会员" value="普通会员"></el-option>
                            <el-option label="至尊会员" value="至尊会员"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- <el-form-item label="会员积分" :label-width="formLabelWidth">
                        <el-input v-model.number="updateForm.vipintegral" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="折扣" :label-width="formLabelWidth">
                        <el-input v-model="updateForm.discount" autocomplete="off"></el-input>
                    </el-form-item> -->

                    <el-form-item label="手机号" :label-width="formLabelWidth" prop="tel">
                        <el-input v-model.number="updateForm.tel" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="座机号" :label-width="formLabelWidth" prop="seatnum">
                        <el-input v-model.number="updateForm.seatnum" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('updateForm')">确 定</el-button>
                </div>
            </el-dialog>

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
        //  验证会员卡卡号
        const validateVipCardId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入会员卡卡号'));
            } else if (value.length < 3 || value.length > 8) {
                callback(new Error('请输入 3 到 8 位数字'));
            } else if ( value !== '' && (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) === false) {
                // 验证只能输入纯数字
                callback(new Error('请输入纯数字'));
            } else {
                callback();
            }
        }
      return {
        searchValue: '',   // 搜索框的值
        tableData: [],   // 表格数据
        dialogFormVisible: false,   // 默认不显示修改框，true为显示
        updateForm: {},   // 修改数据表单
        formLabelWidth: '120px',   // 修改数据表单宽度
        saveid: 0,   // 保存id
        currentPage: 1, // 当前页
        total: 0, // 一共多少条数据
        pageSize: 3,
        selectionId: [],
        rules: {   // 修改数据表单验证
        	vipcardid: [
                { required: true, validator: validateVipCardId, trigger: 'blur' }
        	],
        	name: [
                { required: true, message: '请输入会员姓名', trigger: 'blur' },
                { min: 3, max: 8, message: '请输入 3 到 8 位字符', trigger: 'blur' }
        	],
        	usergroup: [
        		{ required: true, message: '请选择会员等级', trigger: 'change' }
        	]
        }
      }
    },
    methods: {
        // 删除数据
        handleDelete (id) {
            this.$confirm('是否确定删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.req.get('/vip/vipdel', { id })
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
            
        },

        // 修改数据
        handleEdit (id) {
            // 显示修改框
            this.dialogFormVisible = true;
            
            // 保存id
            this.saveid = id;

            //把id传给后端
            this.req.get('/vip/vipupdate', { id })
            .then(res => {
                // 回填表单
                this.updateForm = res;
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 保存数据
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 隐藏修改框
                    this.dialogFormVisible = false;
                    // 保存数据
                    let params = {
                        vipcardid: this.updateForm.vipcardid,
                        name: this.updateForm.name,
                        usergroup: this.updateForm.usergroup,
                        tel: this.updateForm.tel,
                        seatnum: this.updateForm.seatnum,
                        id : this.saveid
                    }
                    // 把数据传给后台
                    this.req.post('/vip/vipsave', params)
                    .then(res => {
                        // 判断
                        if (res.code === 0) {
                            // 成功
                            this.$message.success(res.reason);
                            // 再获取一次数据
                            //调用请求所有账号数据函数
                            this.getListByPage();
                        } else if (res.code === 1) {
                            // 失败
                            this.$message.error(res.reason);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                } else {
                    return false;
                }
            });
        },

        // 取消选择
        toggleSelection() {
            this.$refs.tableData.clearSelection();
        },

        // 获取选取的id
        handleSelectionChange (val) {
            this.selectionId = val.map(v => v.id);
        },

        // 批量删除
        batchDel() {
            // 当用户没有选择的时候
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
                // 向后端请求数据
                this.req.get('/vip/vipBatchDel', { idArr: this.selectionId })
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

        // 获取分页显示数据
        getListByPage () {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize
            }
            // 想后端请求分页数据
            this.req.post('/vip/getlistbypage', params)
            .then(res => {
                if (!res.data.length && this.currentPage !== 1) {
                    this.currentPage -= 1;
                    // 再次调用分页显示数据
                    this.getListByPage();
                }
                // 渲染数据总数
                this.total = res.total;
                // 渲染表格
                this.tableData = res.data;
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 每页显示多少条数据
        handleSizeChange(val) {
            this.pageSize = val;
            this.getListByPage();
        },

        // 当前页数
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getListByPage();
        },
        
    },
    // 生命周期钩子函数
    created () {
        // 调用请求所有账号数据函数
        // this.getVipList();

        // 调用分页显示账号数据函数
        this.getListByPage();

    }
};
</script>
<style lang="less">
    @import "./Vipmanage.less";
</style>


