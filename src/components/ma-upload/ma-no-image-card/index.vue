<template>
    <el-card class="no-image-card">
        <i class="el-icon-picture-outline"></i>
        <p class="no-image-text">暂无图片</p>
    </el-card>
</template>
<script setup lang="ts" name="MaNoImageCard">
let temp = 1; //占位 标签内若没有任何语句 则组件名称不会被识别
</script>
<style scoped>
.no-image-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background-color: #f9fafc;
    border: 1px dashed #dcdfe6;
    user-select: none;
}

.no-image-text {
    margin-left: 8px;
    font-size: 25px;
    color: #606266;
}

.el-icon-picture-outline {
    font-size: 48px;
    color: #bfbfbf;
}
</style>