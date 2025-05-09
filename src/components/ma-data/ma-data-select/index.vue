<template>
	<el-select v-model="model" :placeholder="placeholder" :disabled="disabled" :clearable="clearable" style="width: 100%; min-width: 200px">
		<el-option v-for="item in dataList" :key="item[props.value]" :label="item[props.label]" :value="item[props.value]"></el-option>
	</el-select>
</template>

<script setup lang="ts" name="MaDataSelect">
import { PropType, ref, watch } from 'vue'
import { useDataApi } from '@/api/common'

interface Prop {
	value: any
	label: string
}
const prop = defineProps({
	url: {
		type: String,
		default: ''
	},
	data: {
		type: Array,
		default: () => []
	},
	props: {
		type: Object as PropType<Prop>,
		required: false,
		default: () => ({
			value: 'id',
			label: 'name'
		})
	},
	clearable: {
		type: Boolean,
		required: false,
		default: () => true
	},
	disabled: {
		type: Boolean,
		required: false,
		default: () => false
	},
	placeholder: {
		type: String,
		required: false,
		default: () => ''
	}
})

watch(
	() => prop.data,
	val => {
		dataList.value = val
	},
	{ deep: true }
)

const model = defineModel<number | string | number[]>()

// 获取列表
const dataList = ref<any[]>()
const getDataList = async () => {
	if (prop.url.length === 0) {
		return
	}
	const response = await useDataApi(prop.url)
	
	// 确保返回的数据格式正确
	if (Array.isArray(response)) {
		dataList.value = response
	} else if (response && typeof response === 'object') {
		// 如果返回的是单个对象，转换为数组
		dataList.value = [response]
	} else {
		dataList.value = []
	}
}

getDataList()
</script>
