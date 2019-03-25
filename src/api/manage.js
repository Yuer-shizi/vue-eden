import http from '@/utils/http'

export const getUserListPage = params => {
  return http.get(`/user/list`, {
    params: params
  })
}

export const removeUser = params => {
  return http.get(`/user/delete`, {
    params: params
  })
}

export const batchRemoveUser = params => {
  return http.get(`/user/batch-remove`, {
    params: params
  })
}

export const editUser = params => {
  return http.get(`/user/update`, {
    params: params
  })
}

export const addUser = params => {
  return http.get(`/user/add`, {
    params: params
  })
}
