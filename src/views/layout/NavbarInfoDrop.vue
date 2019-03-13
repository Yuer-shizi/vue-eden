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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 500px; margin-left:50px;">
        <el-form-item :label="$t('user.username') + '：'" prop="username">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.token') + '：'" prop="token">
          <el-input v-model="temp.token"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.introduction') + '：'" prop="introduction">
          <el-input v-model="temp.introduction"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'demo',
  data() {
    return {
      username: this.$store.state.user.name,
      avatarUrl: require('../../assets/images/avatar.jpg'),
      dialogFormVisible: false,
      temp: this.$store.state.user,
      rules: {
        username: [
          { require: true, message: '请输入昵称', trigger: 'blur' },
          { min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur' }
        ],
        token: [
          { require: true, message: '请输入昵称', trigger: 'blur' },
          { min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur' }
        ],
        introduction: [
          { require: true, message: '请输入昵称', trigger: 'blur' }
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
