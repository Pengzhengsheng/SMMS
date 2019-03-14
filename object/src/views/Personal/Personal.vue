<template>
    <div class="upload-avatar">
        <el-upload
            class="avatar-uploader"
            action="null"
            :http-request="uploadavatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
    </div>
</template>

<script>
// 引入axios
import axios from 'axios';

export default {
    data() {
        return {
            imgUrl: ""
        };
    },
    methods: {
        // 上传成功回显图片
        handleAvatarSuccess(res, file) {
            this.imgUrl = URL.createObjectURL(file.raw);
        },
        // 上传图片限制
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }

            return isLt2M;
        },
        // 覆盖默认上传行为，自定义上传
        uploadavatar (file) {
            // 创建实例对象用于上传（浏览器自带）
            let fd = new FormData();

            // 把上传的图片数据放到fd对象中，当成上传参数
            fd.append('file', file.file);

            // // 获取token
            const token = window.localStorage.getItem('token');

            // 发送axios请求（上传只能用post请求）
            axios.post('/account/uploadavatar', fd, {headers: {'Content-Type': 'multipart/form-data', 'authorization': `Bearer ${token}`}})
            .then(res => {
                if (res.data.code === 0) {
                    this.$message.success(res.data.reason);
                    // 回显图片
                    this.imgUrl = `http://127.0.0.1:888${res.data.imgUrl}`;

                    this.$emit('updateAvatar');
                } else if (res.data.code === 1) {
                    this.$message.error(res.data.reason);
                }
            })
            .catch(err => {
                console.log(err);
            })

        }
    }
};
</script>

<style lang="less">
.upload-avatar {
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>


