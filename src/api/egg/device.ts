import service from '@/utils/request'

export const useDeviceApi = (url: string, method: 'get' | 'post' | 'put' | 'delete' = 'get', data?: any) => {
	const config = {
		url: `/device/${url}`,
		method,
		data
	}
	return service.request(config)
}

export const useDeviceSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/device', dataForm)
	} else {
		return service.post('/device', dataForm)
	}
}

export const bindBatch = (data: any) => {
	return service.post('/device/bindBatch', data)
}

// 获取未绑定的微型价签列表
export const getNoBindMiniList = () => {
	return useDeviceApi('mini/no-bind')
}

// 获取已绑定的微型价签列表
export const getHaveBindMiniList = (id: number) => {
	return useDeviceApi(`mini/bind/${id}`)
}

// 删除绑定关系
export const deleteBindMiniRelation = (id: number) => {
	return useDeviceApi(`mini/bind/${id}`, 'delete')
}

// 保存绑定关系
export const saveBindMini = (ids: number[], parentDeviceId: number) => {
	return useDeviceApi(`mini/bind/${parentDeviceId}`, 'post', ids)
}