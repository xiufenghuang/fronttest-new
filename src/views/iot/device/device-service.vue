<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="deviceCommand">
				<ma-dict-select v-model="state.queryForm.deviceCommandEnum" dict-type="device_command" placeholder="服务类型" clearable></ma-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			show-overflow-tooltip
			border
			class="layout-table"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="serviceUid" label="服务ID" header-align="center" align="center"></el-table-column>
			<ma-dict-column prop="deviceCommandEnum" label="服务类型" dict-type="device_command"></ma-dict-column>
			<el-table-column prop="servicePayload" label="下发内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="serviceTime" label="下发时间" header-align="center" align="center"></el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
	</el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { defineProps, onMounted, reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/iot/device_service_log/page',
	deleteUrl: '/iot/device_service_log',
	queryForm: {
		deviceId: ''
	}
})

const queryRef = ref()
const props = defineProps({
	deviceId: {
		type: Number,
		required: true
	}
})

onMounted(() => {
	state.queryForm.deviceId = props.deviceId
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
