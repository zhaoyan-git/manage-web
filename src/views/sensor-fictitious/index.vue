<template>
  <div class="app-container">
    <el-form :inline="true" class="top-form-inline">
      <el-form-item label="分组名">
        <el-input v-model="condition.sensorName" placeholder="虚拟传感器名" />
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
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">条件查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleCreate"
          >添加虚拟传感器</el-button
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
      <el-table-column prop="sensorName" label="传感器名" />
      <el-table-column prop="device.deviceName" label="所属设备" />
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
        <el-form-item label="传感器名" prop="sensorName">
          <el-input
            v-model="dataForm.sensorName"
            :disabled="1 == dataForm.isDefault"
          />
        </el-form-item>
        <el-form-item label="所属设备" prop="deviceId">
          <el-select
            v-model="dataForm.deviceId"
            filterable
            clearable
            placeholder="请选择"
            @change="dataFormDeviceIdChange"
            style="width: 100%"
            :disabled="1 == dataForm.isDefault"
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
        <el-form-item label="虚拟传感器类型" prop="sensorTypeId">
          <el-select
            v-model="dataForm.sensorTypeId"
            filterable
            clearable
            placeholder="请选择"
            @change="dataFormSensorTypeIdChange"
            style="width: 100%"
            :disabled="1 == dataForm.isDefault"
          >
            <el-option
              v-for="item in sensorTypeIdList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 虚拟传感器类型为【1001 - 设备轨迹】START -->
        <block
          v-if="
            1001 == dataForm.sensorTypeId &&
            null != dataForm.deviceId &&
            '' != dataForm.deviceId
          "
        >
          <!-- 选择经度 -->
          <el-form-item label="选择经度传感器" prop="lngSensorId">
            <el-select
              v-model="dataForm.lngSensorId"
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option-group
                v-for="group in sensorList"
                :key="'lngSensorId' + group.deviceId"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.sensorList"
                  :key="'lngSensorId' + item.tlinkId"
                  :label="item.sensorName"
                  :value="item.tlinkId"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <!-- 选择纬度 -->
          <el-form-item label="选择纬度传感器" prop="latSensorId">
            <el-select
              v-model="dataForm.latSensorId"
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option-group
                v-for="group in sensorList"
                :key="'latSensorId' + group.deviceId"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.sensorList"
                  :key="'latSensorId' + item.tlinkId"
                  :label="item.sensorName"
                  :value="item.tlinkId"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </block>

        <!-- 虚拟传感器类型为【1001 - 设备轨迹】END -->

        <!-- 虚拟传感器类型为【1002 - 油耗】START -->
        <block
          v-if="
            1002 == dataForm.sensorTypeId &&
            null != dataForm.deviceId &&
            '' != dataForm.deviceId
          "
        >
          <!-- 选择油量传感器 -->
          <el-form-item label="选择油量传感器" prop="oilSensorId">
            <el-select
              v-model="dataForm.oilSensorId"
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option-group
                v-for="group in sensorList"
                :key="'lngSensorId' + group.deviceId"
                :label="group.name"
              >
                <el-option
                  v-for="item in group.sensorList"
                  :key="'lngSensorId' + item.tlinkId"
                  :label="item.sensorName"
                  :value="item.tlinkId"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </block>
        <!-- 虚拟传感器类型为【1002 - 油耗】END -->

        <!-- 数据来源是否展示 START -->
        <el-form-item label="是否展示原数据" prop="originalIsShow">
          <el-switch v-model="dataForm.originalIsShow"></el-switch>
        </el-form-item>
        <!-- 数据来源是否展示 END -->
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
  sensorListByDeviceIdAndSensorTypeId,
  sensorListByGroupeId,
} from "@/api/clco-senser-group";

import {
  sensorFictitiousList,
  sensorFictitiousCreate,
  sensorFictitiousUpdate,
  sensorFictitiousDel,
} from "@/api/clco-senser-fictitiousy";

export default {
  name: "UserMng",
  data() {
    return {
      pageLoading: false,
      devicelist: [],
      sensorList: [],
      sensorTypeIdList: [
        {
          value: 1001,
          name: "设备轨迹",
        },
        {
          value: 1002,
          name: "油耗",
        },
      ],
      tableData: [],
      dataForm: { originalIsShow: true },
      condition: {
        sensorName: "",
        deviceId: "",
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
      rules: {
        sensorName: [
          { required: true, message: "请输入分组名", trigger: "blur" },
        ],
        deviceId: [
          { required: true, message: "请选择所属设备", trigger: "blur" },
        ],
        sensorTypeId: [
          { required: true, message: "请选择虚拟传感器类型", trigger: "blur" },
        ],
        lngSensorId: [
          { required: true, message: "请选择经度传感器", trigger: "blur" },
        ],
        latSensorId: [
          { required: true, message: "请选择纬度传感器", trigger: "blur" },
        ],
        oilSensorId: [
          { required: true, message: "请选择油量传感器", trigger: "blur" },
        ],
        originalIsShow: [
          { required: true, message: "是否展示原数据", trigger: "blur" },
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
      sensorFictitiousList(this.condition).then((response) => {
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
      this.dataForm = { originalIsShow: true };
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
      this.$confirm("此操作将删除该虚拟传感器, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sensorFictitiousDel({
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
        sensorName: item.sensorName,
        deviceId: item.deviceId,
        sensorTypeId: item.sensorTypeId,
        lngSensorId: JSON.parse(item.value).lngSensorId,
        latSensorId: JSON.parse(item.value).latSensorId,
        oilSensorId: JSON.parse(item.value).oilSensorId,
        originalIsShow: JSON.parse(item.value).originalIsShow == 1,
      };
      sensorListByDeviceIdAndSensorTypeId({
        tlinkDeviceId: item.deviceId,
        sensorTypeId: 1,
      }).then((response) => {
        this.sensorList = response.data;
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          sensorFictitiousCreate(this.dataForm).then((response) => {
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
          sensorFictitiousUpdate(this.dataForm).then((response) => {
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
    resetValue() {
      delete this.dataForm.lngSensorId;
      delete this.dataForm.latSensorId;
      delete this.dataForm.oilSensorId;
    },
    dataFormDeviceIdChange() {
      sensorListByDeviceIdAndSensorTypeId({
        tlinkDeviceId: this.dataForm.deviceId,
        sensorTypeId: 1,
      }).then((response) => {
        this.sensorList = response.data;
        this.dataForm.sensorList = [];
        this.resetValue();
      });
    },
    dataFormSensorTypeIdChange() {
      this.resetValue();
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
