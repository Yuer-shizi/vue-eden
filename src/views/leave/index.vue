<template>
  <div class="attendance">
    <h1>请假申请</h1>
    <el-form ref="ruleform" :model="form" label-width="180px">
      <el-form-item label="申请人">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="form.speciality" placeholder="请选择班级">
          <el-option label="请选择..." value="null"></el-option>
          <el-option :v-for="sp in specialities" :value="sp">{{sp}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请假类型">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option label="病假" value="病假"></el-option>
          <el-option label="事假" value="事假"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请假时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">--</el-col>
        <el-col :span="10">
          <el-select type="fixed-time" placeholder="第几节课" v-model="form.class1" style="width: 100%;">
            <el-option label="第一节课" value="1"></el-option>
            <el-option label="第二节课" value="2"></el-option>
            <el-option label="第三节课" value="3"></el-option>
            <el-option label="第四节课" value="4"></el-option>
            <el-option label="第五节课" value="5"></el-option>
            <el-option label="第六节课" value="6"></el-option>
            <el-option label="第七节课" value="7"></el-option>
            <el-option label="第八节课" value="8"></el-option>
          </el-select>
        </el-col>
        <el-col class="line" :span="2">到</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date2" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">--</el-col>
        <el-col :span="9">
          <el-select type="fixed-time" placeholder="第几节课" v-model="form.class2" style="width: 100%;">
            <el-option label="第一节课" value="1"></el-option>
            <el-option label="第二节课" value="2"></el-option>
            <el-option label="第三节课" value="3"></el-option>
            <el-option label="第四节课" value="4"></el-option>
            <el-option label="第五节课" value="5"></el-option>
            <el-option label="第六节课" value="6"></el-option>
            <el-option label="第七节课" value="7"></el-option>
            <el-option label="第八节课" value="8"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="请假原因">
        <el-input type="textarea" v-model="form.reason"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '@/utils/http'
export default {
  name: 'leave',
  data: function() {
    return {
      specialities: [],
      form: {
        username: this.$store.state.user.name,
        speciality: '',
        date1: '',
        class1: '',
        date2: '',
        class2: '',
        reason: ''
      },
      ruleform: {
        speciality: [
          {
            required: true,
            message: this.$t('login.valid.userexist'),
            trigger: 'change'
          }
        ],
        reason: [
          {
            required: true,
            message: this.$t('login.valid.pwdexist'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted: function() {
    this.getSpecialities()
  },
  methods: {
    async getSpecialities() {
      let response = await http({
        url: '/specialities',
        method: 'get'
      })
      if (response.code == 200) {
        this.specialities = response.data
      } else {
        this.$message({
          message: response.message,
          type: 'error',
          duration: 10000,
          showClose: true
        })
      }
    },
    // 提交请假
    onSubmit: function() {}
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/styl/variables.styl'

.el-form
  width 700px
.el-select
  width 100%
.line
  text-align center0
</style>
