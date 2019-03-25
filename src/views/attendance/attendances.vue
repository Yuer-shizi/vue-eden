<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.number" placeholder="工号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.username" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.leave" placeholder="请假人员"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.truant" placeholder="旷课人员"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAttendances">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="attendances" highlight-current-row v-loading="listLoading" stripe border style="width: 100%;">
			<el-table-column prop="number" label="工号" min-width="100" sortable> </el-table-column>
			<el-table-column prop="username" label="记录人" min-width="100" sortable> </el-table-column>
      <el-table-column prop="speciality" label="班级" min-width="180" sortable> </el-table-column>
			<el-table-column prop="date1" :formatter="formatDate" label="时间" min-width="100" sortable> </el-table-column>
			<el-table-column label="请假人员" min-width="180">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.leaves" :key="index" style="margin-left: 10px">{{ item.username }}</span>
        </template>
      </el-table-column>
			<el-table-column label="旷课人员" min-width="180">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.truants" :key="index" style="margin-left: 10px">{{ item.username }}</span>
        </template>
      </el-table-column>
			<el-table-column fixed="right" label="操作" min-width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
				<el-form-item label="记录人">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="speciality">
          <el-select v-model="editForm.speciality" placeholder="请选择班级" disabled>
            <el-option :label="editForm.speciality" :value="editForm.speciality"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="时间" prop="date">
          <el-col :span="11">
            <el-date-picker type="date" disabled ref="data1" placeholder="选择日期" v-model="editForm.date1" value-format="timestamp" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">--</el-col>
          <el-col :span="11">
            <el-select type="fixed-time" ref="class1" placeholder="第几节课" v-model="editForm.class1" disabled style="width: 100%;">
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
        <el-form-item label="请假人员" prop="find">
          <el-select v-model="editForm.leaves" value-key="number" multiple placeholder="请选择">
            <el-option
              v-for="item in users"
              :key="item.number"
              :label="item.username"
              :value="item">
            </el-option>
          </el-select>
          <el-button @click.native="findLeaver" type="primary" size="small" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item label="旷课人员">
          <el-select v-model="editForm.truants" value-key="number" multiple placeholder="请选择">
            <el-option
              v-for="item in users"
              :key="item.number"
              :label="item.username"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import http from '@/utils/http'
import { getUserListBySpeciality } from '@/api/users'
export default {
  name: 'attendances',
  data() {
    const finded = (rule, value, callback) => {
      if (!this.finded) {
        callback(new Error('未查询请假人员'))
      }
      callback()
    }
    return {
      filters: {
        number: '',
        username: '',
        leave: '',
        truant: ''
      },
      attendances: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      //编辑界面数据
      editForm: {},
      users: {},
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
          }
        ],
        finded: [
          {
            required: true,
            validator: finded,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 时间显示转换
    formatDate: function(row) {
      return new Date(row.date1 - 0).toLocaleDateString()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getAttendances()
    },
    //获取用户列表
    getAttendances() {
      let para = {
        page: this.page,
        size: 20,
        number: this.filters.number,
        username: this.filters.username,
        leaves: { username: this.filters.leave },
        truants: { username: this.filters.truant }
      }
      this.listLoading = true
      http
        .get(`/att/list`, {
          params: para
        })
        .then(res => {
          this.total = res.data.totalElements
          this.attendances = res.data.content
          this.listLoading = false
        })
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editForm = Object.assign({}, row)
      this.editForm.date1 = new Date(row.date1 - 0).getTime()
      //获取用户列表
      getUserListBySpeciality({ speciality: this.editForm.speciality }).then(
        res => {
          this.users = res.data
        }
      )
      this.editFormVisible = true
    },
    //跳转新增界面
    handleAdd: function() {
      this.$router.push({
        path: '/attendance/index'
      })
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let para = Object.assign({}, this.editForm)
            para.birth =
              !para.birth || para.birth == ''
                ? ''
                : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            editUser(para).then(() => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getAttendances()
            })
          })
        }
      })
    }
  },
  mounted() {
    this.getAttendances()
  }
}
</script>

<style lang="stylus" scoped>
.el-select
  width 100%
.line
  text-align center
</style>
