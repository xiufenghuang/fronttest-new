<template>
    <el-drawer v-if="templateType==0"v-model="visible" :title="templateName" size="60%">
        <div ref="container" class="container">
    <div class="image-section">
      <img :src="imageUrl" alt="展示图片" v-if="imageUrl" style="width: 100%;height: 100%;" />
    </div>
    <!-- 核心修改：使用子组件定义的 props 和事件 -->
    <ma-upload-file 
      :modelValueFileUrl="imageUrl"  
      @update:modelValueFileUrl="imageUrl = $event" 
      :fileType="['image/jpeg']" 
      :requiredWidth="1024"  
      :requiredHeight="600"
      limit="1"
    >
      <el-button class="upload-demo" type="warning">点击上传图片(仅支持JPG)</el-button>
    </ma-upload-file>
  </div>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="submitHandle()">确定</el-button>
        </template>
    </el-drawer>
    <el-drawer v-else v-model="visible" :title="templateName" size="60%">
        <div ref="container" class="container">
            <!-- 左边部分 -->
            <div class="left-side">
                <div class="input-section" ref="inputSection1" style="border-bottom: 2px solid black;">
                    <input type="text" v-model="name" ref="nameInputRef" placeholder="蛋品名称" class="custom-input">
                    <span ref="hiddenNameInputRef" class="hidden-span"></span>
                </div>
                <div class="input-section" ref="inputSection2">
                    <input type="text" v-model="price" ref="priceInputRef" placeholder="价格" class="custom-input">
                    <span ref="hiddenPriceInputRef" class="hidden-span"></span>
                </div>
            </div>

            <!-- 右边部分 -->
            <div class="right-side">
                <div class="image-section">
                    <img :src="imageUrl" alt="展示图片" v-if="imageUrl" style="width: 100%;height: 100%;" />
                </div>
                <div class="description">
                    <h1 ref="descriptionLabelRef">简介</h1>
                    <div style="position: relative;height: 100%;">
                        <textarea v-model="description" ref="descriptionRef" class="custom-textarea"
                            placeholder="蛋品简介内容"></textarea>
                        <span ref="hiddenDescInputRef" class="hidden-textarea"></span>
                    </div>
                </div>
                <ma-upload-file v-model:fileUrl="imageUrl" :fileType="['image/jpeg']" limit="1">
                    <el-button class="upload-demo" type="warning">点击上传图片(仅支持JPG)</el-button>
                </ma-upload-file>
            </div>
        </div>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="submitHandle()">确定</el-button>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import domPositionUtil from '@/utils/dom-position';
import { ElMessage } from 'element-plus/es'

// 定义响应式数据
const templateName = ref('');
const name = ref('');
const price = ref('');
const description = ref('');
// const description = ref('这里是简介文字');
const imageUrl = ref('');

const visible = defineModel<boolean>('visible')

// 定义响应式数据
const inputSection1 = ref(null);
const inputSection2 = ref(null);


const nameInputRef = ref(null);
const priceInputRef = ref(null);
const descriptionRef = ref(null);
const descriptionLabelRef = ref(null);
const hiddenNameInputRef = ref(null);
const hiddenPriceInputRef = ref(null);
const hiddenDescInputRef = ref(null);

const container = ref(null);

const options = reactive({
    "text": [

    ],
    "image": [

    ],
    "line": [

    ]
})

const isOptionValid = ref(false)
const templateType=ref(0)
const init = (data: any) => {
    templateType.value=data.type
    templateName.value = '设置' + data.name + '模板参数'
    if (data.id) {
        isOptionValid.value = true
        Object.assign(options, JSON.parse(data.options))
        fillProperties()
    } else if (!data.id && options.text.length > 0) {
        fillProperties()
    } else {
        name.value = ''
        price.value = ''
        description.value = ''
    }
}

const fillProperties = () => {
    let { text, image } = options
    name.value = text[0].text
    price.value = text[1].text
    description.value = text[2].text
    imageUrl.value = image[0].url
}

// 获取坐标并打印
const combineOptions = () => {
    if (inputSection1.value && inputSection2.value) {
        if (container.value) {
            clearOptions();
            const pos1 = domPositionUtil.getLeftTopRelativePosition(inputSection1.value, container.value);
            const pos2 = domPositionUtil.getRightTopRelativePosition(inputSection1.value, container.value);

            const pos3 = domPositionUtil.getLeftTopRelativePosition(inputSection2.value, container.value);
            const pos4 = domPositionUtil.getRightTopRelativePosition(inputSection2.value, container.value);

            const pos5 = domPositionUtil.getLeftBottomRelativePosition(inputSection2.value, container.value);
            const pos6 = domPositionUtil.getRightBottomRelativePosition(inputSection2.value, container.value);

            const pos7 = domPositionUtil.getLeftTopRelativePosition(descriptionLabelRef.value, container.value);

            const line1 = createLineOption(pos1.x, pos1.y, pos2.x, pos2.y);
            const line2 = createLineOption(pos3.x, pos3.y, pos4.x, pos4.y);
            const line3 = createLineOption(pos5.x, pos5.y, pos6.x, pos6.y);
            const line4 = createLineOption(pos1.x, pos1.y, pos5.x, pos5.y);
            const line5 = createLineOption(pos2.x, pos2.y, pos6.x, pos6.y);

            options.line.push(line1, line2, line3, line4, line5);

            const text1 = createTextOption(nameInputRef.value, hiddenNameInputRef.value, name, 110);
            const text2 = createTextOption(priceInputRef.value, hiddenPriceInputRef.value, price, 110);
            const text3 = createTextOption(descriptionRef.value, hiddenDescInputRef.value, description, 40);
            const text4 = createSimpleTextOption(pos7.x, pos7.y, '简介', 32);

            options.text.push(text1, text2, text3, text4);

            const image1 = createImageOption(pos2.x, pos2.y, imageUrl.value)
            options.image.push(image1);

            isOptionValid.value = true;
        }
    }
};

