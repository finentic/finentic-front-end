import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance";


function createItem(formData) {
  return axiosUploadFileInstance.post('/items/create', formData)
}

function getItemById(item_id) {
  return axiosInstance.get(`/items/detail/`, { params: { item_id } })
}

function getItems(params) {
  return axiosInstance.get('/item/newest', params)
}

function getItemsSuggested(productId, limitResults = 3) {
  const products = axiosInstance.get(
    "/products/suggested",
    {
      params: {
        id: productId,
        limit: limitResults,
      },
    },
  )
  return products?.data
}

function updateItem(productId, formData) {
  const products = axiosInstance.patch(
    `/products/${productId}`,
    formData,
  )
  return products?.data
}

function deleteItem(productId) {
  const products = axiosInstance.delete(`/items/${productId}`)
  return products?.data
}

export {
  getItemById,
  getItems,
  getItemsSuggested,
  updateItem,
  createItem,
  deleteItem,
}
