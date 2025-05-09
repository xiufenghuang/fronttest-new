<template>
	<el-upload v-model:file-list="fileList" style="width: 100%" :action="uploadUrl"
		:headers="{ Authorization: cache.getToken() }" multiple :limit="limit" :before-upload="handleBeforeUpload"
		:on-exceed="handleExceed" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess"
		:disabled="disabled">
		<slot />
		<el-button icon="Upload" plain> 点击上传</el-button>
	</el-upload>
</template>

<script setup lang="ts" name="MaUploadFile">
import { ElMessage, ElNotification, UploadProps, UploadUserFile } from 'element-plus'
import constant from '@/utils/constant'
import cache from '@/utils/cache'
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  action: {
    type: String,
    required: false,
    default: () => null
  },
  fileSize: {
    type: Number,
    default: 5
  },
  limit: {
    type: Number,
    default: 3
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fileType: {
    type: Array,
    default: () => []
  },
  modelValueFileUrl: {
    type: String,
    default: ''
  },
  modelValueFileSize: {
    type: String,
    default: ''
  },
  requiredWidth: {
    type: Number,
    default: false
  },
  requiredHeight: {
    type: Number,
    default: false
  },
})

const emit = defineEmits(['update:modelValueFileUrl', 'update:modelValueFileSize'])

// 上传URL
const uploadUrl = props.action ? constant.apiUrl + props.action : constant.uploadUrl

const fileList = ref<UploadUserFile[]>([])

watch(
  () => props.modelValueFileUrl,
  (val) => {
    if (val && val.length > 0) {
      const urls = val.split(',')
      fileList.value = urls.map((url: string) => {
        return {
          name: url.substring(url.lastIndexOf('/') + 1),
          url: url
        } as UploadUserFile
      })
    } else {
      fileList.value = []
    }
  },
  { immediate: true }
)

const handlePreview: UploadProps['onPreview'] = (uploadFile: any) => {
  window.open(uploadFile.url)
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  const files = uploadFiles.map((file: any) => {
    return file.url
  })

  emit('update:modelValueFileUrl', files.join(','))
  emit('update:modelValueFileSize', file.size)
}

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code !== 0) {
    ElMessage.error('上传失败：' + response.msg)
    return false
  }

  
  const newUrl = response.data.url
  const currentUrls = props.modelValueFileUrl ? props.modelValueFileUrl.split(',') : []
  currentUrls.push(newUrl)
  emit('update:modelValueFileUrl', currentUrls.join(','))
  emit('update:modelValueFileSize', response.data.size)

}

const handleBeforeUpload: UploadProps['beforeUpload'] = async(rawFile)  => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType.includes(rawFile.type)
  const isValidSize =await checkImageDimensions(rawFile, props.requiredWidth,props.requiredHeight);
  if (!imgType) {
    ElNotification({
      title: '温馨提示',
      message: '上传文件不符合所需的格式！',
      type: 'warning'
    })
  }
  if (!imgSize) {
    setTimeout(() => {
      ElNotification({
        title: '温馨提示',
        message: `上传文件大小不能超过 ${props.fileSize}M！`,
        type: 'warning'
      })
    }, 0)
  }


  if (!isValidSize) {
    ElNotification({
      title: '温馨提示',
      message: `上传图片的尺寸不符合要求！必须为：${props.requiredWidth}x${props.requiredHeight}`,
      type: 'warning'
    });
    return false;
  }

  return imgType && imgSize && isValidSize;

}

const handleExceed = () => {
  ElNotification({
    title: '温馨提示',
    message: `最大上传数量为：${props.limit}，请移除后上传！`,
    type: 'warning'
  })
}

const checkImageDimensions = (file: File, requiredWidth: number, requiredHeight: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = () => {
      // 判断图片的宽度和高度是否与要求的宽度和高度匹配
      if (img.width === requiredWidth && img.height === requiredHeight) {
        resolve(true);
      } else {
        resolve(false);
      }
      URL.revokeObjectURL(objectURL);  // 清理URL对象
    };

    img.onerror = () => {
      resolve(false);
      URL.revokeObjectURL(objectURL);  // 清理URL对象
    };

    img.src = objectURL;
  });
};



</script>