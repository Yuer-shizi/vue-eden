import Mock from 'mockjs'
import info from './info.js'

const openMock = false

if (openMock) {
  Mock.mock(/\/login\/register/, 'get', info.register)
  Mock.mock(/\/login\/login/, 'post', info.loginbyUser)
  Mock.mock(/\/login\/logout/, 'post', info.logout)
  Mock.mock(/\/user\/info/, 'get', info.info)
  Mock.mock(/\/user\/listpage/, 'get', info.listpage)
  Mock.mock(/\/specialities/, 'get', info.specialities)
  Mock.mock(/\/user/, 'post', info.changeInfo)
}
export default Mock
