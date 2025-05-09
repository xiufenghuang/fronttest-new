<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="归属设备类型" prop="deviceType">
				<ma-dict-select v-model="dataForm.deviceType" dict-type="device_type"></ma-dict-select>
			</el-form-item>
			<el-form-item label="模板名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="模板名称"></el-input>
			</el-form-item>
			<el-form-item label="模板类别" prop="type">
				<ma-dict-radio v-model="dataForm.type" dict-type="template_type"></ma-dict-radio>
			</el-form-item>
			<el-form-item label="模板参数">
				<el-button type="primary" @click="demoTemplateHandle()">设置模板</el-button>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>

	<DemoTemplate ref="demoTemplateRef" v-model:visible="demoTemplateVisible" />
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { ElMessage,ElRadio,ElRadioGroup } from 'element-plus/es'
import { useTemplateApi, useTemplateSubmitApi } from '@/api/egg/template'
import DemoTemplate from './demo-template.vue';

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const demoTemplateVisible = ref(false)
const demoTemplateRef = ref(null)
const templateType =ref(0)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	deviceType: '',
	options: {
		text: [

		],
		image: [

		],
		line: [

		]
	} as any,
	type:''
})

const init = (id?: number) => {
	if (id) {
		getTemplate(id)
	}
}

const getTemplate = (id: number) => {
	useTemplateApi(id).then(res => {
		Object.assign(dataForm, res.data)
		console.log(dataForm)
	})
}

const demoTemplateHandle = () => {
	if(!dataForm.type){
		return ElMessage.warning('请先选择模板类型')
	}
	demoTemplateVisible.value = true
	nextTick(() => {
		//新增的表单会话数据记忆
		if (!dataForm.id && dataForm.options.text.length == 0) {
			dataForm.options = demoTemplateRef.value.options
		}
		//修改的表单会话数据记忆
		if (dataForm.id && demoTemplateRef.value.options.text.length > 0) {
			dataForm.options = demoTemplateRef.value.options
		}
		demoTemplateRef.value.init(dataForm)
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}
		if(dataForm.type==='0'){
			dataForm.options = JSON.stringify(demoTemplateRef.value.options)

		}else{
			// dataForm.options 为 string 只有两种情况
			// 第一种新增的时候报模板名称重复 需要修改名称再次点击确定
			// 第二种修改的时候初始化信息 因为新增的时候真正后端存储的是json string 而不是JSON
			if (typeof dataForm.options != 'string' && dataForm.options.text.length == 0) {
				ElMessage.warning("模板参数不合法")
				return false
			}

			console.log('Template JSON', JSON.stringify(demoTemplateRef.value.options))

			if (demoTemplateRef.value.options.text.length > 0) {
				demoTemplateRef.value.options.name = dataForm.name
				dataForm.options = JSON.stringify(demoTemplateRef.value.options)
			} else {
				let options = JSON.parse(dataForm.options)
				options.name = dataForm.name
				dataForm.options = JSON.stringify(options)
			}
		}
		

		useTemplateSubmitApi(dataForm).then(() => {
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
