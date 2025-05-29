import service from '@/utils/request'

export const useShopweightApi = (id: number) => {
	return service.get('/business/shopweight/' + id)
}

export const useShopweightSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/business/shopweight', dataForm)
	} else {
		return service.post('/business/shopweight', dataForm)
	}
}