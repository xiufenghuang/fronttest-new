<template>
  <el-dialog v-model="visible" title="微型价签绑定" :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="dataForm" :label-width="100">
      <!-- 已绑定的微型价签列表 -->
      <el-form-item label="已绑定价签">
        <el-table :data="bindList" border style="width: 100%">
          <el-table-column prop="sn" label="SN编号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="name" label="设备名称" header-align="center" align="center"></el-table-column>
          <el-table-column label="操作" header-align="center" align="center" width="100">
            <template #default="scope">
              <el-button type="danger" link @click="deleteBindHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 未绑定的微型价签选择 -->
      <el-form-item label="未绑定价签">
        <ma-data-select 
          v-model="dataForm.miniDeviceIds" 
          :url="`/device/mini/no-bind`"
          :props="{ label: 'name', value: 'id' }" 
          multiple
          placeholder="请选择微型价签">
        </ma-data-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">新增</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useDeviceApi } from '@/api/egg/device'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()
const bindList = ref<any[]>([])
const currentDeviceId = ref<number>()

const dataForm = reactive({
  miniDeviceIds: [] as number[]
})

const init = (id: number) => {
  currentDeviceId.value = id
  // 获取已绑定的微型价签列表
  getBindList(id)
  // 清空选择
  dataForm.miniDeviceIds = []
}

// 获取已绑定的微型价签列表
const getBindList = (id: number) => {
  useDeviceApi(`mini/bind/${id}`).then(res => {
    bindList.value = res.data
  })
}

// 删除绑定关系
const deleteBindHandle = (id: number) => {
  useDeviceApi(`mini/havebind/${id}`, 'delete').then(() => {
    ElMessage.success('删除成功')
    getBindList(currentDeviceId.value!)
  })
}

// 提交绑定
const submitHandle = () => {
  if (!dataForm.miniDeviceIds || dataForm.miniDeviceIds.length === 0) {
    ElMessage.warning('请选择要绑定的微型价签')
    return
  }

  useDeviceApi(`mini/bind/${currentDeviceId.value}`, 'post', dataForm.miniDeviceIds).then(() => {
    ElMessage.success('绑定成功')
    // 刷新列表
    getBindList(currentDeviceId.value!)
    // 清空选择
    dataForm.miniDeviceIds = []
  })
}

defineExpose({
  init
})
</script>