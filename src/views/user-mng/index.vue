<template>
  <div class="app-container">
    <el-form :inline="true" class="top-form-inline">
      <el-form-item label="编号">
        <el-input v-model="condition.userId" placeholder="编号" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="condition.username" placeholder="用户名" />
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
      <el-table-column sortable="userId" prop="userId" label="编号" />
      <el-table-column prop="coreUser.username" label="登录名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column
        prop="clCoUserWithTlinkUserPojo.tlinkUserPojo.userName"
        label="父账号昵称"
      />
      <el-table-column prop="phone" label="手机号" />
      <!-- <el-table-column
        sortable="createTime"
        :prop="createTime | parseTime('{y}-{m}-{d} {h}:{i}')"
        label="创建时间"
      /> -->
      <el-table-column min-width="80">
        <template slot="header"> 操作 </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleSetParent(scope.$index, scope.row)"
            v-if="scope.row.userId != 1 && scope.row.userId != 2"
            >设置父账号</el-button
          >
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
            v-if="scope.row.userId != 1 && scope.row.userId != 2"
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
        label-width="70px"
      >
        <el-form-item label="登录名" prop="username">
          <el-input v-model="dataForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" type="password" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="dataForm.nickname" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone" />
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

    <el-dialog title="设置父账号" :visible.sync="setParentDialogFormVisible">
      <el-form :model="setParentForm">
        <el-form-item label="Tlink账号">
          <el-select
            v-model="setParentValue"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setParentDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSetParent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { list, create, update, del, setParent } from "@/api/user-mng";
import { listHasTlinkId } from "@/api/tlink-user-mng";
import { parseTime } from "@/utils";
import md5 from "blueimp-md5";

export default {
  name: "UserMng",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "" || value == undefined) {
        callback(new Error("请输入密码"));
      } else {
        if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/.test(value)) {
          callback();
        } else {
          callback(new Error("需同时含有字母和数字，长度在6-12之间"));
        }
      }
    };
    return {
      options: [],
      setParentValue: "",
      setParentForm: {},
      currentItem: {},
      pageLoading: false,
      tableData: [],
      dataForm: {
        coreUser: {},
      },
      condition: {
        userId: "",
        username: "",
        page: {
          orderBy: "userId",
          sort: "DESC",
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
      },
      dialogFormVisible: false,
      setParentDialogFormVisible: false,
      textMap: {
        edit: "编辑",
        create: "创建",
      },
      dialogStatus: "",
      rules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" },
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
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
      this.dataForm = {
        coreUser: {},
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDetail() {},
    handleUpdate(index, item) {
      this.resetTemp();
      this.dialogStatus = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });

      this.currentItem = item;
      this.dataForm = {
        username: item.coreUser.username,
        password: item.coreUser.password,
        nickname: item.nickname,
        phone: item.phone,
        id: item.id,
      };
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          create({
            coreUser: {
              username: this.dataForm.username,
              password: this.dataForm.password,
            },
            nickname: this.dataForm.nickname,
            phone: this.dataForm.phone,
          }).then((response) => {
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
          update({
            coreUser: {
              username: this.dataForm.username,
              password:
                this.dataForm.password == this.currentItem.coreUser.password
                  ? this.dataForm.password
                  : md5(this.dataForm.password + "clco"),
            },
            id: this.dataForm.id,
            nickname: this.dataForm.nickname,
            phone: this.dataForm.phone,
          }).then((response) => {
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
    handleSetParent(index, item) {
      this.options = [];
      this.currentItem = item;

      if (null != item.clCoUserWithTlinkUserPojo) {
        this.setParentValue =
          item.clCoUserWithTlinkUserPojo.tlinkUserPojo.tlinkId;
      } else {
        this.setParentValue = "";
      }

      listHasTlinkId({}).then((response) => {
        if (response.data) {
          for (var i = 0; i < response.data.length; i++) {
            this.options.push({
              value: response.data[i].tlinkId,
              label: response.data[i].userName,
            });
          }
        }
      });

      this.setParentDialogFormVisible = true;
    },
    handleDelete(index, item) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del({ userId: item.userId }).then((response) => {
            if (0 == response.code) {
              this.$message({
                type: "success",
                message: `删除成功`,
              });
              this.loadPage();
            } else {
              this.$message.error("系统错误");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    doSetParent() {
      if (null == this.setParentValue || "" === this.setParentValue) {
        this.$message.warning("请选择父账号后再保存");
        return;
      }

      this.setParentDialogFormVisible = false;
      setParent({
        userId: this.currentItem.userId,
        tlinkUserId: this.setParentValue,
      }).then((response) => {
        if (0 == response.code) {
          this.$message({
            type: "success",
            message: `设置成功`,
          });
          this.loadPage();
        } else {
          this.$message.error("系统错误");
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
