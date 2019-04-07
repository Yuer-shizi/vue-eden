<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.number" placeholder="学号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.username" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe border style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="number" label="学号" sortable min-width="80px"> </el-table-column>
      <el-table-column prop="department" label="系别" min-width="150" sortable> </el-table-column>
      <el-table-column prop="speciality" label="专业" min-width="150" sortable> </el-table-column>
			<el-table-column prop="username" label="姓名" min-width="100" sortable> </el-table-column>
      <el-table-column prop="type" label="身份" min-width="80" :formatter="formatType" sortable> </el-table-column>
			<el-table-column prop="sex" label="性别" min-width="80" :formatter="formatSex" sortable> </el-table-column>
			<el-table-column prop="email" label="邮箱" min-width="180" sortable> </el-table-column>
			<el-table-column fixed="right" label="操作" min-width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-form-item label="学号" prop="number">
					<el-input v-model="editForm.number" disabled></el-input>
				</el-form-item>
        <el-form-item label="系别" prop="department">
					<el-input v-model="editForm.department"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="speciality">
					<el-input v-model="editForm.speciality"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="身份" prop="type">
					<el-radio-group v-model="editForm.type">
						<el-radio label="-1">管理员</el-radio>
						<el-radio label="1">老师</el-radio>
						<el-radio label="0">学生</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio label="1">男</el-radio>
						<el-radio label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="100"></el-input-number>
				</el-form-item>
        <el-form-item label="邮件" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
        <el-form-item label="学号" prop="number">
					<el-input v-model="addForm.number"></el-input>
				</el-form-item>
        <el-form-item label="系别" prop="department">
					<el-input v-model="addForm.department"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="speciality">
					<el-input v-model="addForm.speciality"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="username">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="身份" prop="type">
					<el-radio-group v-model="addForm.type">
						<el-radio label="-1">管理员</el-radio>
						<el-radio label="1">老师</el-radio>
						<el-radio label="0">学生</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="100"></el-input-number>
				</el-form-item>
        <el-form-item label="邮件" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
} from '@/api/manage'
export default {
  name: 'managerpage',
  data() {
    // 学号校验
    const validNumber = (rule, value, callback) => {
      let reg = /[0-9]{5}/
      if (value.length != 5) {
        callback(new Error('编号必须为5位'))
      } else if (!reg.test(value)) {
        callback(new Error('编号只能包含数字0-9'))
      } else {
        callback()
      }
    }
    return {
      filters: {
        number: '',
        username: ''
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      //编辑界面数据
      editForm: {
        number: '',
        username: '',
        type: -2,
        sex: -1,
        age: 0,
        addr: ''
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      formRules: {
        number: [
          {
            required: true,
            message: '请输入学号',
            trigger: 'blur'
          },
          {
            validator: validNumber,
            trigger: 'blur'
          }
        ],
        department: [
          {
            required: true,
            message: '请输入学院',
            trigger: 'blur'
          }
        ],
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
        ],
        type: [
          {
            required: true,
            message: '请选择身份',
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ]
      },
      //新增界面数据
      addForm: {
        number: '',
        department: '',
        speciality: '',
        username: '',
        sex: -1,
        age: 0,
        email: ''
      }
    }
  },
  methods: {
    // 身份显示转换
    formatType: function(row) {
      return row.type == 0 ? '学生' : row.sex == 1 ? '老师' : '管理员'
    },
    // 性别显示转换
    formatSex: function(row) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        size: 10,
        number: this.filters.number,
        username: this.filters.username
      }
      this.listLoading = true
      getUserListPage(para).then(res => {
        this.total = res.data.totalElements
        this.users = res.data.content
        this.listLoading = false
      })
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          let para = { number: row.number }
          removeUser(para).then(() => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editForm = Object.assign({}, row)
      this.editForm.type = row.type.toString()
      this.editFormVisible = true
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let para = Object.assign({}, this.editForm)
            editUser(para).then(response => {
              this.editLoading = false
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getUsers()
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
            addUser(para).then(() => {
              this.addLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    selsChange: function(sels) {
      this.sels = sels
    },
    //批量删除
    batchRemove: function() {
      var numbers = this.sels.map(item => item.number).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          let para = { numbers: numbers }
          batchRemoveUser(para).then(() => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>

<style lang="stylus" scoped>

</style>
