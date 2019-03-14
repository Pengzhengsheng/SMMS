<template>
    <div class="sales-statistics">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>销售统计</span>
            </div>

            <div class="text item">
                <div style="margin-bottom:10px;">
                    <el-date-picker
                        size="small"
                        v-model="date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button type="primary" @click="searchDate" size="mini" style="margin-left:8px;">查询</el-button>
                </div>
                <div style="height:500px;" id="myChart"></div>
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入时间格式moment
import moment from 'moment';

export default {
    data () {
        return {
            date: [] // 查询日期的值
        }
    },
    methods: {
        // 获取echarts表
        myECharts () {
            // 向后台请求所有数据
            this.req.post('/sales/salesechars')
            .then(res => {
                // 新建数组用来存放数据
                let ctimeArr = [];
                let dataArr = [];

                // 遍历返回来的数据，并存在新建数组里
                res.forEach(v => ctimeArr.push(moment(v.ctime).format('YYYY-MM-DD')));
                res.forEach(v => dataArr.push(v.sale));

                // 基于准备好的dom，初始化echarts实例
                var myChart = this.echarts.init(document.getElementById('myChart'));
                // 使用echarts实例对象，渲染
                myChart.setOption({
                    title: { text: '销售统计' },
                    tooltip: {},
                    xAxis: {
                        data: ctimeArr
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'line',
                        data: dataArr
                    }]
                });
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 选择日期查询
        searchDate () {
            // 新建一个数组用来存放
            let searchDateArr = [];

            // 把搜索到的值存放到数组萝莉
            this.date.forEach(v => searchDateArr.push(moment(v).format('YYYY-MM-DD')));

            let params = { searchDateArr };
            // 向后台请求数据
            this.req.get('/sales/searchDate', params)
            .then(res => {
                // 新建数组用来存放数据
                let searchctimeArr = [];
                let searchdataArr = [];

                // 遍历返回来的数据，并存在新建数组里
                res.forEach(v => searchctimeArr.push(moment(v.ctime).format('YYYY-MM-DD')));
                res.forEach(v => searchdataArr.push(v.sale));

                // 基于准备好的dom，初始化echarts实例
                var myChart = this.echarts.init(document.getElementById('myChart'));
                // 使用echarts实例对象，渲染
                myChart.setOption({
                    title: { text: '销售统计' },
                    tooltip: {},
                    xAxis: {
                        data: searchctimeArr
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'line',
                        data: searchdataArr
                    }]
                });
            })
            .catch(err => {
                console.log(err);
            })
        }
    },
    mounted () {
        // 调用获取后台数据的函数
        this.myECharts();
    }
}
</script>
<style lang="less">
    .sales-statistics {
        .el-card {
            text-align: left;
            .el-card__header {
                background-color: #f1f1f1;
                font-size: 20px;
            }
            .el-card__body {
                .el-input {
                    display: inline-block;
                    width: 160px;
                    margin-left: 20px; 
                }
            }
        }
    }
</style>


