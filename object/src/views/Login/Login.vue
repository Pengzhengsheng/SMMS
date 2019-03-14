<template>
    <div class="login">
        <div class="loginwrapper">
            <!-- 标题 -->
            <h2 class="title">
                <span class="icon iconfont">&#xe60a;</span>
            欢迎登陆华联超市管理系统
            </h2>
           <!-- 登录表单 -->
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
            <!-- 账号 -->
            <el-form-item label="账号" prop="account">
            <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item label="确认密码" prop="checkpassword" @keyup.enter.native="submitenter">
            <el-input type="password" v-model="loginForm.checkpassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
        data() {
            // 自定义验证密码
            const passwordverification=(rule, value, callback)=>{
                if(value===''){
                    callback(new Error('请输入密码'));
                }else if(value.length<2 ||value.length>6){
                    callback(new Error('请输入2-6位的密码'));
                }else{//当确认密码不为空的时候，再进行一次一致性的验证
                if (this.loginForm.checkpassword !== ''){
                this.$refs.loginForm.validateField('checkpassword')
            }
            callback();
                }
            }
            // 自定义确认密码
            const confirmpassword=(rule, value, callback)=>{
                if(value===''){
                    callback(new Error('请确认密码'));
                }else if(value !== this.loginForm.password){
                    callback(new Error('两次输入的密码不一致'));
                }else{
                    callback();
                }
            }
          return{
            //整个表单的数据loginForm
            loginForm:{
                account:'',
                password:'',
                checkpassword:''
            },
        rules:{//自己定义的验证规则
            // 账号验证
            account:[
                {required:true,message:"请输入用户名",trigger:"blur"},
                {min:3,max:6,message:"请输入3-6位的用户名",trigger:"blur"}
            ],
            password:[
                // {required:true,message:"请输入密码",trigger:"blur"},
                {required:true,validator:passwordverification,trigger:"blur"}
            ],
            checkpassword:[
                {required:true,validator:confirmpassword,trigger:"blur"}
            ]
        }
        }
      },
    methods:{
        
        submitenter(){
             const params={
                account: this.loginForm.account,
                password: this.loginForm.password
            }
            // console.log(params);
            // 通过axios发送到后台
            this.req.get('/login/loginmain',params)
            .then(res=>{
                    // 接收后端的数据
                    let {code,reason,token}=res;
                    if(code===0){
                        // 把token存入浏览器
                        window.localStorage.setItem('token',token);
                        // 成功的返回
                        this.$message({
                            type:'success',
                            message:reason
                        })
                        // 跳到首页
                        this.$router.push('/index');
                    }else if(code===1){
                        this.$message.error(reason);
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
        },
      // 提交表单  
    submitForm(formName) {
        this.$refs[formName].validate((valid) => { //前端验证
          if (valid) {
            // 通过axios 发送给后端
            const params={
                account: this.loginForm.account,
                password: this.loginForm.password
            }
            // console.log(params);
            // 通过axios发送到后台
            this.req.get('/login/loginmain',params)
            .then(res=>{
                    // 接收后端的数据
                    let {code,reason,token}=res;
                    if(code===0){
                        // 把token存入浏览器
                        window.localStorage.setItem('token',token);
                        // 成功的返回
                        this.$message({
                            type:'success',
                            message:reason
                        })
                        // 跳到首页
                        this.$router.push('/index');
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
}
</script>
<style lang="less">
@import "./Login.less";
</style>


