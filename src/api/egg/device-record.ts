import service from '@/utils/request'

export const useDeviceRecordApi = (id: number) => {
	return service.get('/device-record/' + id)
}

export const useDeviceRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/device-record', dataForm)
	} else {
		return service.post('/device-record', dataForm)
	}
}

export const chartApi = (dataForm: any) => {
	return service.post('/device-record/sold-weight/chart', dataForm)
}