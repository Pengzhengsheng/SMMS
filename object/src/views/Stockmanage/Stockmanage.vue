<template>
    <div class="stock-manage">
         <!-- 卡片的头部 -->
        <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>库存管理</span>
                </div>
                <!-- 卡片的内容 -->
                 <!-- 面板内容 -->
            <div class="text item">
                <!-- 面板的顶部 -->
                <div class="topmessage">
                     <el-form  size="small" :inline="true" :model="searchform" class="demo-form-inline">
                      
                        <el-form-item label="分类">
                            <el-select v-model="searchform.selectname" placeholder="请选择分类">
                                <el-option label="全部" value="全部"></el-option>
                                <el-option label="生活用品" value="生活用品"></el-option>
                                <el-option label="奢侈用品" value="奢侈用品"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="关键字">
                            <el-input v-model="searchform.keyword" placeholder="商品名称或条形码"></el-input>
                        </el-form-item>


                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
               <!-- 账号管理表格 -->
                <el-table
                        ref="tableData"
                        :data="tableData"
                        style="width: 100%"
                        max-height="250">

                        <el-table-column
                        fixed
                        prop="barCodeBtn"
                        label="商品条形码"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="商品名称"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="price"
                        label="进价"
                        >
                        </el-table-column>
                        <el-table-column
                        label="入库"
                        >
                        <template slot-scope="scope">{{scope.row.ctime|filterCtime}}</template>
                        </el-table-column>
                        <el-table-column
                        prop="sareHousing"
                        label="分类"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="bid"
                        label="已售"
                        >
                        </el-table-column>
                        <el-table-column
                        fixed="right"
                        label="管理"
                        >
                        <template slot-scope="scope">
                            <el-button
                            type="text"
                            size="small">
                            <i class="el-icon-edit"></i>
                            </el-button>
                            <el-button
                            @click.native.prevent="deleteRow(scope.$index, tableData)"
                            type="text"
                            size="small">
                            <i class="el-icon-error" style="margin-left:10px;"></i>
                            </el-button>
                        </template>
                        </el-table-column>
                    </el-table>
            </div>
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
        </el-card>
    </div>
</template>

<script>
// 引入日期格式化模块moment
import moment from "moment";
 export default {
    methods: {
        // 库存的查询函数
        search(){
            //获取查询的信息
            this.getdatabyPages();
            let params={
                selectname:this.searchform.selectname,
                keyword:this.searchform.keyword,
            }
            // console.log(params);
            // 发送请求给后端
            this.req.get('/stock/searchdata',params)
            .then(res=>{
                // 接收数据
                this.tableData=res;
            })
            .catch(err=>{
                console.log(err);
            })
        },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      getdatabyPages(){//按照分页请求来获取数据
    //   收集用户的需求，每页多少条数据，一页多少条数据
        let params = {
                selectname:this.searchform.selectname,
                keyword:this.searchform.keyword,
                pagesize: this.pagesize,
                currentpage: this.currentpage
            }
        // 发送请求给后端 把分页条件发送给后端
         this.req.get('/stock/getdatabyPages',params)
         .then(res=>{
            //  接收对应的数据
            let {total,data}=res;
            // 赋值给对应的变量
            this.total=total;
            this.tableData=data;
            // console.log(data);
            // 如果数据为空
            if (!data.length && this.currentpage !== 1) {
                this.currentpage -= 1;  // 当前页码自减1
                this.getdatabyPages(); // 再次请求数据
            }
         })
         .catch(err=>{
             console.log(err);
         })
      },
       // 每页条数变化触发
        handleSizeChange(val) {
            this.pagesize = val; // 每页多少条
            this.getdatabyPages(); // 调用分页函数
        },
        // 当前页码变化触发
        handleCurrentChange(val) {
           this.currentpage = val; // 当前页
           this.getdatabyPages(); // 调用分页函数
        }
    },
    data() {
      return{
          searchform:{
              selectname:'',
              keyword:''
          },//
          tableData: [],//表格数据
         total: 0, // 数据总条数
         currentpage: 1, // 当前页 
         pagesize: 5 // 每页显示的数据
      }
    },
    //生命周期函数
    created () {
    // // 调用请求所有数据函数
    // this.getAccountList()
    this.getdatabyPages();
    },
    // 过滤器
    filters: {
    filterCtime (ctime) {
        return moment(ctime).format('YY/MM/DD hh:mm')
    }
    }
  }
  
</script>

<style lang="less">
    @import './Stockmanage.less';
</style>
