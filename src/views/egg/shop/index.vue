<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="name">
				<el-input v-model="state.queryForm.name" placeholder="店铺名称"></el-input>
			</el-form-item>
			<el-form-item prop="address">
				<el-input v-model="state.queryForm.address" placeholder="店铺地址"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table"
			show-overflow-tooltip @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="orgName" label="机构名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="leaderName" label="店铺负责人" header-align="center" align="center"></el-table-column>
			<el-table-column label="店铺图片" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-image v-if="scope.row.imageFileList && scope.row.imageFileList.length > 0" preview-teleported
						style="width: 100px; height: 100px" :src="scope.row.imageFileList[0]?.url" :zoom-rate="1.2"
						:max-scale="7" :min-scale="0.2"
						:preview-src-list="scope.row.imageFileList.map(image => image.url)" :initial-index="4"
						fit="cover" />
					<ma-no-image-card v-else />
					<!--  -->
				</template>
			</el-table-column>
			<el-table-column prop="name" label="店铺名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="店铺地址" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit"
			:total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
			@current-change="currentChangeHandle">
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model:visible="addOrUpdateVisible"
			@refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="EggShopIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'


const state: IHooksOptions = reactive({
	dataListUrl: '/egg/shop/page',
	deleteUrl: '/egg/shop',
	queryForm: {
		name: '',
		address: ''
	}
})

const queryRef = ref()
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateVisible.value = true
	nextTick(() => addOrUpdateRef.value.init(id))
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
