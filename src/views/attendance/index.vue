<template>
  <div class="attendance">
    <h1>考勤记录</h1>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="180px">
      <el-form-item label="记录人">
        <el-input v-model="formData.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="班级" prop="speciality">
        <el-select v-model="formData.speciality" placeholder="请选择班级">
          <el-option v-for="sp in specialities" :key="sp" :label="sp" :value="sp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="date">
        <el-col :span="11">
          <el-date-picker type="date" ref="data1" placeholder="选择日期" v-model="formData.date1" :picker-options="pickerOptions" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">--</el-col>
        <el-col :span="11">
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
      </el-form-item>
      <el-form-item label="请假人员" prop="finded">
        <el-select v-model="formData.leaves" value-key="number" multiple placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.number"
            :label="item.username"
            :value="item.number">
          </el-option>
        </el-select>
        <el-button @click.native="findLeaver" type="primary" size="small" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item label="旷课人员">
        <el-select v-model="formData.truants" value-key="number" multiple placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.number"
            :label="item.username"
            :value="item.number">
          </el-option>
        </el-select>
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
import dayjs from 'dayjs'
import { getUserListBySpeciality } from '@/api/users'
export default {
  name: 'leave',
  data() {
    const finded = (rule, value, callback) => {
      if (!this.finded) {
        callback(new Error('未查询请假人员'))
      }
      callback()
    }
    const class1 = (rule, value, callback) => {
      if (!this.formData.class1) {
        callback(new Error('请选择课时'))
      }
      callback()
    }
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      specialities: [],
      users: [],
      formData: {
        number: this.$store.state.user.number,
        username: this.$store.state.user.name,
        speciality: '',
        date1: dayjs().format('YYYY-MM-DD'),
        class1: '1',
        leaves: [],
        truancys: []
      },
      formRules: {
        speciality: [
          {
            required: true,
            message: '班级为空',
            trigger: 'blur'
          }
        ],
        date1: [
          {
            required: true,
            message: '时间为空',
            trigger: 'blur'
          },
          {
            validator: class1,
            trigger: 'blur'
          }
        ],
        finded: [
          {
            validator: finded,
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      finded: false
    }
  },
  watch: {
    'formData.speciality': function(value) {
      if (value != '') {
        this.getUsers(value)
      }
    }
  },
  mounted: function() {
    this.getSpecialities()
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
    //获取用户列表
    async getUsers() {
      getUserListBySpeciality({ speciality: this.formData.speciality }).then(
        res => {
          this.users = res.data
        }
      )
    },
    findLeaver: function() {
      if (
        this.formData.speciality &&
        this.formData.date1 &&
        this.formData.class1
      ) {
        this.finded = true
        let para = {
          speciality: this.formData.speciality,
          date1: this.formData.date1,
          class1: this.formData.class1
        }
        http
          .get(`/leave/findLeaver`, {
            params: para
          })
          .then(data => {
            if (data.code == 200) {
              this.loading = false
              data.data.forEach(item => {
                this.formData.leaves.push(item)
              })
              this.$message({
                message: '查询成功',
                type: 'success'
              })
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
      } else {
        this.$refs.form.validate(() => {})
      }
    },
    // 提交请假
    onSubmit: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              let para = Object.assign({}, this.formData)
              http
                .post(`/att/add`, para)
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
            .catch(() => {})
        }
      })
    },
    onReset: function() {
      this.$refs.form.resetFields()
    }
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
