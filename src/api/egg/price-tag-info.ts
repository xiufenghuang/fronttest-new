import service from '@/utils/request'

export const usePriceTagInfoApi = (id: number) => {
	return service.get('/price-tag/info/' + id)
}

export const usePriceTagInfoSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/price-tag/info', dataForm)
	} else {
		return service.post('/price-tag/info', dataForm)
	}
}