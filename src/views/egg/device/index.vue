<template>
	<!-- 搜索框根据条件查寻-->
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<!-- <el-form-item prop="shopName">
				<el-input v-model="state.queryForm.shopName" placeholder="店铺名称"></el-input>
			</el-form-item> -->
			<el-form-item prop="bindRelation">
				<ma-dict-select v-model="state.queryForm.bindRelation" placeholder="绑定关系"
					dict-type="device_bind_relation"></ma-dict-select>
			</el-form-item>
			<el-form-item prop="shopId">
				<ma-data-select :key="state.queryForm.shopId" v-model="state.queryForm.shopId" :url="`/egg/shop/list`"
					:props="{ label: 'name', value: 'id' }" placeholder="店铺名称"></ma-data-select>
			</el-form-item>
			<el-form-item prop="sn">
				<el-input v-model="state.queryForm.sn" placeholder="设备SN编号"></el-input>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-model="state.queryForm.name" placeholder="设备名称"></el-input>
			</el-form-item>
			<el-form-item prop="status">
				<ma-dict-select v-model="state.queryForm.status" placeholder="设备状态"
					dict-type="device_running_status"></ma-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>
    <!-- 1各种增删改 和页面数据显示地方-->
	<el-card>
		<el-space>
			<el-space v-auth="'egg:device:save'">
				<el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button icon="Shop" plain type="success" @click="deviceBindFormHandle(bindShopType)">批量绑定</el-button>
			</el-space>
			<el-space v-auth="'egg:device:save'">
				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table"
			show-overflow-tooltip @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column label="绑定店铺" header-align="center" align="center">
				<template #default="scope">
					{{ scope.row.shopName || '未绑定' }}
				</template>
			</el-table-column>
			<el-table-column label="绑定模板" header-align="center" align="center">
				<template #default="scope">
					{{ scope.row.templateNames?.join(', ') || '未绑定' }}
				</template>
			</el-table-column>
			<!-- <el-table-column label="电子价签" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-image v-if="scope.row.priceTagUrl" preview-teleported style="width: 100px; height: 100px"
						:src="scope.row.priceTagUrl" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
						:preview-src-list="[scope.row.priceTagUrl]" :initial-index="4" fit="cover" />
					<ma-no-image-card v-else />
				</template>
			</el-table-column> -->
			<el-table-column prop="device.sn" label="设备SN编号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="device.name" label="设备名称" header-align="center" align="center"></el-table-column>
			<el-table-column label="设备状态" header-align="center" align="center">
				<template #default="scope">
					<ma-dict-label :dict-type="'device_running_status'" :dict-value="scope.row.device.status" />
				</template>
			</el-table-column>
			<el-table-column label="设备类型" header-align="center" align="center">
				<template #default="scope">
					<ma-dict-label :dict-type="'device_type'" :dict-value="scope.row.device.type" />
				</template>
			</el-table-column>
			<!-- <el-table-column  prop="device.currentWeight" label="当前重量" header-align="center" align="center" width="0"></el-table-column>
			 -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="600">
				<template #default="scope">
					<el-button v-auth="'egg:device:update'" type="primary" link
						@click="addOrUpdateHandle(scope.row.device.id)">修改</el-button>
					<el-button v-auth="'egg:device:delete'" type="primary" link
						@click="deleteBatchHandle(scope.row.device.id)">删除</el-button>
						<!-- <el-button v-if="scope.row.device.type === 3" type="primary" link
							@click="viewDeviceHandle(scope.row.device.id)">台卡</el-button> -->
					<el-button v-if="scope.row.device.type === 2" type="primary" link
						@click="openGatewayDeviceBind(scope.row.device)">微型价签绑定</el-button>
					<el-button type="primary" link
						@click="showWeightHandle(scope.row.device)">查看重量</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit"
			:total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
			@current-change="currentChangeHandle">
		</el-pagination>

		<!-- 微型价签绑定弹窗 -->
		<gateway-device-bind v-if="gatewayDeviceBindVisible" ref="gatewayDeviceBindRef" v-model:visible="gatewayDeviceBindVisible" :device="previousDevice" @refreshDataList="getDataList" />

		<!-- 重量显示弹窗 -->
		<el-dialog v-model="weightDialogVisible" title="设备重量" width="30%" :close-on-click-modal="false">
			<div style="text-align: center; font-size: 18px;">
				<p>设备名称：{{ previousDevice?.name }}</p>
				<p>设备重量：{{ previousDevice?.previousWeight !== undefined ? previousDevice.previousWeight : '无' }} kg</p>
			</div>
			<template #footer>
				<el-button @click="weightDialogVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model:visible="addOrUpdateVisible"
			@refreshDataList="getDataList"></add-or-update>

		<device-bind-form v-if="deviceBindFormVisible" :id-list="state.dataListSelections" ref="deviceBindFormRef"
			v-model:visible="deviceBindFormVisible" @refreshDataList="getDataList" />
	</el-card>
</template>

<script setup lang="ts" name="EggDeviceIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import DeviceBindForm from './device-bind-form.vue'
import { ElMessage } from 'element-plus'
import GatewayDeviceBind from './gateway-device-bind.vue'

interface DeviceWithTemplates {
	device: {
		id: number;
		shopId: number;
		priceTagId: number;
		templateId: number;
		sn: string;
		name: string;
		status: number;
		type: number;
		previousWeight: number;
		currentWeight: number;
	};
	templates: any[];
	shopName: string;
	templateNames: string[];
}

const state = reactive({
	dataListUrl: '/device/page',
	deleteUrl: '/device',
	queryForm: {
		bindRelation: '',
		shopId: '',
		shopName: '',
		sn: '',
		name: '',
		status: '',
		type: 0 as number,
		templateId: '',
		templateIds: [] as number[]
	},
	dataList: [] as DeviceWithTemplates[],
	dataListSelections: [] as number[],
	dataListLoading: false,
	page: 1,
	limit: 10,
	total: 0,
	pageSizes: [10, 20, 50, 100]
})

const bindShopType = ref(1);
const bindPriceTagType = ref(2);

const queryRef = ref()
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateVisible.value = true
	nextTick(() => addOrUpdateRef.value.init(id))
}

const deviceBindFormVisible = ref(false)
const deviceBindFormRef = ref()
const deviceBindFormHandle = (bindOptionType: number) => {
	if (!state.dataListSelections || state.dataListSelections.length == 0) {
		ElMessage.warning('请选中设备信息')
		return;
	}
	deviceBindFormVisible.value = true
}

const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)

const selectionChangeHandle = (selection: DeviceWithTemplates[]) => {
	state.dataListSelections = selection.map(item => item.device.id)
}

const viewDeviceHandle = (id: number) => {
	console.log('查看设备ID:', id)
	// 可以添加跳转或打开弹窗等操作
}

// 添加模板变更处理函数
const handleTemplateChange = (value: any) => {
	console.log('模板选择变更:', value)
	if (state.queryForm.type === 3) {
		console.log('多选模板IDs:', state.queryForm.templateIds)
	} else {
		console.log('单选模板ID:', state.queryForm.templateId)
	}
}

const weightDialogVisible = ref(false)
const previousDevice = ref<any>(null)

const showWeightHandle = (device: any) => {
	previousDevice.value = device
	weightDialogVisible.value = true
}

const gatewayDeviceBindVisible = ref(false)
const gatewayDeviceBindRef = ref()

const openGatewayDeviceBind = (device: any) => {
	console.log("11")
	previousDevice.value = device
	gatewayDeviceBindVisible.value = true
	nextTick(() => {
		gatewayDeviceBindRef.value.init(device.id)
	})
}
</script>
