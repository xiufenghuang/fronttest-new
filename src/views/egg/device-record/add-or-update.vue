<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="设备SN编号" prop="sn">
				<el-input v-model="dataForm.sn" placeholder="设备SN编号"></el-input>
			</el-form-item>
			<el-form-item label="售卖重量" prop="soldWeight">
				<el-input v-model="dataForm.soldWeight" placeholder="售卖重量"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useDeviceRecordApi, useDeviceRecordSubmitApi } from '@/api/egg/device-record'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	sn: '',
	soldWeight: '',
	createTime: '',
	deleted: ''
})

const init = (id?: number) => {
	if (id) {
		getDeviceRecord(id)
	}
}

const getDeviceRecord = (id: number) => {
	useDeviceRecordApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	soldWeight: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		useDeviceRecordSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
