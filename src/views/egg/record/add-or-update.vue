<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
  <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
  <el-form-item label="设备sn" prop="sn">
      <el-input v-model="dataForm.sn" placeholder="设备sn"></el-input>
  </el-form-item>
  <el-form-item label="当前重量" prop="currentWeight">
      <el-input v-model="dataForm.currentWeight" placeholder="当前重量"></el-input>
  </el-form-item>
  <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
  </el-form-item>
  <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
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
import { useRecordApi, useRecordSubmitApi } from '@/api/egg/record'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	sn: '',
	currentWeight: '',
	createTime: '',
	updateTime: '',
	deleted: ''})

const init = (id?: number) => {
	if (id) {
		getRecord(id)
	}
}

const getRecord = (id: number) => {
	useRecordApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	currentWeight: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	createTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	updateTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}


		useRecordSubmitApi(dataForm).then(() => {
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
