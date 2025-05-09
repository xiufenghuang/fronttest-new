<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item prop="orgId" label="机构">
				<ma-org-select v-model="dataForm.orgId" placeholder="请选择"></ma-org-select>
			</el-form-item>
			<el-form-item prop="leaderId" label="店铺负责人">
				<ma-user-input v-model="dataForm.leaderId" placeholder="机构负责人"></ma-user-input>
			</el-form-item>
			<el-form-item label="店铺名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="店铺名称"></el-input>
			</el-form-item>
			<el-form-item label="店铺地址" prop="address">
				<el-input v-model="dataForm.address" placeholder="店铺地址"></el-input>
			</el-form-item>
			<el-form-item label="店铺图片">
				<ma-upload-images v-model:fileList="dataForm.imageFileList" :limit="1" :drag="false">
					<template #empty>
						<el-icon>
							<Shop />
						</el-icon>
						<span>请上传店铺图片</span>
					</template>
				</ma-upload-images>
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
import { useShopApi, useShopSubmitApi } from '@/api/egg/shop'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	orgId: '',
	leaderId: '',
	name: '',
	address: '',
	imageFileList: [],
	creator: '',
	createTime: '',
	updater: '',
	updateTime: '',
	deleted: ''
})

const init = (id?: number) => {
	if (id) {
		getShop(id)
	}
}

const getShop = (id: number) => {
	useShopApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	address: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {

	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		dataForm.imageFileList = dataForm.imageFileList
			.filter(file => file.status == "success")
			.map((file) => ({ name: file.name, url: file.url }))

		useShopSubmitApi(dataForm).then(() => {
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
