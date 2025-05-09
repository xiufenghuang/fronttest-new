<template>
	<div class="device-record-container">
		<el-card class="layout-query">
			<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
				<el-form-item prop="sn">
					<el-input v-model="state.queryForm.sn" placeholder="设备SN编号"></el-input>
				</el-form-item>
				<el-form-item prop="deviceName">
					<el-input v-model="state.queryForm.deviceName" placeholder="设备名称"></el-input>
				</el-form-item>
				<el-form-item prop="createTime">
					<el-date-picker v-model="state.queryForm.createTime" type="daterange" value-format="YYYY-MM-DD"
						start-placeholder="记录开始时间" end-placeholder="记录结束时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="layout-content">
			<el-space>
				<el-space>
					<el-button plain icon="Download" @click="downloadHandle('/device-record/export')">导出</el-button>
				</el-space>
				<el-space>
					<el-button plain @click="viewChart()">查看图表</el-button>
				</el-space>
			</el-space>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table"
				show-overflow-tooltip @selection-change="selectionChangeHandle">
				<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
				<el-table-column prop="sn" label="设备SN编号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="deviceName" label="设备名称" header-align="center" align="center"></el-table-column>
				<el-table-column prop="soldWeight" label="售卖重量" header-align="center" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			</el-table>
			<el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit"
				:total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
				@current-change="currentChangeHandle">
			</el-pagination>

			<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model="addOrUpdateVisible"
				@refreshDataList="getDataList"></add-or-update>

			<Echart v-if="viewChartVisible" v-model="viewChartVisible"></Echart>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="EggDeviceRecordIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import Echart from './echart.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/device-record/page',
	deleteUrl: '/device-record',
	queryForm: {
		sn: '',
		deviceName: '',
		createTime: ''
	}
})

const queryRef = ref()
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateVisible.value = true
	nextTick(() => addOrUpdateRef.value.init(id))
}

const viewChartVisible = ref(false)
const viewChart = () => {
	viewChartVisible.value = true
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped>
.device-record-container {
	padding: 20px;
	
	.layout-query {
		margin-bottom: 20px;
	}
	
	.layout-content {
		.layout-table {
			margin: 20px 0;
		}
	}
}
</style>
