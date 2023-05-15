import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance";

function createCollection(formData) {
  return axiosUploadFileInstance.post('/collections/create', formData)
}

function getCollection(collection_address) {
  return axiosInstance.get('/collections', { params: { collection_address } })
}

function updateCollectionDescription(formBody) {
  return axiosInstance.post('/collections/update-description', formBody)
}

function updateCollectionPicture(formData) {
  return axiosUploadFileInstance.post('/collections/update-picture', formData)
}


export {
  createCollection,
  getCollection,
  updateCollectionDescription,
  updateCollectionPicture
}