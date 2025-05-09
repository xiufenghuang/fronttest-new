<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="120">
			<el-form-item label="电子价签名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="电子价签名称"></el-input>
			</el-form-item>
			<el-form-item label="价钱图片">
				<ma-upload-images v-model:fileList="dataForm.imageFileList" :fileType="['image/jpg', 'image/jpeg']"
					:limit="1" :drag="false">
					<template #empty>
						<el-icon>
							<PriceTag />
						</el-icon>
						<span>请上传价签图片</span>
						<span style="font-weight: bold;font-size: 14px;">仅支持JPG</span>
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
import { ElMessage, ElNotification } from 'element-plus/es'
import { usePriceTagInfoApi, usePriceTagInfoSubmitApi } from '@/api/egg/price-tag-info'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	imageUrl: '',
	imageFileList: [],
	createTime: '',
	updater: '',
	updateTime: '',
	deleted: ''
})

const init = (id?: number) => {
	if (id) {
		getPriceTagInfo(id)
	}
}

const getPriceTagInfo = (id: number) => {
	usePriceTagInfoApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})



// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		if (dataForm.imageFileList.length == 0) {
			ElNotification({
				title: '温馨提示',
				message: '请先上传电子价签图片',
				type: 'warning'
			})
			return false
		}

		dataForm.imageFileList = dataForm.imageFileList
			.filter(file => file.status == "success")
			.map((file) => ({ name: file.name, url: file.url }))


		usePriceTagInfoSubmitApi(dataForm).then(() => {
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
