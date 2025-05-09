<template>
    <el-dialog v-model="visible" :close-on-click-modal="false" draggable>
        <div id="main" style="width: 750px; height: 600px;margin-top: 20px;"></div>

        <el-button style="position: absolute;right: 57.5%;top: 6%;" @click="shopData"
            :type="dataForm.viewAllData === 'true' ? 'primary' : ''">
            所有店铺
        </el-button>

        <el-select v-model="shopId" placeholder="选择店铺" style="position: absolute; right: 41.5%; top: 6%; width: 14%;"
            @change="fetchData">
            <el-option v-for="item in state.dataList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-select v-model="timeUnit" placeholder="选择时间单位" style="position: absolute; right: 30%; top: 6%; width: 10%;"
            @change="handleTimeUnitChange">
            <el-option label="月份" value="month"></el-option>
            <el-option label="年份" value="year"></el-option>
        </el-select>

        <div class="hover" style="position: absolute; right: 25.5%; top: 6.5%">
            <img src="@\assets\last.png" width="21" height="21" @click="previousDate" />
        </div>
        <el-date-picker v-model="todayDate" :type="datePickerType"
            style="position: absolute; right: 11%; top: 6%; width: 14%; height: 5%" @change="handleDateChange" />
        <div class="hover" style="position: absolute; right: 7.3%; top:6.5%;">
            <img src="@\assets\next.png" width="21" height="21" @click="nextDate" />
        </div>

    </el-dialog>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, nextTick, reactive } from 'vue';
import { chartApi } from '@/api/egg/device-record'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'

const state: IHooksOptions = reactive({
    dataListUrl: '/egg/shop/page',
    deleteUrl: '/egg/shop',
    queryForm: {
        name: '',
        id: ''
    }
})

const shopId = ref('');

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')

const todayDate = ref('');
const timeUnit = ref('month');
const datePickerType = ref('month');
const todayYear = ref(getCurrentYear())
const todayMonth = ref(getCurrentMonth());

// 获取当前年份和月份
function getCurrentMonth(): string {
    const currentDate = new Date();
    return currentDate.toISOString().slice(0, 7); // 获取年份和月份
}
function getCurrentYear(): string {
    const currentDate = new Date();
    return currentDate.getFullYear().toString(); // 仅获取年份
}

// 获取当前日期
const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // YYYY-MM-DD 格式
};

onMounted(() => {
    todayDate.value = getCurrentDate();
    getData();
});

const fetchData = () => {
    dataForm.shopId = shopId.value
    dataForm.viewAllData = 'false'
    getData()
}

const shopData = () => {
    dataForm.shopId = ' '
    dataForm.viewAllData = 'true'
    shopId.value = ''
    getData()
}

const dataForm = reactive({
    dateTypeCode: '2',
    shopId: '',
    year: todayYear.value,
    yearMonth: todayMonth.value,
    viewAllData: 'true'
})

const getData = async () => {
    console.log(dataForm)

    try {
        const res = await chartApi(dataForm);
        xData.value = res.data.x;
        yData.value = res.data.y;

        initChart();
    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 上一个日期
const previousDate = () => {
    const currentDate = new Date(todayDate.value);
    if (timeUnit.value === 'month') {
        currentDate.setMonth(currentDate.getMonth() - 1);
        dataForm.dateTypeCode = '2';
        dataForm.year = currentDate.getFullYear().toString();
        dataForm.yearMonth = currentDate.toISOString().slice(0, 7);
    } else {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        dataForm.dateTypeCode = '3';
        dataForm.year = currentDate.getFullYear().toString();
        dataForm.yearMonth = '';
    }
    todayDate.value = currentDate.toISOString().slice(0, 10);
    getData()
};

// 下一个日期
const nextDate = () => {
    const currentDate = new Date(todayDate.value);
    console.log(currentDate)
    if (timeUnit.value === 'month') {
        currentDate.setMonth(currentDate.getMonth() + 1);
        dataForm.dateTypeCode = '2';
        dataForm.year = currentDate.getFullYear().toString();
        dataForm.yearMonth = currentDate.toISOString().slice(0, 7);
    } else {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        dataForm.dateTypeCode = '3';
        dataForm.year = currentDate.getFullYear().toString();
        dataForm.yearMonth = '';
    }
    todayDate.value = currentDate.toISOString().slice(0, 10);
    getData()
};

// 处理日期选择变化的方法
const handleDateChange = (value: Date | null) => {
    if (value) {
        const year = value.getFullYear();
        const month = (value.getMonth() + 1).toString().padStart(2, '0'); // 加 1 以得到正确的月份
        todayMonth.value = `${year}-${month}`;

        // 更新 dataForm 的值
        if (timeUnit.value === 'month') {
            dataForm.dateTypeCode = '2';
            dataForm.year = year.toString(); // 设置年份
            dataForm.yearMonth = `${year}-${month}`; // 设置 yearMonth
            todayDate.value = `${year}-${month}`;
        } else {
            dataForm.dateTypeCode = '3';
            dataForm.year = year.toString(); // 设置年份
            dataForm.yearMonth = ''; // 清空 yearMonth
            todayDate.value = `${year}`;
        }
        getData();
    }
};

const handleTimeUnitChange = () => {
    if (timeUnit.value === 'month') {
        datePickerType.value = 'month';
        dataForm.dateTypeCode = '2';
        dataForm.year = todayYear.value;
        dataForm.yearMonth = todayMonth.value;
    } else {
        datePickerType.value = 'year';
        dataForm.dateTypeCode = '3';
        dataForm.year = todayYear.value;
        dataForm.yearMonth = '';
    }
    // 根据选择更新日期选择器类型
    todayDate.value = getCurrentDate();
    getData()
};

const xData = ref()
const yData = ref()

const initChart = () => {
    const chartDom = document.getElementById('main')
    const myChart = echarts.init(chartDom)
    var option = {
        xAxis: {
            type: 'category',
            data: xData.value
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: yData.value,
                type: 'line',
                label: {
                    show: true,
                    position: 'top'
                },
            }
        ]
    };
    option && myChart.setOption(option)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped>
.container {
    flex: 0.8;
    width: 100%;
}

.date-picker-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    top: 1.5%;
    right: 10%;
}

.hover {
    width: 3%;
    height: 3.6%;
    border: 1px solid #949494;
    border-radius: 5px;
    /* 圆角半径为5像素 */
}

.hover:hover {
    cursor: pointer;
}
</style>