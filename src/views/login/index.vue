<template>
  <div class="login-page">
    <div class="login-wrap">
      <el-col :class="translateLeft"
        :span="10">
        <div v-show="isLoginPart">
          <el-row type="flex" class="logo" justify="center">
            <icon name="tree" :scale="8"></icon>
            <div class="title">
              <span>{{$t('login.edenPart1')}}</span><span class="subtitle">{{$t('login.edenPart2')}}</span>
            </div>
          </el-row>

          <div class="login-form">
            <el-form :rules="rules" :model="loginForm" ref="loginForm" >
              <el-form-item prop="username">
                <el-input :placeholder="$t('login.userplaceholder')" v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input :placeholder="$t('login.pwdplaceholder')" type="password"
                  v-model="loginForm.password" @keyup.enter.native="handleLogin('loginForm')"></el-input>
              </el-form-item>
              <el-form-item class="btn">
                <el-button :loading="loading" type="primary" @click="handleLogin('loginForm')">{{$t('login.btn')}}</el-button>
              </el-form-item>
              <el-form-item class="btn">
                <el-button
                  @click="wrapSwitch(false)"
                  type="primary"
                >{{$t('login.register')}}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="login-footer">
            <el-col :span="12">
              <el-checkbox
                v-model="remember"
                name="type"
              >{{$t('login.remember')}}</el-checkbox>
            </el-col>
            <el-col
              class="forgetpwd"
              :span="12"
            >
              <span @click="forgetHandle">{{$t('login.forgetpwd')}}</span>
            </el-col>
          </div>
        </div>

        <div v-show="!isLoginPart">
          <div class="title registerwrap-title">
            <span>{{$t('login.edenPart1')}}</span><span class="subtitle">{{$t('login.edenPart2')}}</span>
          </div>
          <div class="register-form">
            <el-form :rules="registerRule" :model="registerForm" ref="registerForm">
              <el-form-item prop="type">
                <el-select placeholder="请选择身份" v-model="registerForm.type">
                  <el-option label="老师" value="1"></el-option>
                  <el-option label="学生" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="username">
                <el-input
                  placeholder="请输入学号"
                  v-model.trim.number="registerForm.username"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input :placeholder="$t('login.pwdplaceholder')" type="password" v-model.trim="registerForm.password"></el-input>
              </el-form-item>
              <el-form-item prop="confirmPassword">
                <el-input
                  placeholder="请确认密码"
                  type="password"
                  v-model.trim="registerForm.confirmPassword"
                  @keyup.enter.native="registerHandle('registerForm')"
                ></el-input>
              </el-form-item>
              <el-form-item class="btn">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-button
                      @click="wrapSwitch(true)"
                      type="primary"
                    >{{$t('login.register_back')}}</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      @click="registerHandle('registerForm')"
                      type="primary"
                    >{{$t('login.register')}}</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>

      <el-col :class="translateRight" :span="14">
        <div class="wallpaper"></div>
      </el-col>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage'
