<template>
  <div class="info-area">
    <el-dropdown trigger="click" @command="dropdownComm" class="info-area__dropdown">
      <span class="el-dropdown-link">
        {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="profile">{{$t('sidebarDropDown.profile')}}</el-dropdown-item>
        <el-dropdown-item command="change_password">{{$t('sidebarDropDown.change_password')}}</el-dropdown-item>
        <el-dropdown-item command="lock">{{$t('sidebarDropDown.lock')}}</el-dropdown-item>
        <el-dropdown-item command="logout">{{$t('sidebarDropDown.logout')}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div @click="jumpToProfile" class="info-area__avatar">
      <img :src="avatarUrl" />
    </div>
    <el-dialog title="修改密码" center :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="密码：" prop="password">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newpassword">
          <el-input v-model="temp.newpassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="changepassword()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
// import https from '@/utils/http'

export default {
  name: 'demo',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码至少六字符'))
      } else if (
        '' !== this.temp.confirmPassword &&
        value !== this.temp.confirmPassword
      ) {
        callback('两次输入密码不一致')
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码至少六字符'))
      } else if (value !== this.temp.newpassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      number: this.$store.state.user.number,
      username: this.$store.state.user.name,
      avatarUrl: require('../../assets/images/avatar.jpg'),
      // avatarUrl: this.$store.state.user.avatar,
      dialogFormVisible: false,
      temp: {
        password: '',
        newpassword: '',
        confirmPassword: ''
      },
      rules: {
        password: [
          {
            required: true,
            message: this.$t('login.valid.pwdexist'),
            trigger: 'blur'
          },
          { min: 6, message: '密码至少六字符', trigger: 'blur' }
        ],
        newpassword: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    dropdownComm(command) {
      switch (command) {
        case 'logout':
          this.logouthandle()
          break
        case 'change_password':
          this.changepasswordhandle()
          break
        case 'lock':
          this.lockhandle()
          break
        case 'profile':
          this.jumpToProfile()
          break
      }
    },
    async logouthandle() {
      await this.$store.dispatch('logout')
      window.location.reload()
    },
    lockhandle() {
      this.$store.dispatch('setLockState', 'lock')
      this.$router.push({
        path: '/lock'
      })
      this.$message.success(this.$t('lock.locked'))
    },
    jumpToProfile() {
      this.$router.push({
        path: '/profile'
      })
    },
    changepasswordhandle() {
      this.dialogFormVisible = true
    },
    changepassword() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          try {
            let data = {
              number: this.number,
              password: this.temp.password.trim(),
              newPassword: this.temp.newpassword.trim()
            }
            const http = axios.create({
              baseURL: 'http://localhost:8080',
              timeout: 500000
            })
            http.post(`/user/change-password`, data).then(res => {
              const response = res.data
              console.log(response)
              if (response.code === 200) {
                this.$message({
                  message: response.message,
                  type: 'success',
                  duration: 10000,
                  showClose: true
                })
                this.dialogFormVisible = false
              } else {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 10000,
                  showClose: true
                })
              }
            })
            // const response = http.post(
            //   `/user/change-password`,
            //   data
            // )
            // console.log(response)
            // if (response.code === 200) {
            //   this.$message({
            //     message: response.message,
            //     type: 'success',
            //     duration: 10000,
            //     showClose: true
            //   })
            // } else {
            //   this.$message({
            //     message: response.message,
            //     type: 'error',
            //     duration: 10000,
            //     showClose: true
            //   })
            // }
          } catch (error) {
            console.log(error)
            throw new Error(error)
          }
        } else {
          this.$message.error(this.$t('login.validfaild'))
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.inline-block-box
  display inline-block
  vertical-align middle

.info-area
  &__dropdown
    @extend .inline-block-box
    cursor pointer
  &__avatar
    @extend .inline-block-box
    padding-left 10px
    width 40px
    height 40px
    overflow hidden
    cursor pointer
    img
      border-radius 50%
      width 100%
      height auto
</style>
