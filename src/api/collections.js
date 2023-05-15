import { axiosUploadFileInstance } from "./axiosInstance";

function createCollection(formData) {
  return axiosUploadFileInstance.post('/collections/create', formData)
}

export {
  createCollection,
}