import http from '@/utils/http'
export default {
  name: 'login',
  data() {
    var validatePass = (rule, value, callback) => {
      console.log(value)
      console.log(this.registerForm.confirmPassword)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码至少六字符'))
      } else if (
        '' !== this.registerForm.confirmPassword &&
        value !== this.registerForm.confirmPassword
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
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      lang: this.$store.state.app.language,
      loginForm: {
        username: storage.get('loginUser'),
        password: ''
      },
      remember: true,
      loading: false,
      switchLeft: false,
      switchRight: false,
      isLoginPart: true,
      registerForm: {
        type: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('login.valid.userexist'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.valid.pwdexist'),
            trigger: 'blur'
          },
          { min: 6, message: '密码至少六字符', trigger: 'blur' }
        ]
      },
      registerRule: {
        type: [
          {
            required: true,
            message: '身份不能为空',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: this.$t('login.valid.userexist'),
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '学号只能为数字',
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    translateLeft() {
      return {
        'translate-left': true,
        'login-col': true,
        'switch-left': this.switchLeft
      }
    },
    translateRight() {
      return {
        'translate-right': true,
        'login-col': true,
        'switch-right': this.switchLeft
      }
    }
  },
  methods: {
    wrapSwitch(state) {
      this.switchLeft = !this.switchLeft
      this.switchRight = !this.switchRight
      setTimeout(() => {
        this.isLoginPart = state
        this.$refs['loginForm'].resetFields()
        this.$refs['registerForm'].resetFields()
      }, 300)
    },
    handleLogin(formName) {
      this.loading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let { username, password } = this.loginForm
            this.remember
              ? storage.set('loginUser', username)
              : storage.remove('loginUser', username)
            const response = await this.$store.dispatch('loginbyUser', {
              username: (username + '').trim(),
              password: password.trim()
            })
            if (response.data) {
              this.$notify.closeAll()
              this.$router.push({ path: '/' })
            } else {
              this.$message({
                message: response.message,
                type: 'error',
                duration: 10000,
                showClose: true
              })
              this.loading = false
            }
          } catch (error) {
            this.loading = false
            throw new Error(error)
          }
        } else {
          this.loading = false
          this.$message.error(this.$t('login.validfaild'))
        }
      })
    },
    forgetHandle() {
      this.$message({
        message: '请联系老师！',
        type: 'error',
        duration: 0,
        showClose: true
      })
    },
    registerHandle() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          try {
            let response = await new Promise(async (resolve, reject) => {
              try {
                let data = Object.assign({}, this.registerForm)
                let response = await http({
                  url: '/user/register',
                  method: 'post',
                  data
                })
                resolve(response)
              } catch (error) {
                reject(error)
              }
            })
            console.log(response)
            if (response.code == 200) {
              this.$message({
                message: response.message,
                type: 'success',
                duration: 10000,
                showClose: true
              })
              this.wrapSwitch(true)
              this.loginForm.username = response.data.username
            } else {
              this.$message({
                message: response.message,
                type: 'error',
                duration: 10000,
                showClose: true
              })
            }
          } catch (error) {
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

<style lang="stylus">
.register-form,
.login-form
  .el-form-item__content
    line-height 40px
  .el-input__inner
  .el-select
    width 100%
    padding-top: 2px;
    height 40px
    line-height 40px

.btn button
    width: 100%
    padding 12px 20px
</style>

<style lang="stylus" scoped>
@import "../../assets/styl/variables.styl"

.login-col
  height 100%

.login-page
  display flex
  justify-content center
  align-items center
  position absolute
  height 100%
  width 100%
  .lang
    position absolute
    right 59px
    top 24px
  .svg-github
    position absolute
    right 29px
    top 25px
  .translate-left
  .translate-right
    will-change auto
    transform translateX(0px)
    transition transform .6s ease-in-out
  .switch-left
    transform translateX(525px)
  .switch-right
    transform translateX(-375px)
  
.login-wrap
  overflow hidden
  width 900px
  height 400px
  background white
  border-radius 4px
  transform translateY(-10px)
  box-shadow 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04)

  .logo
    padding-top 26px
    text-align center

  .title
    font-weight bold
    color main-color
    padding-top 45px
    font-size 22px

    a
      cursor cell
    a:before
      content '['
      opacity 0
      margin-right 10px
      transform translateX(-10px)
      transition transform .2s, opacity .2s

    a:after
      content ']'
      opacity 0
      margin-left 10px
      transform translateX(10px)
      transition transform .2s, opacity .2s

    a:hover:before
    a:hover:after
      opacity 1
      transform translateX(0)

    .subtitle
      color sub-color

  .registerwrap-title
    padding-top 30px
    padding-left 30px

  .register-form
    padding 20px 30px 30px
    padding-bottom 0

  .login-form
    padding 20px 30px 0 30px

  .login-footer
    padding 0 30px 
    .forgetpwd
      text-align right 
      span
        cursor pointer
        font-size 14px
        font-weight 500
        color #606266

  .wallpaper
    width 100%
    height 100%
    background url('../../assets/images/loginwallpaper.jpg')
    background-size cover
    position relative
</style>
