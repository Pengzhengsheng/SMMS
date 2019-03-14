<template>
    <div class="account-add">
        <!-- 账号添加的组件 -->
        <!-- 卡片的头部 -->
        <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>添加管理员账号</span>
                </div>
                <!-- 卡片的内容 -->
                <div class="text item">
                    <!-- 登录表单 -->
                        <el-form 
                        :model="accountForm" 
                        status-icon 
                        :rules="rules" 
                        ref="accountForm" 
                        label-width="100px"
                        class="demo-ruleForm"
                        size="small"
                       style="width:400px;"
                         >
                        <!-- 账号 -->
                        <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accountForm.account" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="accountForm.password" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 确认密码 -->
                        <el-form-item label="确认密码" prop="checkpassword">
                        <el-input type="password" v-model="accountForm.checkpassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 选择用户分组 -->
                        <el-form-item label="选择用户组" prop="usergroup">
                        <el-select v-model="accountForm.usergroup" placeholder="请选择用户分组">
                        <el-option label="普通用户" value="普通用户"></el-option>
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        </el-select>
                        </el-form-item>

                        <el-form-item>
                        <el-button type="primary" @click="submitForm('accountForm')">添加</el-button>
                        <el-button @click="resetForm('accountForm')">重置</el-button>
                        </el-form-item>
                        </el-form>
                </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
          // 自定义验证密码
            const passwordverification=(rule, value, callback)=>{
                if(value===''){
                    callback(new Error('请输入密码'));
                }else if(value.length<2 ||value.length>6){
                    callback(new Error('请输入2-6位的密码'));
                }else{//当确认密码不为空的时候，再进行一次一致性的验证
                if (this.accountForm.checkpassword !== ''){
                this.$refs.accountForm.validateField('checkpassword')
            }
            callback();
                }
            }
             // 自定义确认密码
            const confirmpassword=(rule, value, callback)=>{
                if(value===''){
                    callback(new Error('请确认密码'));
                }else if(value !== this.accountForm.password){
                    callback(new Error('两次输入的密码不一致'));
                }else{
                    callback();
                }
            }
        return{
            // 添加账号的表单数据
            accountForm:{
                    account:'',
                    password:'',
                    checkpassword:'',
                    usergroup:''
            },
            rules:{
                // 账号验证
                     account:[
                         {required:true,message:"请输入账号",trigger:"blur"},
                         {min:3,max:6,message:"请输入3-6位的账号",trigger:"blur"}
                     ],
                //  密码验证
                    password:[
                        {required:true,validator:passwordverification,trigger:"blur"}
                    ],
                // 确认密码验证
                    checkpassword:[
                        {required:true,validator:confirmpassword,trigger:"blur"}
                    ],
                // 选择用户分组验证
                    usergroup:[
                        {required:true,message:"请选择用户的分组",trigger:"change"}
                    ]
            }
        }
    },
     methods: {
      // 提交表单  
      submitForm(formName) {
        this.$refs[formName].validate((valid) => { // 所有前端验证通过valid就是true 否则就是false
          if (valid) {
            // alert('所有前端验证通过！允许提交!');

            // 收集账号和密码
            const params = {
                account: this.accountForm.account,
                password: this.accountForm.password,
                usergroup:this.accountForm.usergroup
            }
            // console.log('账号和密码以及分组:', params)
            // 通过axios 发送给后端
                this.req.post('./account/accountadd',params)
                .then(res=>{
                    // 接收后端的数据
                    let {code,reason}=res;
                    if(code===0){
                        // 成功的返回
                        this.$message({
                            type:'success',
                            message:reason
                        })
                        // 跳到账号管理列表
                        this.$router.push('/index/accountmanage');
                    }else if(code===1){
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
      // 重置表单   
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
};
</script>
<style lang="less">
    @import './Accountadd.less';
</style>


