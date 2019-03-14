<template>
    <div class="add-stock">
       <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>商品入库</span>
                </div>
                <!-- 卡片的内容 -->
                 <!-- 密码修改内容 -->
            <div class="text item">
                    <!-- 修改密码的表单 -->
                    <el-form 
                        :model="insertStock" 
                        status-icon 
                        :rules="rules" 
                        ref="insertStock" 
                        label-width="100px"
                        class="demo-ruleForm"
                        size="small"
                       style="width:410px;"
                         >
                        <!-- 商品条形码-->
                        <el-form-item label="商品条形码" prop="barcode">
                        <el-input type="text" v-model="insertStock.barcode" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 商品的数量 -->
                        <el-form-item label="商品的数量" prop="num">
                        <el-input type="text" v-model.number="insertStock.num" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 商品的进价 -->
                        <el-form-item label="商品的进价" prop="purchaseprice">
                        <el-input type="text" v-model="insertStock.purchaseprice" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                        <el-button type="success" style="margin-left:250px;" @click="getproduct('insertStock')">入库</el-button>
                        </el-form-item>
                        </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
      data(){
        //   自定义商品数量的验证
        const isnum=(rule, value, callback)=>{
            if(value===''){
                callback(new Error("请输入商品数量"));
            }else if((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) == false){
                callback(new Error('请输入数字大于0的数量'));
            }else{
                callback();
            }
        }
        const pricecheck=(rule,value,callback)=>{
            if(value===''){
                callback(new Error("请输入商品进价"));
            }else if((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) == false){
                callback(new Error("商品数量应该为一个数值"))
            }else{
                callback();
            }
        }
        return{
            // 入库的数据
            insertStock:{
                    barcode:'',
                    num:'',
                    purchaseprice:''
            },
            rules:{
                // 原密码
                    //  oldpassword:[
                    //      {required:true,message:"请输入原密码",trigger:"blur"},
                    //      {min:3,max:6,message:"请输入3-6位的密码",trigger:"blur"}
                    //  ]
                    // 商品条形码的验证
                    barcode:[
                        {required:true,message:"请输入商品的条形码",trigger:"blur"},
                        {min:3,max:10,message:"条形码在3-10位之间",trigger:"blur"}
                    ],
                    // 商品数量的验证
                    num:[
                        {required:true,validator:isnum,trigger:"blur"}
                    ],
                    //商品进价的验证
                    purchaseprice:[
                        {required:true,validator:pricecheck,trigger:"blur"}
                    ]
            }
        }
    },
     methods: {
      // 提交表单  
      getproduct(formName) {
        this.$refs[formName].validate((valid) => { // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
            // 手机商品名and数量和进价
            const params = {
              barcode:this.insertStock.barcode,
              num:this.insertStock.num,
              purchaseprice:this.insertStock.purchaseprice
            }
            // console.log('账号和密码以及分组:', params)
            // 提交表单 post
            this.req.post('/stock/insertlibrary',params)
            .then(res=>{
                let{code,reason}=res;
                if(code===0){//成功的返回
                    this.$message({
                        message:reason,
                        type:"success"
                        })
                        // 跳转到库存管理页面
                    this.$router.push('/index/Stockmanage');
                }else if(code===0){
                    this.$message.error(reason);
                }
            })
            .catch(err=>{
                console.log(err);
            })
        } else {
            console.log('前端验证失败！不允许提交!');
            return false;
          }
        });
      },
    }
}

</script>

<style lang="less">
        .add-stock{
              text-align:left;
            .box-card{
                .el-card__header{
                    font-size: 20px;
                    background: #f1f1f1;
                }
            .demo-ruleForm{
                border:1px solid #ccc;
                border-radius: 10px;
                .el-form-item__content{
                    margin-top:20px;
                }
                .el-form-item__label{
                     margin-top:20px;
                }
            }
            }
        }
</style>
