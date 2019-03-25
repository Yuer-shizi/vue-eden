import http from '@/utils/http'

export const getUserListBySpeciality = params => {
  return http.get(`/user/listBySpeciality`, {
    params: params
  })
}
