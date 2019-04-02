<template>
  <div class="attendance">
    <h1>请假申请</h1>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="180px">
      <el-form-item label="申请人">
        <el-input v-model="formData.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="speciality">
        <el-select v-model="formData.speciality" placeholder="请选择专业">
          <el-option v-for="sp in specialities" :key="sp" :label="sp" :value="sp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请假类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型">
          <el-option label="病假" value="病假"></el-option>
          <el-option label="事假" value="事假"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请假时间" prop="date">
        <el-col :span="11">
          <el-date-picker type="number" ref="date1" placeholder="选择日期" v-model="formData.date1" :picker-options="pickerOptions" value-format="timestamp" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">--</el-col>
        <el-col :span="10">
          <el-select type="fixed-time" ref="class1" placeholder="第几节课" v-model="formData.class1" style="width: 100%;">
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
          <el-date-picker type="number" ref="date2" placeholder="选择日期" v-model="formData.date2" :picker-options="pickerOptions" value-format="timestamp" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">--</el-col>
        <el-col :span="9">
          <el-select type="fixed-time" ref="class2" placeholder="第几节课" v-model="formData.class2" style="width: 100%;">
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
      <el-form-item label="请假原因" prop="reason">
        <el-input type="textarea" v-model="formData.reason"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="onSubmit" :loading="loading">立即创建</el-button>
        <el-button @click.native="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '@/utils/http'
export default {
  name: 'leave',
  data() {
    const valiDate = (rule, value, callback) => {
      if (!this.$refs.date1.value) {
        callback(new Error('请选择开始日期'))
      } else if (!this.$refs.date2.value) {
        callback(new Error('请选择结束日期'))
      } else if (!this.$refs.class1.value) {
        callback(new Error('请选择课程开始节数'))
      } else if (!this.$refs.class2.value) {
        callback(new Error('请选择课程结束节数'))
      } else if (this.$refs.date1.value > this.$refs.date2.value) {
        callback(new Error('开始日期与结束日期冲突'))
      } else if (
        this.$refs.date1.value == this.$refs.date2.value &&
        this.$refs.class1.value > this.$refs.class2.value
      ) {
        callback(new Error('开始节数与结束节数冲突'))
      }
      callback()
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '明天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      specialities: [],
      formData: {
        username: this.$store.state.user.name,
        speciality: '',
        date1: new Date(),
        class1: '',
        date2: new Date(),
        class2: '',
        reason: ''
      },
      formRules: {
        speciality: [
          {
            required: true,
            message: '班级为空',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请假类型为空',
            trigger: 'blur'
          }
        ],
        date: [
          {
            required: true,
            validator: valiDate,
            trigger: 'blur'
          }
        ],
        reason: [
          {
            required: true,
            message: '请假原因为空',
            trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    async getSpecialities() {
      let response = await http({
        url: '/user/specialities',
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
    onSubmit: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.loading = true
            let para = Object.assign({}, this.formData)
            http
              .get(`/leave/add`, {
                params: para
              })
              .then(data => {
                if (data.code == 200) {
                  this.loading = false
                  this.$message({
                    message: data.message,
                    type: 'success'
                  })
                  this.$refs.form.resetFields()
                } else {
                  this.loading = false
                  this.$message({
                    message: data.message,
                    type: 'error'
                  })
                }
              })
              .catch(error => {
                this.$message({
                  message: error.message,
                  type: 'error'
                })
                this.loading = false
              })
          })
        }
      })
    },
    onReset: function() {
      this.$refs.form.resetFields()
    }
  },
  mounted: function() {
    this.getSpecialities()
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
  text-align center
</style>
