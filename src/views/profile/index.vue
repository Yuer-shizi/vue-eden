<template>
  <div class="profile-container">
    <el-row class="header">
      <el-col :sm="24" :lg="12" class="header-left">
        <div class="header-avatar">
          <img :src="avatarUrl" />
        </div>
        <div class="header-content">
          <div class="title">
            你好 {{userInfo.username}}
          </div>
          <div class="sub">
            个人宣言：{{userInfo.introduction}}
          </div>
          <div class="sub">
            最后登陆时间：{{lastLoginDate}}
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :lg="12"></el-col>
    </el-row>

    <el-row class="profile-content" :gutter="20">
      <el-col :sm="24" :lg="18" class="profile-content__left">
        <el-card shadow="hover">
          <div slot="header">
            <span class="card-title">个人信息</span>
            <el-button @click="changeFormVisible=true" class="chang-but" type="primary" size="mini" plain>修改</el-button>
          </div>
          <div class="feed">
              <div>学号：</div>
              <div>{{userInfo.number}}</div>
          </div>
          <div class="feed">
              <div>用户名：</div>
              <div>{{userInfo.username}}</div>
          </div>
          <div class="feed">
              <div>学院：</div>
              <div>{{userInfo.department}}</div>
          </div>
          <div class="feed">
              <div>专业：</div>
              <div>{{userInfo.speciality}}</div>
          </div>
          <div class="feed">
              <div>头像网址：</div>
              <div>{{userInfo.avatar}}</div>
          </div>
          <div class="feed">
            <div class="line">
              <div>性别：</div>
              <div>{{userInfo.sex == 1 ? '男' : userInfo.sex == 0 ? '女' : '未知'}}</div>
            </div>
          </div>
          <div class="feed">
            <div class="line">
              <div>邮箱：</div>
              <div>{{userInfo.email}}</div>
            </div>
          </div>
          <div class="feed">
            <div class="line">
              <div>个人宣言：</div>
              <div>{{userInfo.introduction}}</div>
            </div>
          </div>
        </el-card>
        <el-dialog title="修改个人信息" :visible.sync="changeFormVisible" :close-on-click-modal="false">
          <el-form :model="changeForm" label-width="100px" ref="changeForm">
            <el-form-item label="用户名：">
              <el-input v-model="changeForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="头像网址：">
              <el-input v-model="changeForm.avatar" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="changeForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="个人宣言：">
              <el-input v-model="changeForm.introduction" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="changeFormVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogFormSubmit" :loading="changeLoading">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
      <el-col :sm="24" :lg="6" class="profile-content__right">
        <el-card shadow="hover">
          <div slot="header">
            <span class="card-title">信息模块</span>
          </div>
          <div>
            合肥师范学院
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import http from '@/utils/http'

export default {
  name: 'profile',
  data() {
    return {
      username: this.$store.state.user.name,
      userInfo: {},
      changeForm: {},
      avatarUrl: this.$store.state.user.avatar,
      lastLoginDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      changeFormVisible: false,
      changeLoading: false
    }
  },
  mounted: function() {
    this.$store
      .dispatch('getUserInfo', {
        username: this.username
      })
      .then(request => {
        this.userInfo = request.data
        this.changeForm = this.userInfo
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    dialogFormSubmit: function() {
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.changeLoading = true
            let para = Object.assign(this.userInfo, this.changeForm)
            http.get(`/user/update`, { params: para }).then(() => {
              this.changeLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['changeForm'].resetFields()
              this.changeFormVisible = false
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styl/variables.styl'

title-color = #464646
title-sub = #8c8c8c

.profile-container
  .el-card
    font-size 14px

  @extend .edenfont-content
  width 100%
  .header
    padding 15px
    margin -15px
    box-sizing unset
    background white
    height 130px
    &-left
      height 100%
      display flex
      box-sizing border-box
      align-items center
    &-avatar
      margin-left 20px
      display inline-block
      vertical-align middle
      width 100px
      img 
        border-radius 50%
        width 100%
    &-content
      flex 1
      margin-left 20px
      height 85px
      display inline-block
      vertical-align middle
      .title
        font-size 18px
        font-weight bold
        color title-color
        span
          cursor pointer
          color main-color
          &:hover
            text-decoration-line underline
      .sub
        margin-top 20px
        color title-sub
        font-size 14px
      .sub:last-child
        margin-top 10px
  .chang-but
    float: right
    margin-top: -5px
  .profile-content
    margin-top 30px
    &__left
      margin-bottom 20px
      .el-alert
        margin-bottom 20px
      .feed
        height 43px
        border-bottom 1px solid #e0e0e0
        .line
          position relative
        .time
          color #a7a7a7
          font-size 14px
          margin-top 10px
      .feed:not(:first-child)
        margin-top 15px
      .feed:last-child
        border-bottom 0px
    .card-title
      color #585858
      margin-top: 10px
</style>
