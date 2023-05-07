import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance";


function createItem(formData) {
  return axiosUploadFileInstance.post('/items/create', formData)
}

function getItemById(item_id) {
  return axiosInstance.get(`/items/detail`, { params: { item_id } })
}

function searchItem(keywords) {
  return axiosInstance.get('/items/search', { params: { keywords } })
}

function exploreItem() {
  return axiosInstance.get('/items/explore')
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

function getItemForUpdate(itemId) {
  return axiosInstance.get(`/items/update/${itemId}`)
}

function updateItem(formData) {
  return axiosInstance.post('/items/update', formData)
}


export {
  exploreItem,
  getItemById,
  searchItem,
  getItemsSuggested,
  updateItem,
  createItem,
  getItemForUpdate
}
