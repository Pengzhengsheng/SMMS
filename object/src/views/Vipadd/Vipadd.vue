<template>
  <div class="vip-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加编辑账号</span>
      </div>
      <div class="text item">
        <el-form
          :model="vipForm"
          :rules="rules"
          ref="vipForm"
          label-width="100px"
          class="demo-vipForm"
          size="small"
          status-icon
        >
          <el-form-item label="真实名字" prop="name">
            <el-input v-model="vipForm.name"></el-input>
          </el-form-item>

          <el-form-item label="会员卡卡号" prop="vipcardid">
            <el-input v-model.number="vipForm.vipcardid"></el-input>
          </el-form-item>

          <el-form-item label="用户组" prop="usergroup">
            <el-select v-model="vipForm.usergroup" placeholder="请选择用户组">
              <el-option label="普通会员" value="普通会员"></el-option>
              <el-option label="至尊会员" value="至尊会员"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="身份证号" prop="idcard">
            <el-input v-model="vipForm.idcard"></el-input>
          </el-form-item>

          <el-form-item label="用户状态" prop="userstatus">
            <el-switch v-model="vipForm.userstatus"></el-switch>
          </el-form-item>

          <el-form-item label="手机号码" prop="tel">
            <el-input v-model.number="vipForm.tel"></el-input>
          </el-form-item>

          <el-form-item label="座机号码" prop="seatnum">
            <el-input v-model.number="vipForm.seatnum"></el-input>
          </el-form-item>

          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="vipForm.email"></el-input>
          </el-form-item>

          <el-form-item label="地区" prop="region">
            <el-input v-model="vipForm.region"></el-input>
          </el-form-item>

          <el-form-item label="详细地址" prop="adress">
            <el-input v-model="vipForm.adress"></el-input>
          </el-form-item>

          <el-form-item label="邮政编码" prop="postalcode">
            <el-input v-model.number="vipForm.postalcode"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('vipForm')">添加</el-button>
            <el-button @click="resetForm('vipForm')">重置</el-button>
          </el-form-item>
        </el-form>
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
      vipForm: {
        name: "",
        vipcardid: "",
        usergroup: "",
        idcard: "",
        userstatus: false,
        tel: "",
        seatnum: "",
        email: "",
        region: "",
        adress: "",
        postalcode: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入真实名字", trigger: "blur" },
          { min: 3, max: 8, message: '请输入 3 到 8 位字符', trigger: 'blur' }
        ],
        vipcardid: [
          { required: true, validator: validateVipCardId, trigger: 'blur' }
        ],
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change"}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 存取数据
          const params = {
            name: this.vipForm.name,
            vipcardid: this.vipForm.vipcardid,
            usergroup: this.vipForm.usergroup,
            idcard: this.vipForm.idcard,
            userstatus: this.vipForm.userstatus,
            tel: this.vipForm.tel,
            seatnum: this.vipForm.seatnum,
            email: this.vipForm.email,
            region: this.vipForm.region,
            adress: this.vipForm.adress,
            postalcode: this.vipForm.postalcode
          }
          this.req.post('/vip/vipadd', params)
          .then(res => {
            // 判断
            if(res.code === 0){
              // 成功
              this.$message.success(res.reason);
              // 跳转到会员管理页
              this.$router.push("/index/vipmanage");
            } else if (res.code === 1){
              // 失败
              this.$message.error(res.reason);
            }   
          })

        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
  @import './Vipadd.less';
</style>


