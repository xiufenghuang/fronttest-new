import service from '@/utils/request'

export const useBinApi = (id: number) => {
	return service.get('/file/bin/' + id)
}

export const useBinSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/file/bin', dataForm)
	} else {
		return service.post('/file/bin', dataForm)
	}
}