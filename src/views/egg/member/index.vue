<template>
    <el-row :gutter="10">
        <el-col>
            <el-card class="layout-query">
                <el-form ref="queryRef" :inline="true" :model="state.queryForm">
                    <el-form-item prop="username">
                        <el-input v-model="state.queryForm.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="mobile">
                        <el-input v-model="state.queryForm.mobile" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="gender">
                        <ma-dict-select v-model="state.queryForm.gender" dict-type="user_gender" clearable
                            placeholder="性别"></ma-dict-select>
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
                        <el-button v-auth="'sys:user:save'" icon="Plus" type="primary"
                            @click="addOrUpdateHandle()">新增</el-button>
                    </el-space>
                    <el-space v-auth="'sys:user:import'">
                        <ma-upload-file action="/sys/user/import">
                            <el-button plain icon="Upload">导入</el-button>
                        </ma-upload-file>
                    </el-space>
                    <el-space>
                        <el-button v-auth="'sys:user:export'" plain icon="Download"
                            @click="downloadHandle('/sys/user/export')">导出</el-button>
                    </el-space>
                    <el-space>
                        <el-button v-auth="'sys:user:delete'" icon="Delete" plain type="danger"
                            @click="deleteBatchHandle()">批量删除</el-button>
                    </el-space>
                </el-space>

                <el-table v-loading="state.dataListLoading" show-overflow-tooltip :data="state.dataList" border
                    class="layout-table" @selection-change="selectionChangeHandle">
                    <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                    <el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
                    <ma-dict-column prop="gender" label="性别" dict-type="user_gender"></ma-dict-column>
                    <el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="shopName" label="所属机构" header-align="center" align="center"></el-table-column>
                    <ma-dict-column prop="status" label="状态" dict-type="user_status"></ma-dict-column>
                    <el-table-column prop="createTime" label="创建时间" header-align="center"
                        align="center"></el-table-column>
                    <el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
                        <template #default="scope">
                            <el-button v-auth="'sys:user:update'" type="primary" link
                                @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                            <el-button v-auth="'sys:user:delete'" type="primary" link
                                @click="deleteBatchHandle(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit"
                    :total="state.total" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="sizeChangeHandle" @current-change="currentChangeHandle">
                </el-pagination>
            </el-card>
        </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
</template>

<script setup lang="ts" name="SysUserIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
// import OrgTree from './org-tree.vue'
import { useUserStore } from '@/store/modules/user'
const user = useUserStore().$state.user

// import { pageMember } from '@/api/egg/member'
const state: IHooksOptions = reactive({
    dataListUrl: '/egg/shopAsi/page',
    deleteUrl: '/sys/user',
    createdIsNeed:false,

    queryForm: {
        username: '',
        mobile: '',
        gender: ''
    }
}) 

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
    addOrUpdateRef.value.init(id)
}

//获取当前登录用户的对应门店信息



onMounted(() => {
    console.log(user)
    getDataList()
    console.log(state.dataList)
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
