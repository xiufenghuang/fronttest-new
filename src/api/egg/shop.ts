import service from '@/utils/request'

export const useShopApi = (id: number) => {
	return service.get('/egg/shop/' + id)
}

export const useShopSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/egg/shop', dataForm)
	} else {
		return service.post('/egg/shop', dataForm)
	}
}

export const useShopListApi = () => {
  return service.get("/egg/shop/list");
};