<template>
  <div class="goods-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加商品</span>
      </div>
      <div class="text item">
        <el-form
          :model="goodsForm"
          :rules="rules"
          ref="goodsForm"
          label-width="100px"
          class="demo-goodsForm"
          size="small"
          status-icon
          :label-position="labelPosition"
        >
          <el-form-item label="所属分类" prop="classification">
            <el-select v-model="goodsForm.classification" placeholder="---------选择分类---------">
              <el-option v-for="item in options" :label="item.name" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="barCode" label="商品条形码" prop="barcode">
            <el-input v-model="goodsForm.barcode"></el-input>
            <el-button size="mini" @click="barCodeBtn(10000, 99999)" class="barCodeBtn" type="primary">生成条形码</el-button>
          </el-form-item>

          <el-form-item label="商品名称" prop="name">
            <el-input v-model="goodsForm.name"></el-input>
          </el-form-item>

          <el-form-item label="商品售价(元)" prop="price">
            <el-input @blur="autoPrice" v-model.number="goodsForm.price"></el-input>
          </el-form-item>

          <el-form-item label="市场价(元)" prop="marketprice">
            <el-input v-model.number="goodsForm.marketprice"></el-input>
            默认市场价为售价的1.2倍

          </el-form-item>

          <el-form-item label="商品进价(元)" prop="bid">
            <el-input v-model.number="goodsForm.bid"></el-input>
          </el-form-item>

          <el-form-item label="入库数量" prop="number">
            <el-input v-model.number="goodsForm.number"></el-input>
            记重商品单位为千克
          </el-form-item>

          <el-form-item label="商品重量" prop="weight">
            <el-input v-model.number="goodsForm.weight"></el-input>
          </el-form-item>

          <el-form-item label="商品单位" prop="company">
            <el-input v-model="goodsForm.company"></el-input>
          </el-form-item>

          <el-form-item label="会员优惠" prop="discount">
            <el-switch v-model="goodsForm.discount"></el-switch>
          </el-form-item>

          <el-form-item label="是否促销" prop="ispromotion">
            <el-switch v-model="goodsForm.ispromotion"></el-switch>
          </el-form-item>

          <el-form-item label="商品简介" prop="introduce">
            <el-input type="textarea" v-model="goodsForm.introduce"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('goodsForm')">添加</el-button>
            <el-button @click="resetForm('goodsForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: 'top',
      options: [
        { name: '海飞丝', value: '海飞丝' },
        { name: '清扬', value: '清扬' },
        { name: '乐事', value: '乐事' },
        { name: '可口可乐', value: '可口可乐' },
        { name: '百事', value: '百事' }
      ],
      goodsForm: {
        classification: '',
        barcode: '',
        name: '',
        price: '',
        marketprice: '',
        bid: '',
        number: '',
        weight: '',
        company: '',
        discount: false,
        ispromotion: false,
        introduce: ''
      },
      rules: {
        classification: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        barcode: [
          { required: true, message: '请获取条形码', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品售价', trigger: 'blur' },
          { type: 'number', message: '请输入纯数字', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 获取数据
          let params = {
            classification: this.goodsForm.classification,
            barcode: this.goodsForm.barcode,
            name: this.goodsForm.name, 
            price: this.goodsForm.price, 
            marketprice: this.goodsForm.marketprice, 
            bid: this.goodsForm.bid, 
            number: this.goodsForm.number, 
            weight: this.goodsForm.weight, 
            company: this.goodsForm.company, 
            discount: this.goodsForm.discount, 
            ispromotion: this.goodsForm.ispromotion, 
            introduce: this.goodsForm.introduce
          };

          this.req.post('/goods/addgoods', params)
          .then(res => {
            if (res.code === 0) {
              // 成功
              this.$message.success(res.reason);
            } else if (res.code === 1) {
              // 失败
              this.$message.error(res.reason);
            }
          })
          .catch(err => {
            console.log(err)
          })
          // 跳转到会员管理页
          this.$router.push("/index/goodsmanage");
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    barCodeBtn(min, max) {
      this.goodsForm.barcode = Math.floor(Math.random() * (max - min + 1) + min);
    },
    // 默认自动填写市场价
    autoPrice () {
      this.goodsForm.marketprice = this.goodsForm.price * 1.2;
    }
  }
};
</script>
<style lang="less">
    @import "./Goodsadd.less";
</style>