const clearOptions = () => {
    options.text = [];
    options.image = [];
    options.line = [];
}

const createLineOption = (x1, y1, x2, y2) => {
    return {
        x1,
        y1,
        x2,
        y2,
        lineColor: parseInt("#000000".slice(1), 16)
    }
}


const createTextOption = (inputElement, hiddenSpanElement, text, fontSize) => {
    const inputValue = inputElement.value;

    if (!inputValue) {
        return;
    }

    // 清空隐藏 span 并设置其内容为输入框的第一个字符
    hiddenSpanElement.textContent = inputValue;
    const pos = domPositionUtil.getLeftTopRelativePosition(hiddenSpanElement, container.value);

    return {
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        text: text.value,
        fontSize,
        fontFamily: 'Arial, sans-serif',
        color: parseInt("#000000".slice(1), 16),
    }
}

const createSimpleTextOption = (x, y, text, fontSize) => {
    return {
        x: Math.round(x),
        y: Math.round(y),
        text,
        fontSize,
        fontFamily: 'Arial, sans-serif',
        color: parseInt("#000000".slice(1), 16),
    }
}

const createImageOption = (x, y, url) => {
    return {
        x,
        y,
        url
    }
}
const rtnImgJson = ()=>{

}
// 表单提交
const submitHandle = () => {
    if (templateType.value == 1){
        if (!name.value) {
            ElMessage.warning('请输入蛋品名称');
            return false;
        } else if (!price.value) {
            ElMessage.warning('请输入价格');
            return false;
        } else if (!description.value) {
            ElMessage.warning('请输入简介内容');
            return false;
        }

        combineOptions();
    }else{
        if (!imageUrl.value){
            ElMessage.warning('请输入蛋品名称');
            return false;
        }
        const image1 = createImageOption(0,0, imageUrl.value)
        options.image.push(image1);

        isOptionValid.value = true;
    }
    


    ElMessage.success({
        message: '设置模板成功',
        duration: 500,
        onClose: () => {
            visible.value = false
        }
    })
}

defineExpose({
    init,
    isOptionValid,
    options
})
</script>

<style scoped>
.custom-input,
.hidden-span,
.custom-textarea {
    font-family: Arial, sans-serif;
}

.custom-input,
.hidden-span {
    width: 90%;
    font-size: 110px;
    text-align: center;
    /* 确保字体大小一致 */
    border: none;
}

.hidden-span,
.hidden-textarea {
    display: block;
    position: absolute;
    visibility: hidden;
    white-space: pre;
    width: auto;
    border: 2px solid red;
    /* background-color: violet; */
    /* 保持空格 */
}

.custom-textarea {
    margin-top: 20px;
    width: 80%;
    height: 80%;
    text-align: left;
    font-size: 40px;
    line-height: 60px;
    padding: 0;
    /* 移除内边距 */
    box-sizing: border-box;
    /* 确保内边距和边框包含在宽度和高度内 */
    background-color: transparent;
    /* 透明背景色 */
    border: none;
    /* 边框只是为了可视化 */
}

.hidden-textarea {
    width: 80%;
    height: 80%;
    top: 17px;
    left: -2px;
    font-size: 40px;
    line-height: 60px;
}

/* 设置 placeholder 文本颜色 */
.custom-textarea::placeholder {
    color: #9c3535;
    /* 占位符文本颜色 */
    opacity: 1;
    font-weight: bold;
    /* 确保占位符文本颜色不被浏览器默认的透明度影响 */
}

.upload-demo {
    /* float: right; */
    position: absolute;
    right: 10px;
    bottom: 8px;
}

.container {
    display: flex;
    width: 1024px;
    height: 600px;
    border: 1px solid #ccc;
    margin-left: 30px;
}


.left-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 2px solid black;
    border-right: none;
}

.right-side {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
    /* 使描述容器占据父元素的一半高度 */
    /* display: flex;
    flex-direction: column;
    justify-content: space-between; */
}

.input-label {
    margin-right: 10px;
    font-size: 24px;
}

.input-section {
    /* margin-bottom: 20px; */
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    width: 100%;
    height: 50%;
    /* border: 2px solid black; */
    position: relative;
    /* border-right: 2px solid black; */
    /* border-bottom: 2px solid black; */
}

.description {
    width: 80%;
    height: 80%;
    /* background-color: red; */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    /* 水平和垂直居中 */
}

.image-section {
    width: 100%;
    height: 99.5%;
    border: 2px solid black;
}
</style>