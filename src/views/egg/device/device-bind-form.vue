<template>
    <el-dialog v-model="visible" title="设置绑定" :close-on-click-modal="false" draggable>
        <el-form ref="dataFormRef" :model="dataForm" :label-width="100">
            <el-form-item label="绑定类型" prop="bindOptionType">
                <ma-dict-select v-model="dataForm.bindOptionType" dict-type="device_bind_type"></ma-dict-select>
            </el-form-item>
            <el-form-item v-if="'1' == dataForm.bindOptionType" label="绑定店铺" prop="shopId">
                <ma-data-select :key="dataForm.shopId" v-model="dataForm.shopId" :url="`/egg/shop/list`"
                    :props="{ label: 'name', value: 'id' }" placeholder="店铺"></ma-data-select>
            </el-form-item>
            <el-form-item v-else-if="'3' == dataForm.bindOptionType" label="绑定模板" prop="templateId">
                <ma-data-select :key="dataForm.templateId" v-model="dataForm.templateId" :url="`/template/list`"
                    :props="{ label: 'name', value: 'id' }" placeholder="模板"></ma-data-select>
            </el-form-item>
            <el-form-item v-else label="绑定价签" prop="priceTagId">
                <ma-data-select :key="dataForm.priceTagId" v-model="dataForm.priceTagId" :url="`/price-tag/info/list`"
                    :props="{ label: 'name', value: 'id' }" placeholder="电子价签"></ma-data-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="submitHandle()">确定</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup name="bind-form">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus';
import { bindBatch } from '@/api/egg/device'

const emit = defineEmits(['refreshDataList'])

const props = defineProps({
    idList: {
        type: Array<any>,
        required: false,
        default: () => [], //1为绑定店铺 2为绑定价签
    },
})

const visible = defineModel<boolean>('visible')


const dataForm = reactive({
    bindOptionType: '1',
    shopId: '',
    priceTagId: '',
    templateId: '',
    idList: []
})


// 表单提交
const submitHandle = () => {
    if (props.idList && props.idList.length > 0) {
        let idList = props.idList.map(item => item.id)
        dataForm.idList = idList
        bindBatch(dataForm).then(() => {
            ElMessage.success({
                message: '批量绑定成功',
                duration: 500,
                onClose: () => {
                    visible.value = false
                    emit('refreshDataList')
                }
            })
        })
    }
}
</script>