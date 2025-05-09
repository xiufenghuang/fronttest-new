import service from '@/utils/request'

export const useTemplateApi = (id: number) => {
	return service.get('/template/' + id)
}

export const useTemplateSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/template', dataForm)
	} else {
		return service.post('/template', dataForm)
	}
}