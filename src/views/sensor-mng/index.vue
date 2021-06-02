<template>
  <div class="app-container">
    <el-form :inline="true" class="top-form-inline">
      <el-form-item label="传感器名">
        <el-input v-model="condition.sensorName" placeholder="传感器名" />
      </el-form-item>
      <el-form-item label="所属设备">
        <el-select
          v-model="condition.deviceId"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in devicelist"
            :key="item.value"
            :label="item.deviceName"
            :value="item.tlinkId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">条件查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      :loading="pageLoading"
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column sortable="id" prop="id" label="编号" />
      <el-table-column
        sortable="tlinkId"
        prop="tlinkId"
        label="Tlink平台编号"
      />
      <el-table-column prop="sensorName" label="传感器名" />
      <el-table-column prop="device.deviceName" label="所属设备" />
      <el-table-column sortable="ordernum" prop="ordernum" label="排序" />
      <el-table-column>
        <template slot="header"> 操作 </template>
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="primary"
            @click="handleDetail(scope.$index, scope.row)"
            >查看</el-button
          > -->
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.$index, scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="condition.page.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="condition.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="condition.page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="130px"
      >
        <el-form-item label="传感器名" prop="sensorName">
          <el-input v-model="dataForm.sensorName" />
        </el-form-item>
        <!-- <el-form-item label="所属设备" prop="deviceName">
          <el-input v-model="dataForm.device.deviceName" />
        </el-form-item> -->
        <el-form-item label="排序" prop="ordernum">
          <el-input v-model="dataForm.ordernum" type="number" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  sensorGrouplist,
  devicelist,
  sensorListByDeviceId,
  sensorListCreate,
  sensorListUpdate,
  sensorListDel,
  sensorListByGroupeId
} from '@/api/clco-senser-group'

import { deviceSensorlist, deviceSensorSave } from '@/api/tlink-senser-mng'

export default {
  name: 'UserMng',
  data() {
    return {
      pageLoading: false,
      devicelist: [],
      sensorList: [],
      tableData: [],
      dataForm: { dataForm: {}},
      condition: {
        deviceName: '',
        page: {
          orderBy: 'id',
          sort: 'DESC',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      dialogFormVisible: false,
      textMap: {
        edit: '编辑',
        create: '创建',
        detail: '查看'
      },
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '请输入分组名', trigger: 'blur' }],
        tlinkDeviceId: [
          { required: true, message: '请选择所属设备', trigger: 'blur' }
        ],
        orderNo: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadPage()
      devicelist().then((response) => {
        this.devicelist = response.data
      })
    },
    loadPage() {
      if (this.pageLoading) {
        return
      }
      deviceSensorlist(this.condition).then((response) => {
        var data = response.data
        this.tableData = data.content
        this.condition.page.total = data.totalElements
        this.pageLoading = false
      })
    },
    onSubmit() {
      this.loadPage()
    },
    handleSizeChange(val) {
      this.condition.page.pageSize = val
      this.loadPage()
    },
    handleCurrentChange(val) {
      this.condition.page.currentPage = val
      this.loadPage()
    },
    sortChange(val) {
      var orderBy = val.prop
      var sort = val.order
      if (sort === 'ascending') {
        this.condition.page.sort = 'ASC'
      } else {
        this.condition.page.sort = 'DESC'
      }
      this.condition.page.orderBy = orderBy
      this.loadPage()
    },
    resetTemp() {
      this.dataForm = { orderNo: 1, sensorList: [] }
      this.sensorList = []
      console.log(123)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetail(index, item) {
      this.resetTemp()
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dataForm = item
    },
    handleDelete(index, item) {
      this.$confirm('此操作将删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sensorListDel({
            groupId: item.id
          }).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.loadPage()
          })
        })
        .catch(() => {})
    },
    handleUpdate(index, item) {
      this.resetTemp()
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dataForm = item
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          sensorListCreate(this.dataForm).then((response) => {
            if (response.code == 0) {
              this.$message({
                type: 'success',
                message: `创建成功！`
              })
              this.dialogFormVisible = false
              this.loadPage()
            } else {
              this.$message.error('系统错误')
            }
          })
        } else {
          return false
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          deviceSensorSave(this.dataForm).then((response) => {
            if (response.code == 0) {
              this.$message({
                type: 'success',
                message: `修改成功！`
              })
              this.dialogFormVisible = false
              this.loadPage()
            } else {
              this.$message.error('系统错误')
            }
          })
        } else {
          return false
        }
      })
    },
    dataFormDeviceIdChange() {
      sensorListByDeviceId({
        tlinkDeviceId: this.dataForm.tlinkDeviceId
      }).then((response) => {
        this.sensorList = response.data
        this.dataForm.sensorList = []
        console.log(this.sensorList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// page start
.el-pagination {
  text-align: center;
  margin-top: 10px;
}
.top-form-inline {
  padding-top: 22px;
  padding-left: 22px;
  background: #eee;
  align-items: center;
}

// page end
</style>
