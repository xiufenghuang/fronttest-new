<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
  <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
  <el-form-item label="文件类型" prop="fileType">
        <ma-dict-select v-model="dataForm.fileType" dict-type="file_bin_type" placeholder="文件类型"></ma-dict-select>
  </el-form-item>
  <el-form-item label="文件版本" prop="fileVersion">
      <el-input v-model="dataForm.fileVersion" placeholder="文件版本"></el-input>
  </el-form-item>
  <el-form-item label="文件URL" prop="fileUrl">
	<!-- <el-form-item label="文件URL"> -->
      <!-- <el-input v-model="dataForm.fileUrl" placeholder="文件URL"></el-input> -->
	  <ma-upload-file :fileType="['application/octet-stream']" v-model:modelValueFileUrl="dataForm.fileUrl" v-model:modelValueFileSize="dataForm.fileSize"></ma-upload-file>
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
import { useBinApi, useBinSubmitApi } from '@/api/egg/bin'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	fileUrl: '',
	fileSize: '',
	fileType: '',
	fileVersion: '',
	version: '',
	creator: '',
	createTime: '',
	updater: '',
	updateTime: '',
	deleted: ''})

const init = (id?: number) => {
	if (id) {
		getBin(id)
	}
}

const getBin = (id: number) => {
	useBinApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	fileUrl: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	fileType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	fileVersion: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		// console.log('获取当前fileUrl',dataForm.fileUrl);

		useBinSubmitApi(dataForm).then(() => {
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
