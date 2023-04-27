import { axiosInstance } from "./axiosInstance"

function createAccount() {
  return axiosInstance.get('/accounts/random')
}

function getAccount(account_address) {
  return axiosInstance.get('/accounts/profile', { params: { account_address } })
}

function updateAvatar(account_address) {
  return axiosInstance.post('/accounts/update-avatar')
}

function updateBio(account_address) {
  return axiosInstance.post('/accounts/update-bio')
}

function updateExternalUrl(account_address) {
  return axiosInstance.post('/accounts/update-external-url')
}

function updateName(account_address, formBody) {
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
