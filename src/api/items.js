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


// ACCOUNT ITEMS

function getAllItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account', { params: { account_address } })
}

function getAllItemsFixedPriceListingOfAccount(account_address) {
  return axiosInstance.get('/items/account/fixed-price', { params: { account_address } })
}

function getAllItemsAuctionListingOfAccount(account_address) {
  return axiosInstance.get('/items/account/auction', { params: { account_address } })
}

function getAllItemsCreatedOfAccount(account_address) {
  return axiosInstance.get('/items/account/created', { params: { account_address } })
}

function getAllOrdersOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/sales', { params: { account_address } })
}

// COLLECTION

function getAllItemOfCollection(collection_address) {
  return axiosInstance.get('/items/collection', { params: { collection_address } })
}


export {
  exploreItem,
  getItemById,
  searchItem,
  getItemsSuggested,
  updateItem,
  createItem,
  getItemForUpdate,
  getAllItemsOfAccount,
  getAllItemsFixedPriceListingOfAccount,
  getAllItemsAuctionListingOfAccount,
  getAllItemsCreatedOfAccount,
  getAllOrdersOfAccount,
  getAllItemOfCollection,
}
