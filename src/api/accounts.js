import { axiosInstance, axiosUploadFileInstance } from "./axiosInstance"

function createAccount() {
  return axiosInstance.get('/accounts/random')
}

function getAccount(account_address) {
  return axiosInstance.get('/accounts/profile', { params: { account_address } })
}

function updateAvatar(formBody) {
  return axiosUploadFileInstance.post('/accounts/update-avatar', formBody)
}

function updateBio(formBody) {
  return axiosInstance.post('/accounts/update-bio', formBody)
}

function updateExternalUrl(formBody) {
  return axiosInstance.post('/accounts/update-external-url', formBody)
}

function updateName(formBody) {
  return axiosInstance.post('/accounts/update-name', formBody)
}

export {
  createAccount,
  getAccount,
  updateAvatar,
  updateBio,
  updateExternalUrl,
  updateName,
};
