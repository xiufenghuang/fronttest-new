<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
  <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
  <el-form-item label="店铺id" prop="shopId">
      <el-input v-model="dataForm.shopId" placeholder="店铺id"></el-input>
  </el-form-item>
  <el-form-item label="店铺设备重量" prop="weight">
      <el-input v-model="dataForm.weight" placeholder="店铺设备重量"></el-input>
  </el-form-item>
  <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
  </el-form-item>
  <el-form-item label="修改时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
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
import { useShopweightApi, useShopweightSubmitApi } from '@/api/egg/shopweight'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	shopId: '',
	weight: '',
	createTime: '',
	updater: '',
	updateTime: '',
	deleted: ''})

const init = (id?: number) => {
	if (id) {
		getShopweight(id)
	}
}

const getShopweight = (id: number) => {
	useShopweightApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	shopId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	weight: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	createTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	updateTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}


		useShopweightSubmitApi(dataForm).then(() => {
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
