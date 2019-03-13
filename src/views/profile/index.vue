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
            <el-button class="chang-but" type="primary" size="mini" plain>修改</el-button>
          </div>
          <div class="feed">
              <div>学号：</div>
              <div>{{userInfo.number}}</div>
          </div>
          <div class="feed">
              <div>昵称：</div>
              <div>{{userInfo.username}}</div>
          </div>
          <div class="feed">
              <div>头像网址：</div>
              <div>{{userInfo.avatar}}</div>
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
            <div class="line">
              <div>邮箱：</div>
              <div>{{userInfo.email}}</div>
            </div>
          </div>
          <div class="feed">
            <div class="line">
              <div>性别：</div>
              <div>{{userInfo.sex}}</div>
            </div>
          </div>
          <div class="feed">
            <div class="line">
              <div>年龄：</div>
              <div>{{userInfo.age}}</div>
            </div>
          </div>
          <div class="feed">
            <div class="line">
              <div>个人宣言：</div>
              <div>{{userInfo.introduction}}</div>
            </div>
          </div>
        </el-card>
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

export default {
  name: 'profile',
  data() {
    return {
      username: this.$store.state.user.name,
      userInfo: {},
      avatarUrl: this.$store.state.user.avatar,
      lastLoginDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted: function() {
    console.log(response)
    this.userInfo = this.$store.dispatch('getUserInfo', {
      username: this.username
    })
  },
  methods: {}
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
        margin-top 20px
      .feed:last-child
        border-bottom 0px

    &__right
      .el-card:not(:first-child)
        margin-top 20px
    .card-title
      color #585858
      margin-top: 10px
</style>
