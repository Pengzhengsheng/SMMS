<template>
    <div class="account-manage">
        <!-- 账号添加的组件 -->
        <!-- 卡片的头部 -->
        <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>账号管理</span>
                </div>
                <!-- 卡片的内容 -->
                 <!-- 面板内容 -->
            <div class="text item">
               <!-- 账号管理表格 -->
                <el-table
                    ref="accountdata"
                    :data="accountdata"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="checkinput"
                >
                <!-- 选择框 -->
                <el-table-column
                    type="selection"
                    width="55"
                >
                </el-table-column>

                <!-- 账号 -->
                <el-table-column
                    prop="account"
                    label="账号"
                    width="200px"
                >
                </el-table-column>

                <!-- 用户组 -->
                <el-table-column
                    prop="usergroup"
                    label="用户组"
                    >
                </el-table-column>


                <el-table-column
                    label="日期"
                    >
                        <template slot-scope="scope">{{ scope.row.ctime|filterCtime }}</template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="handleEdit( scope.row.id )" round>
                                <i class="el-icon-edit" ></i> 编辑
                            </el-button>

                            <el-button size="mini" type="danger" @click="handleDelete( scope.row.id )" round>
                                <i class="el-icon-delete"></i>  删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-col :span="10">
                    <!-- 批量删除的按钮 -->
                <div style="margin-top: 20px;">
                    <el-button @click="batchdel" type='danger' size="small">批量删除</el-button>
                    <el-button @click="cancelSelect" type='info' size="small">取消选择</el-button>
                </div> 
                </el-col>
                <el-col :span="14">
                    <!-- 分页 -->
                <div style="margin-top: 20px;">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentpage"
                        :page-sizes="[1,5,10,20,30]"
                        :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
                </el-col>
               
                    <!-- 弹出的修改框-->
                <el-dialog width="400px" title="账号修改" :visible.sync="dialogFormVisible">
                    <!-- 表格 -->
                    <el-form :model="accountEditForm" style="width: 320px;">
                        <!-- 账号 -->
                        <el-form-item label="账号" :label-width="formLabelWidth">
                            <el-input v-model="accountEditForm.account" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 用户组 -->
                        <el-form-item label="用户组" :label-width="formLabelWidth">
                            <el-select v-model="accountEditForm.usergroup" placeholder="请选择用户组">
                                <el-option label="普通用户" value="普通用户"></el-option>
                                <el-option label="超级管理员" value="超级管理员"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <!-- 尾部 -->
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入日期格式化模块moment
import moment from "moment";
export default {
  data() {
    return {
      // 账号列表数据
      accountdata: [],
      dialogFormVisible: false, // 控制模态框显示和隐藏
      accountEditForm:{
        // 修改表单的数据
        account: "",
        usergroup: ""
      },
      formLabelWidth: "120px", // 标签宽度
      editId: 0, // 需要修改的数据的id
      selectId: [] ,//批量删除的id
      total: 0, // 数据总条数
      currentpage: 1, // 当前页 
      pagesize: 5 // 每页显示的数据
    };
  },
  methods: {
    // 当批量删除时判断前面的选择框,获取对应的id
    checkinput(val) {
        // console.log(val);
        // val就是选中的数据 把选中数据的id取出来 放在一个数组中
        this.selectId = val.map(v => v.id);
    },
    // 批量删除
    batchdel() {
      // 如果用户不选 弹出提示 直接return
      if (!this.selectId.length) {
        this.$message.error("傻逼ba,没勾你删啥子哦！！");
        return;
      }
      this.$confirm("是否批量删除?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
       .then(() => { // 确定
                    // 发送请求 把选中的数据id发送给后端
                    this.req.get('/account/batchdel', { idArr:this.selectId})
                        .then(res => {
                            // 接收数据
                            let { code, reason } = res;
                            // 判断
                            if (code === 0) {
                                // 弹成功提示
                                this.$message({
                                    type: 'success',
                                    message: reason
                                })
                                // 刷列表
                                this.getdatabyPage();

                            } else if (code === 1) {
                                // 弹失败提示
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(() => { // 取消
                    this.$message({
                        type: 'info',
                        message: '已取消批量删除'
                    })       
                })
    },
    // 取消选择
    cancelSelect() {
      // 表格调用这个方法进行取消选择
      this.$refs.accountdata.clearSelection();
    },
    // 由于设置了分页，所以请求页面数据的时候需要按照分页的情况来请求数据
    getdatabyPage () {
            // 收集用户选择的页码以及每页显示多少条
            let params = {
                pagesize: this.pagesize,
                currentpage: this.currentpage
            }
            // 发送请求给后端 把分页条件发送给后端
            this.req.get('/account/getdatabyPage', params)
                .then(res => {
                    // 接收数据
                    let { total, data } = res;
                    // 赋值给对应变量
                    this.total = total;
                    this.accountdata = data;

                    // 如果数据为空
                    if (!data.length && this.currentpage !== 1) {
                        this.currentpage -= 1;  // 当前页码自减1
                        this.getdatabyPage(); // 再次请求数据
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        },
         // 每页条数变化触发
        handleSizeChange(val) {
            this.pagesize = val; // 每页多少条
            this.getdatabyPage(); // 调用分页函数
        },
        // 当前页码变化触发
        handleCurrentChange(val) {
           this.currentpage = val; // 当前页
           this.getdatabyPage(); // 调用分页函数
        },
    // // 请求所有账号数据
    // getAccountList() {
    //   this.req
    //     .get("/account/accountlist")
    //     .then(res => {
    //       // 赋值给accountTableData 渲染表格
    //       this.accountdata = res;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // 删除函数
    handleDelete(id) {
      // tishi
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定
          // 发送删除请求给后端
          this.req
            .get("/account/accountdel", { id })
            .then(res => {
              console.log(res);
              // 接收后端返回的数据
              let { code, reason } = res;
              // 判断
              if (code === 0) {
                // 弹出成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表数据
                this.getdatabyPage();
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改数据
    handleEdit(id) {
      // 显示模态框
      this.dialogFormVisible = true;

      // 保留要修改这一条数据的id
      this.editId = id;

      // 发送请求 把id发送给后端
      this.req
        .get("/account/accountedit", { id })
        .then(res => {
          console.log(res);
          // 接收后端数据
          let { account, usergroup } = res;
          // 回填表单
          this.accountEditForm.account = account;
          this.accountEditForm.usergroup = usergroup;
          this.getdatabyPage();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存修改
    saveEdit() {
      // 关闭模态框
      this.dialogFormVisible = false;
      // 收集修改后的新数据和原来的id
      let params = {
        account: this.accountEditForm.account,
        usergroup: this.accountEditForm.usergroup,
        id: this.editId
      };

      // 把新数据和老id一起发送给后端
      this.req
        .post("/account/accounteditsave", params)
        .then(res => {
          // 接收后端数据
          let { code, reason } = res;
          // 判断
          if (code === 0) {
            // 弹成功提示
            this.$message({
              type: "success",
              message: reason
            });
            // 刷列表
            this.getdatabyPage();
          } else if (code === 1) {
            // 弹失败提示
            this.$message.error(reason);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
// 生命周期钩子函数
created () {
    // // 调用请求所有数据函数
    // this.getAccountList()
    this.getdatabyPage();
},
// 过滤器
filters: {
    filterCtime (ctime) {
        return moment(ctime).format('YYYY/MM/DD hh:mm:ss')
    }
}
};
</script>

<style lang="less">
@import "./Accountmanage.less";
</style>


