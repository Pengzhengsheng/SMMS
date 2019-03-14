<template>
    <div class="password-modify">
          <div class="account-manage">
        <!-- 账号添加的组件 -->
        <!-- 卡片的头部 -->
        <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>修改账号密码</span>
                </div>
                <!-- 卡片的内容 -->
                 <!-- 密码修改内容 -->
            <div class="text item">
                    <!-- 修改密码的表单 -->
                    <el-form 
                        :model="updateForm" 
                        status-icon 
                        :rules="rules" 
                        ref="updateForm" 
                        label-width="100px"
                        class="demo-ruleForm"
                        size="small"
                       style="width:400px;"
                         >
                        <!-- 原密码-->
                        <el-form-item label="原密码" prop="oldpassword">
                        <el-input type="text" v-model="updateForm.oldpassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 新密码 -->
                        <el-form-item label="新密码" prop="newpassword">
                        <el-input type="text" v-model="updateForm.newpassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 确认密码 -->
                        <el-form-item label="确认新密码" prop="newcheckpassword">
                        <el-input type="text" v-model="updateForm.newcheckpassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                        <el-button type="primary" @click="submitForm('updateForm')">修改密码</el-button>
                        </el-form-item>
                        </el-form>
            </div>
        </el-card>
    </div>
    </div>
</template>
<script>
export default {
    data(){
            const oldpassword=(rule,value,callback)=>{
            //判断原密码与填入的密码是否一致
            this.req.get('/account/oldpassword',{oldpassword:value})
            .then(res=>{
                let {code,reason}=res;
                if(code===1){
                    callback(new Error(reason));
                }else if(code===0){
                    callback();
                }
            })
            .catch(err=>{
                console.log(err);
            })
            }
          // 自定义验证密码
            const  Verifypassword=(rule, value, callback)=>{
                if(value===''){
                    callback(new Error('请输入密码'));
                }else if(value===this.updateForm.oldpassword){
                    callback(new Error('新密码不能与原密码相同'));
                }else if(value.length<2 ||value.length>6){
                    callback(new Error('请输入2-6位的密码'));
                }else{//当确认密码不为空的时候，再进行一次一致性的验证
                if (this.updateForm.newcheckpassword !== ''){
                this.$refs.updateForm.validateField('newcheckpassword');
            }
            callback();
                }
            }
             // 自定义确认密码
            const confirmpassword=(rule, value, callback)=>{
                if(value===''){
                    callback(new Error('请确认密码'));
                }else if(value !== this.updateForm.newpassword){
                    callback(new Error('两次输入的密码不一致'));
                }else{
                    callback();
                }
            }
        return{
            // 添加账号的表单数据
            updateForm:{
                    oldpassword:'',
                    newpassword:'',
                    newcheckpassword:''
            },
            rules:{
                // 原密码
                     oldpassword:[
                         {required:true,validator:oldpassword,trigger:"blur"}
                     ],
                //  密码验证
                    newpassword:[
                        {required:true,validator:Verifypassword,trigger:"blur"}
                    ],
                // 确认密码验证
                    newcheckpassword:[
                        {required:true,validator:confirmpassword,trigger:"blur"}
                    ]
            }
        }
    },
     methods: {
      // 提交表单  
      submitForm(formName) {
        this.$refs[formName].validate((valid) => { // 所有前端验证通过valid就是true 否则就是false
          if (valid) {
            // 收集密码
            const params = {newpassword: this.updateForm.newpassword }
            // 通过axios 发送给后端
            this.req.post('/account/updatepwd',params)
            .then(res=>{
                console.log(res)
                let {code,reason}=res;
                if(code===0){
                    this.$message({
                        type:'success',
                        message:reason
                    })
                // 清除token
                window.localStorage.removeItem('token');
                this.$router.push('/login');
                }else if(code===1){
                    this.$message.error(reason);
                }
                })
            .catch(err=>{

            })
          } else {
            // console.log('前端验证失败！不允许提交!');
            return false;
          }
        });
      }
    }
};
</script>
<style lang="less">
    @import './Passwordmodify.less';
</style>


