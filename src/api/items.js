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

function exploreItems() {
  return axiosInstance.get('/items/explore')
}

function exploreItemsFixedPrice() {
  return axiosInstance.get('/items/explore/fixed-price')
}

function exploreItemsAuction() {
  return axiosInstance.get('/items/explore/auction')
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

// ACCOUNT ITEMS SALES ORDER
function getAllSalesItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/sales', { params: { account_address } })
}

function getAllShippingSalesItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/sales/shipping', { params: { account_address } })
}

function getAllDeliveredSalesItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/sales/delivered', { params: { account_address } })
}

function getAllCanceledSalesItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/sales/canceled', { params: { account_address } })
}

// ACCOUNT ITEMS PURCHASE ORDER
function getAllPurchaseItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/purchase', { params: { account_address } })
}

function getAllShippingPurchaseItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/purchase/shipping', { params: { account_address } })
}

function getAllDeliveredPurchaseItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/purchase/delivered', { params: { account_address } })
}

function getAllCanceledPurchaseItemsOfAccount(account_address) {
  return axiosInstance.get('/items/account/orders/purchase/canceled', { params: { account_address } })
}

// COLLECTION

function getAllItemOfCollection(collection_address) {
  return axiosInstance.get('/items/collection', { params: { collection_address } })
}


export {
  exploreItems,
  getItemById,
  exploreItemsFixedPrice,
  exploreItemsAuction,
  searchItem,
  getItemsSuggested,
  updateItem,
  createItem,
  getItemForUpdate,

  getAllItemOfCollection,

  getAllItemsOfAccount,
  getAllItemsFixedPriceListingOfAccount,
  getAllItemsAuctionListingOfAccount,
  getAllItemsCreatedOfAccount,

  getAllPurchaseItemsOfAccount,
  getAllCanceledPurchaseItemsOfAccount,
  getAllDeliveredPurchaseItemsOfAccount,
  getAllShippingPurchaseItemsOfAccount,

  getAllCanceledSalesItemsOfAccount,
  getAllDeliveredSalesItemsOfAccount,
  getAllSalesItemsOfAccount,
  getAllShippingSalesItemsOfAccount,
}
