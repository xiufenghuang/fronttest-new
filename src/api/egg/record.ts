import service from '@/utils/request'

export const useRecordApi = (id: number) => {
	return service.get('/business/record/' + id)
}

export const useRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/business/record', dataForm)
	} else {
		return service.post('/business/record', dataForm)
	}
}