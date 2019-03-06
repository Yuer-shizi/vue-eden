<template>
  <div>
    <h1>请假申请</h1>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="申请人">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="form.speciality" placeholder="请选择班级">
          <el-option label="请选择..." value="null"></el-option>
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
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="第几节课" v-model="form.class1" style="width: 100%;"></el-time-picker>
        </el-col>
        <el-col class="line" :span="2">~</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date2" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="第几节课" v-model="form.class2" style="width: 100%;"></el-time-picker>
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
export default {
  name: 'attendancepage',
  data: function() {
    return {
      form: {
        name: '',
        speciality: '',
        date1: '',
        class1: '',
        date2: '',
        class2: '',
        reason: ''
      }
    }
  },
  mounted: {},
  methods: {
    // 提交请假
    onSubmit: function() {}
  }
}
</script>

<style lang="stylus" scoped></style>
