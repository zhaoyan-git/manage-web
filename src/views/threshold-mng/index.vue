<template>
  <div class="app-container">
    <el-form :inline="true" class="top-form-inline">
      <el-form-item label="所属设备">
        <el-select
          v-model="condition.deviceName"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in devicelist"
            :key="item.value"
            :label="item.deviceName"
            :value="item.deviceName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">条件查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleCreate"
          >添加自动锁定条件</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      :loading="pageLoading"
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column sortable="id" prop="id" label="编号" />
      <el-table-column prop="tlinkDevicePojo.deviceName" label="所属设备" />
      <el-table-column prop="tlinkDeviceSensorPojo.sensorName" label="传感器" />
      <el-table-column prop="conditionEnum" label="条件">
        <template scope="scope">
          {{ scope.row.conditionEnum | caseConditionEnumFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="threshold" label="数值" />
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
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
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
        <el-form-item label="所属设备" prop="tlinkDeviceId">
          <el-select
            v-model="dataForm.tlinkDeviceId"
            filterable
            clearable
            placeholder="请选择"
            @change="dataFormDeviceIdChange"
            style="width: 100%"
          >
            <el-option
              v-for="item in devicelist"
              :key="item.value"
              :label="item.deviceName"
              :value="item.tlinkId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择传感器" prop="tlinkSensorId">
          <el-select
            v-model="dataForm.tlinkSensorId"
            filterable
            :clearable="1 != dataForm.isDefault"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option-group
              v-for="group in sensorList"
              :key="group.deviceId"
              :label="group.name"
            >
              <el-option
                v-for="item in group.sensorList"
                :key="item.tlinkId"
                :label="item.sensorName"
                :value="item.tlinkId"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="选择条件" prop="conditionEnum">
          <el-select
            v-model="dataForm.conditionEnum"
            clearable
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in conditionEnumlist"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数值" prop="threshold">
          <el-input type="number" v-model="dataForm.threshold" />
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
  devicelist,
  sensorListByDeviceId,
  sensorListByDeviceIdAndSensorTypeId,
} from "@/api/clco-senser-group";

import {
  thresholdList,
  thresholdCreate,
  thresholdUpdate,
  thresholdDel,
} from "@/api/clco-threshold";

export default {
  name: "UserMng",
  filters: {
    // 将数值转化为文字
    caseConditionEnumFilter(val) {
      switch (val) {
        case 1:
          return "大于";
        case 2:
          return "小于";
        case 3:
          return "等于";
      }
    },
  },
  data() {
    return {
      pageLoading: false,
      devicelist: [],
      sensorList: [],
      tableData: [],
      dataForm: { threshold: 0 },
      condition: {
        tlinkDeviceId: "",
        page: {
          orderBy: "id",
          sort: "DESC",
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      },
      dialogFormVisible: false,
      textMap: {
        edit: "编辑",
        create: "创建",
        detail: "查看",
      },
      dialogStatus: "",
      conditionEnumlist: [
        {
          name: "大于",
          value: 1,
        },
        {
          name: "小于",
          value: 2,
        },
        {
          name: "等于",
          value: 3,
        },
      ],
      rules: {
        tlinkDeviceId: [
          { required: true, message: "请选择所属设备", trigger: "blur" },
        ],
        tlinkSensorId: [
          { required: true, message: "请选择传感器", trigger: "blur" },
        ],
        threshold: [{ required: true, message: "请选择条件", trigger: "blur" }],
        conditionEnum: [
          { required: true, message: "请输入数值", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loadPage();
      devicelist().then((response) => {
        this.devicelist = response.data;
      });
    },
    loadPage() {
      if (this.pageLoading) {
        return;
      }
      thresholdList(this.condition).then((response) => {
        var data = response.data;
        this.tableData = data.content;
        this.condition.page.total = data.totalElements;
        this.pageLoading = false;
      });
    },
    onSubmit() {
      this.loadPage();
    },
    handleSizeChange(val) {
      this.condition.page.pageSize = val;
      this.loadPage();
    },
    handleCurrentChange(val) {
      this.condition.page.currentPage = val;
      this.loadPage();
    },
    sortChange(val) {
      var orderBy = val.prop;
      var sort = val.order;
      if (sort === "ascending") {
        this.condition.page.sort = "ASC";
      } else {
        this.condition.page.sort = "DESC";
      }
      this.condition.page.orderBy = orderBy;
      this.loadPage();
    },
    resetTemp() {
      this.dataForm = { threshold: 0 };
      this.sensorList = [];
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDetail(index, item) {
      this.resetTemp();
      this.dialogStatus = "detail";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dataForm = item;
    },
    handleDelete(index, item) {
      this.$confirm("此操作将删除该条件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          thresholdDel({
            id: item.id,
          }).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.loadPage();
          });
        })
        .catch(() => {});
    },
    handleUpdate(index, item) {
      this.resetTemp();
      this.dialogStatus = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dataForm = {
        id: item.id,
        conditionEnum: item.conditionEnum,
        threshold: item.threshold,
        tlinkDeviceId: item.tlinkDeviceId,
        tlinkSensorId: item.tlinkSensorId,
      };
      sensorListByDeviceIdAndSensorTypeId({
        tlinkDeviceId: item.tlinkDeviceId,
        sensorTypeId: 1,
      }).then((response) => {
        this.sensorList = response.data;
      });
      sensorListByGroupeId({ groupId: item.id }).then((response) => {
        if (response.data) {
          for (var i = 0; response.data.length; i++) {
            this.dataForm.sensorList.push(response.data[i].id);
          }
        }
      });
    },
    createData() {
      console.log(this.dataForm);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          thresholdCreate(this.dataForm).then((response) => {
            if (0 == response.code) {
              this.$message({
                type: "success",
                message: `创建成功！`,
              });
              this.dialogFormVisible = false;
              this.loadPage();
            } else {
              this.$message.error("系统错误");
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          thresholdUpdate(this.dataForm).then((response) => {
            if (0 == response.code) {
              this.$message({
                type: "success",
                message: `修改成功！`,
              });
              this.dialogFormVisible = false;
              this.loadPage();
            } else {
              this.$message.error("系统错误");
            }
          });
        } else {
          return false;
        }
      });
    },
    dataFormDeviceIdChange() {
      sensorListByDeviceIdAndSensorTypeId({
        tlinkDeviceId: this.dataForm.tlinkDeviceId,
        sensorTypeId: 1,
      }).then((response) => {
        this.sensorList = response.data;
        this.dataForm.sensorList = [];
        console.log(this.sensorList);
      });
    },
  },
};
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
