import { setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import * as types from '../mutaion-types'
import http from '@/utils/http'

const user = {
  state: {
    token: '',
    roles: [],
    name: '',
    speciality: '',
    introduction: ''
  },
  mutations: {
    [types.SET_TOKEN]: (state, token) => {
      state.token = token
    },
    [types.SET_ROLES]: (state, roles) => {
      state.roles = roles
    },
    [types.SET_INTRODUCTION]: (state, introduction) => {
      state.introduction = introduction
    },
    [types.SET_NAME]: (state, name) => {
      state.name = name
    },
    [types.SET_SPECIALITY]: (state, speciality) => {
      state.speciality = speciality
    }
  },
  actions: {
    loginbyUser({ commit }, { username, password }) {
      return new Promise(async (resolve, reject) => {
        try {
          const data = {
            username,
            password
          }
          const response = await http({
            url: '/user/login',
            method: 'post',
            data
          })
          if (response.data) {
            commit(types.SET_TOKEN, response.data.token)
            setToken(response.data.token)
            Cookies.set('user', username)
          }
          resolve(response)
        } catch (error) {
          reject(error)
        }
      })
    },
    logout({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          await http({ url: '/user/logout', method: 'post' })
          commit(types.SET_ROLES, '')
          commit(types.SET_ROLES, [])
          Cookies.remove('user')
          removeToken()
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    felogout({ commit }) {
      return new Promise(resolve => {
        commit(types.SET_TOKEN, '')
        removeToken()
        resolve()
      })
    },
    getUserInfo({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const username = Cookies.get('user')
          const response = await http({
            url: '/user/info',
            method: 'get',
            params: {
              username
            }
          })
          const roles =
            response.data.type == 0
              ? ['stu']
              : response.data.type == -1
                ? ['admin']
                : ['teacher']
          const name = response.data.username
          const speciality = response.data.speciality
          const introduction = response.data.introduction

          commit(types.SET_ROLES, roles)
          commit(types.SET_NAME, name)
          commit(types.SET_SPECIALITY, speciality)
          commit(types.SET_INTRODUCTION, introduction)

          resolve(response)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}

export default user
