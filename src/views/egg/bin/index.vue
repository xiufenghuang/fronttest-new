<template>
		<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="id">
			  <el-input v-model="state.queryForm.id" placeholder="bin文件id"></el-input>
			</el-form-item>
			<el-form-item prop="fileType">
			  <el-select v-model="state.queryForm.fileType" placeholder="文件类型">
				<el-option label="选择" value="0"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item prop="fileVersion">
			  <el-input v-model="state.queryForm.fileVersion" placeholder="文件版本"></el-input>
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
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip @selection-change="selectionChangeHandle" >
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="文件id" header-align="center" align="center"></el-table-column>
			<el-table-column prop="fileUrl" label="文件URL" header-align="center" align="center"></el-table-column>
			<el-table-column prop="fileSize" label="文件大小" header-align="center" align="center"></el-table-column>
			<ma-dict-table prop="fileType" label="文件类型" dict-type="file_bin_type"></ma-dict-table>
			<el-table-column prop="fileVersion" label="文件版本" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model:visible="addOrUpdateVisible" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="FilebinBinIndex">
	import {useCrud} from '@/hooks'
	import {reactive, nextTick, ref} from 'vue'
	import {IHooksOptions} from '@/hooks/interface'
	import AddOrUpdate from './add-or-update.vue'
	

	const state: IHooksOptions = reactive({
	dataListUrl: '/file/bin/page',
	deleteUrl: '/file/bin',
	queryForm: {
		id: '', 
		fileType: '', 
		fileVersion: ''
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
