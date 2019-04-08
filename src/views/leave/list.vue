<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.speciality" placeholder="专业"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.username" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getLeaves">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="leaves" highlight-current-row v-loading="listLoading" stripe border style="width: 100%;">
      <el-table-column prop="speciality" label="专业" width="180" sortable> </el-table-column>
			<el-table-column prop="username" label="姓名" min-width="80" sortable> </el-table-column>
			<el-table-column prop="type" label="请假类型" width="110" sortable> </el-table-column>
      <el-table-column label="请假时间" width="180">
        <template slot-scope="scope">
					<span style="margin-left: 10px">{{ parseInt(scope.row.date1) | formatDate }}</span>
          <span style="margin-left: 10px">第{{ scope.row.class1 }}节课</span>
          <span style="margin-left: 10px">{{ parseInt(scope.row.date1) | formatDate }}</span>
          <span style="margin-left: 10px">第{{ scope.row.class1 }}节课</span>
				</template>
      </el-table-column>
			<el-table-column prop="reason" label="请假原因" min-width="130" sortable> </el-table-column>
			<el-table-column label="批准人" min-width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.teacherName == null ? '未批准' : scope.row.teacherName }}</span>
        </template>
      </el-table-column>
			<el-table-column fixed="right" label="操作" min-width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="apply(scope.row)">允许</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-form-item label="姓名" prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="speciality">
					<el-input v-model="editForm.speciality"></el-input>
				</el-form-item>
        <el-form-item label="请假类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择类型">
            <el-option label="病假" value="病假"></el-option>
            <el-option label="事假" value="事假"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="请假时间" prop="date">
          <el-col :span="11">
            <el-date-picker type="number" ref="date1" placeholder="选择日期" v-model="editForm.date1" :picker-options="pickerOptions" value-format="timestamp" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">--</el-col>
          <el-col :span="10">
            <el-select type="fixed-time" ref="class1" placeholder="第几节课" v-model="editForm.class1" style="width: 100%;">
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
            <el-date-picker type="number" ref="date2" placeholder="选择日期" v-model="editForm.date2" :picker-options="pickerOptions" value-format="timestamp" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">--</el-col>
          <el-col :span="9">
            <el-select type="fixed-time" ref="class2" placeholder="第几节课" v-model="editForm.class2" style="width: 100%;">
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
          <el-input type="textarea" v-model="editForm.reason"></el-input>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">修改</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import http from '@/utils/http'
export default {
  name: 'managerpage',
  data() {
    return {
      filters: {
        number: '',
        username: ''
      },
      leaves: [],
      total: 0,
      page: 1,
      listLoading: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      pickerOptions: {
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
      //编辑界面数据
      editForm: {
        id: -1,
        username: '',
        speciality: '',
        date1: new Date(),
        class1: '',
        date2: new Date(),
        class2: '',
        reason: ''
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      formRules: {
        speciality: [
          {
            required: true,
            message: '请输入专业',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ]
      },
      //新增界面数据
      addForm: {
        teacherName: this.$store.state.user.name,
        username: '',
        speciality: '',
        date1: new Date(),
        class1: '',
        date2: new Date(),
        class2: '',
        reason: ''
      }
    }
  },
  filters: {
    formatDate: function(value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + MM + '-' + d
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getLeaves()
    },
    //获取用户列表
    getLeaves() {
      let para = {
        page: this.page,
        size: 10,
        speciality: this.filters.speciality,
        username: this.filters.username
      }
      this.listLoading = true
      http
        .get(`/leave/list`, {
          params: para
        })
        .then(res => {
          this.total = res.data.totalElements
          this.leaves = res.data.content
        })
      this.listLoading = false
    },
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
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
    },
    apply: function(row) {
      let para = Object.assign({}, row)
      console.log(row)
      para.teacherName = this.$store.state.user.name
      http
        .get(`/leave/update`, {
          params: para
        })
        .then(() => {
          this.editLoading = false
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.getLeaves()
        })
        .catch(error => {
          console.log(error)
          this.$message({
            message: error.message,
            type: 'error'
          })
        })
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let para = Object.assign({}, this.editForm)
            http
              .get(`/leave/update`, {
                params: para
              })
              .then(() => {
                this.editLoading = false
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getLeaves()
              })
              .catch(error => {
                this.$message({
                  message: error.message,
                  type: 'error'
                })
                this.editLoading = false
              })
          })
        }
      })
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = Object.assign({}, this.addForm)
            http
              .get(`/leave/add`, {
                params: para
              })
              .then(() => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getLeaves()
              })
              .catch(error => {
                this.$message({
                  message: error.message,
                  type: 'error'
                })
                this.loading = false
              })
            this.addLoading = false
          })
        }
      })
    }
  },
  mounted() {
    this.getLeaves()
  }
}
</script>

<style lang="stylus" scoped>

</style>
