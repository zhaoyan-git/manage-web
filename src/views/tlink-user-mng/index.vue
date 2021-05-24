<template>
  <div class="app-container">
    <el-form :inline="true" class="top-form-inline">
      <el-form-item label="编号">
        <el-input v-model="condition.id" placeholder="编号" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="condition.userName" placeholder="用户名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">条件查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleCreate">添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      :loading="pageLoading"
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column sortable="id" prop="id" label="编号" />
      <el-table-column prop="tlinkId" label="Tlink平台用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column>
        <template slot="header"> 操作 </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleDetail(scope.$index, scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.$index, scope.row)"
            >编辑</el-button
          >
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          > -->
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
        <el-form-item label="Tlink用户名" prop="userName">
          <el-input
            v-model="dataForm.userName"
            :readonly="'detail' == dialogStatus || 'edit' == dialogStatus"
          />
        </el-form-item>
        <el-form-item label="Tlink密码" prop="password">
          <el-input
            v-model="dataForm.password"
            type="password"
            :readonly="'detail' == dialogStatus"
          />
        </el-form-item>
        <div v-if="'edit' == dialogStatus || 'detail' == dialogStatus">
          <el-form-item label="Tlink编号">
            <el-input v-model="dataForm.tlinkId" :readonly="true" />
          </el-form-item>
          <el-form-item label="用户apikey">
            <el-input v-model="dataForm.clientId" :readonly="true" />
          </el-form-item>
          <el-form-item label="用户apiSecret">
            <el-input v-model="dataForm.secret" :readonly="true" />
          </el-form-item>
          <el-form-item label="Tlink手机号码">
            <el-input v-model="dataForm.mobile" :readonly="true" />
          </el-form-item>
          <el-form-item label="Tlink头像">
            <el-input v-model="dataForm.avatar" :readonly="true" />
          </el-form-item>
          <el-form-item label="Tlink邮箱">
            <el-input v-model="dataForm.email" :readonly="true" />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button
          v-if="'create' == dialogStatus || 'edit' == dialogStatus"
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
import { list, create, update } from "@/api/tlink-user-mng";

export default {
  name: "UserMng",
  data() {
    return {
      pageLoading: false,
      tableData: [],
      dataForm: {},
      condition: {
        id: "",
        userName: "",
        page: {
          orderBy: "id",
          sort: "DESC",
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      },
      temp: {
        username: "",
        password: "",
      },
      dialogFormVisible: false,
      textMap: {
        edit: "编辑",
        create: "创建",
        detail: "查看",
      },
      dialogStatus: "",
      rules: {
        userName: [
          { required: true, message: "请输入Tlink用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入Tlink密码", trigger: "blur" },
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
    },
    loadPage() {
      if (this.pageLoading) {
        return;
      }
      list(this.condition).then((response) => {
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
      this.dataForm = {};
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
    handleDelete(index, item) {},
    handleUpdate(index, item) {
      this.resetTemp();
      this.dialogStatus = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dataForm = item;
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          create(this.dataForm).then((response) => {
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
          update(this.dataForm).then((response) => {
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
