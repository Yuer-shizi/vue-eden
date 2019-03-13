import queryString from 'query-string'
const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: 'i am admin',
    avatar: 'https://i.loli.net/2018/08/18/5b7819891bab1.jpg',
    username: 'Admin',
    department: '计算机',
    speciality: '计算机',
    sex: '男',
    age: '12',
    birth: '20160513',
    email: '12345@qq.com',
    number: '001'
  },
  sakuya: {
    roles: ['sakuya'],
    token: 'sakuya',
    introduction: 'i am sakuya',
    avatar: 'https://i.loli.net/2018/08/18/5b7819891bab1.jpg',
    username: 'Sakuya',
    department: '计算机',
    speciality: '网络',
    sex: '女',
    age: '12',
    birth: '20160513',
    email: '12345@qq.com',
    number: '007'
  }
}

export default {
  register: config => {
    let { username } = JSON.parse(config.body)
    let response = {}
    if (username in userMap) {
      response = {
        code: 200,
        data: userMap[username].username,
        message: 'Register success, Welcome' + userMap[username].username
      }
    } else {
      response = {
        code: 200,
        data: null,
        message: 'Register failed, Username is existed'
      }
    }
    return response
  },
  loginbyUser: config => {
    let { username } = JSON.parse(config.body)
    let response = {}
    if (username in userMap) {
      response = {
        code: 200,
        data: userMap[username],
        message: 'Login success, Welcome'
      }
    } else {
      response = {
        code: 200,
        data: null,
        message: 'Login failed, User does not exist'
      }
    }
    return response
  },
  logout: () => {
    return {
      code: 200,
      data: {
        state: 1
      },
      message: 'Logout success'
    }
  },
  info: config => {
    let params = queryString.parse(config.url.replace(/^\S+(?=\?)/, ''))
    let response = {
      code: 200,
      data: userMap[params.username],
      message: 'info'
    }
    return response
  },
  listpage: () => {
    // let params = queryString.parse(config.url.replace(/^\S+(?=\?)/, ''))
    let data = []
    for (let i in userMap) {
      data.push(userMap[i])
      //arr.push(obj[i]); //值
    }
    let response = {
      code: 200,
      data: data,
      message: 'listpage'
    }
    return response
  },
  specialities: () => {
    let data = []
    for (let i in userMap) {
      data.push(userMap[i].speciality)
      //arr.push(obj[i]); //值
    }
    let response = {
      code: 200,
      data: data,
      message: 'specialities'
    }
    return response
  }
}
