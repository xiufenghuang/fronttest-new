<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
	  <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
		<el-form-item label="绑定店铺" prop="shopId">
		  <ma-data-select :key="dataForm.shopId" v-model="dataForm.shopId" :url="`/egg/shop/list`"
			:props="{ label: 'name', value: 'id' }" placeholder="绑定店铺"></ma-data-select>
     </el-form-item>
		
		<!-- 修改模板选1择部分 -->
		<el-form-item label="绑定模板" prop="templateIds">
		  <ma-data-select 
			:key="dataForm.type" 
			v-model="dataForm.templateIds" 
			:url="`/template/list?deviceType=${dataForm.type}`"
			:props="{ label: 'name', value: 'id' }" 
			:multiple="dataForm.type == 3"
			@change="handleTemplateChange"
			placeholder="绑定模板">
		  </ma-data-select>
		</el-form-item>
  
		<el-form-item label="设备SN编号" prop="sn">
		  <el-input v-model="dataForm.sn" placeholder="设备SN编号"></el-input>
		</el-form-item>
		
		<el-form-item label="设备名称" prop="name">
		  <el-input v-model="dataForm.name" placeholder="设备名称"></el-input>
		</el-form-item>
		
		<el-form-item label="设备类型" prop="type">
		  <ma-dict-select v-model="dataForm.type" dict-type="device_type" placeholder="设备类型" @change="handleTypeChange"></ma-dict-select>
		</el-form-item>
	  </el-form>
	  <template #footer>
		<el-button @click="visible = false">取消</el-button>
		<el-button type="primary" @click="submitHandle()">确定</el-button>
	  </template>
	</el-dialog>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref, watch, nextTick } from 'vue'
  import { ElMessage } from 'element-plus/es'
  import { useDeviceApi, useDeviceSubmitApi } from '@/api/egg/device'
  
  const emit = defineEmits(['refreshDataList'])
  
  const visible = defineModel<boolean>('visible')
  const dataFormRef = ref()


  const dataForm = reactive({
  id: '',
  shopId: '',
  templateId: '', // 单选模板ID
  templateIds: [] as number[], // 多选模板ID数组，确保是数字数组
  priceTagId: '',
  sn: '',
  name: '',
  status: '',
  type: 0,
  previousWeight: '',
  currentWeight: '',
  creator: '',
  createTime: '',
  updater: '',
  updateTime: '',
  deleted: ''
})
  
  const init = (id?: number) => {
    // 重置表单数据
    Object.assign(dataForm, {
      id: '',
      shopId: '',
      templateId: '',
      templateIds: [],
      priceTagId: '',
      sn: '',
      name: '',
      status: '',
      type: '',
      previousWeight: id ? '' : '0', // 新增时设置为0，修改时保持原值
      currentWeight: '',
      creator: '',
      createTime: '',
      updater: '',
      updateTime: '',
      deleted: ''
    })
    
    if (id) {
      getDevice(id)
    }
  }

  // 添加模板变更处理函数
const handleTemplateChange = (value: any) => {
  console.log('模板选择变更:', value)
  // 确保templateIds是数组
  if (dataForm.type == 3) {
    dataForm.templateIds = Array.isArray(value) ? value : []
    console.log('多选模板IDs:', dataForm.templateIds)
  } else {
    dataForm.templateId = value
    dataForm.templateIds = value ? [value] : []
    console.log('单选模板ID:', dataForm.templateId)
  }
}
  
  const getDevice = (id: number) => {
    useDeviceApi(String(id)).then(res => {
    Object.assign(dataForm, res.data)
    // 处理模板ID数据
    if (dataForm.type === 3) {
      // 确保 templateIds 是数字数组
      dataForm.templateIds = (res.data.templateIds || []).map(id => Number(id))
      dataForm.templateId = ''
    } else {
      dataForm.templateId = String(res.data.templateId || '')
      dataForm.templateIds = []
    }
  })
}
  
  const dataRules = ref({
	sn: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	// 根据设备类型动态设置模板验证规则
	templateIds: [{ 
	  required: true, 
	  message: '必填项不能为空', 
	  trigger: 'change',
	  validator: (rule: any, value: any, callback: any) => {
		if (dataForm.type === 3 && (!value || value.length === 0)) {
		  callback(new Error('请选择模板'))
		} else {
		  callback()
		}
	  }
	}]
  })
  
  // 表单提交
  const submitHandle = () => {
    dataFormRef.value.validate(async (valid: boolean) => {
      if (!valid) {
        return false
      }

      // 准备提交数据
      const submitData = { ...dataForm }
      
      // 根据设备类型处理模板ID
      if (dataForm.type == 3) {
        // 类型3使用templateIds数组
        submitData.templateIds = dataForm.templateIds || []
        delete submitData.templateId
      } else {
        // 其他类型将单个templateId转换为templateIds数组
        submitData.templateIds = dataForm.templateId ? [Number(dataForm.templateId)] : []
        delete submitData.templateId
      }

      // 打印提交的数据，用于调试
      console.log('提交的数据:', submitData)

      useDeviceSubmitApi(submitData).then(() => {
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
  
  // 添加设备类型变化的处理函数
  const handleTypeChange = (value: number) => {
    console.log('设备类型变更:', value)
    console.log('当前templateIds:', dataForm.templateIds)
    // 当设备类型改变时，清空已选择的模板
    dataForm.templateIds = []
    dataForm.templateId = ''
    
    // 当设备类型变为台卡（type=3）时
    if (value == 3) {
      // 确保templateIds是数组
      if (!Array.isArray(dataForm.templateIds)) {
        dataForm.templateIds = []
      }
      console.log('切换为多选模式后的templateIds:', dataForm.templateIds)
    } else {
      console.log('切换为单选模式后的templateIds:', dataForm.templateIds)
    }
  }
  
  // 添加模板选择变更监听
  watch(() => dataForm.templateIds, (newVal) => {
    console.log('templateIds发生变化:', newVal)
  }, { deep: true })
  
  defineExpose({
	init
  })
  </script>