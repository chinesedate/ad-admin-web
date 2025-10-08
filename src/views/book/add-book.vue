<template>
  <div class="add-book-view">
    <header-page :show-header-content="showHeaderContent" show-content-type="saveBook"></header-page>
    <div class="book-save" :class="{'is-hide': showHeaderContent}">
      <el-row>
        <el-button @click="handleSave">保存</el-button>
        <el-button type="primary">发布</el-button>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div class="tip-view">
      <h3>书本信息：</h3>
    </div>
    <el-row class="book-content" type="flex" justify="space-between">
      <el-col :span="10">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="auto" class="book-ruleForm">
          <el-form-item label="书名" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-tag
                :key="tag"
                v-for="tag in ruleForm.author.authors"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
              {{ tag }}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="ruleForm.author.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">输入名称</el-button>
          </el-form-item>
          <el-form-item label="标签选择" prop="label">
            <el-checkbox-group v-model="ruleForm.label">
              <el-checkbox v-for="bookLabel in bookLabelList" :label="bookLabel" :key="bookLabel">{{ bookLabel }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="出版社" prop="press">
            <el-select v-model="ruleForm.press" filterable clearable allow-create placeholder="请选择（可搜索，可创建）">
              <el-option
                  v-for="item in bookPressList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简介" prop="synopsis">
            <el-input
                type="textarea"
                v-model="ruleForm.synopsis"
                maxlength="1000"
                resize="none"
                :rows="5"
                show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-upload
            class="large-img-upload"
            action="#"
            name="bookImage"
            :data="activeAbbrevImg"
            :show-file-list="false"
            :http-request="uploadLargeImage"
            :on-remove="removeImage"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
        >
          <img v-if="activeAbbrevImg.imageUrl" slot="tip" :src="activeAbbrevImg.imageUrl" alt="large img"
               class="large-img">
          <i v-else slot="trigger" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="abbrev-img-wrapper">
          <i id="abbrev-img-arrow-left" class="el-icon-arrow-left" @click="abbrevImgSlide('left')"></i>
          <div class="abbrev-img-list">
            <ul class="abbrev-img-list-slider" :style="{left: sliderLeftLength}">
              <li v-for="(item,index) in abbrevImgArray" class="abbrev-img-upload"
                  @click.self="abbrevImgLiClick(item)"
                  :key="index">
                <img v-if="item.imageUrl" :src="item.imageUrl" alt="abbrev img"
                     @click.self="abbrevImgLiClick(item)"
                     class="abbrev-img">
                <el-upload
                    v-else
                    class="abbrev-img-upload-item"
                    action="#"
                    name="bookImage"
                    :data="item"
                    :show-file-list="false"
                    :http-request="uploadImage"
                    :on-remove="removeImage"
                    :before-remove="beforeRemove"
                    :before-upload="beforeUpload"
                >
                  <i slot="trigger" class="el-icon-plus abbrev-uploader-icon"></i>
                </el-upload>
              </li>
            </ul>
          </div>
          <i id="abbrev-img-arrow-right" class="el-icon-arrow-right" @click="abbrevImgSlide('right')"></i>
        </div>
      </el-col>
    </el-row>
    <el-card class="catalog-card">
      <div slot="header" class="clearfix">
        <h3 class="catalog-card-header">添加目录：</h3>
      </div>
      <el-tree
          :data="data"
          :show-checkbox="false"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent">
      </el-tree>
    </el-card>
  </div>
</template>

<script>
  import throttle from "throttle-debounce/throttle";
  import {removeBookImage, saveBook, saveBookImage} from "@/api/book";
  import {uuidGenerator} from "@/api/uuid";
  import HeaderPage from '@/components/header-page';

  export default {
    name: "AddBook",
    data() {
      let validateAuthor = (rule, value, callback) => {
        if (Array.isArray(value.authors)) {
          if (value.authors.includes(value.inputValue)) {
            callback(new Error('名称已存在，请勿重复添加'));
          } else {
            if (value.authors.length === 0) {
              callback(new Error('请至少输入一个作者'));
            } else if (value.authors.length > 5 || (value.authors.length === 5 && value.inputValue !== '')) {
              callback(new Error('最多添加5个作者'));
            } else {
              callback();
            }
          }
        } else {
          callback(new Error('数据类型错误'));
        }
      };
      const data = [{
        id: "1",
        label: '前言'
      }, {
        id: "2",
        label: '简介'
      }, {
        id: "3",
        label: '导论'
      }, {
        id: "4",
        label: '第一章',
        children: [{
          id: "5",
          label: '1.1'
        }, {
          id: "6",
          label: '1.2'
        }]
      }, {
        id: "7",
        label: '第二章',
        children: [{
          id: "8",
          label: '2.1'
        }, {
          id: "9",
          label: '2.2'
        }]
      }, {
        id: "10",
        label: '结语'
      }];
      return {
        showHeaderContent: false,
        bookTitle: '',
        bookAuthor: '',
        bookSynopsis: '',
        data: JSON.parse(JSON.stringify(data)),
        imageIdSet: new Set(),
        /**
         * 大图是否为空  true 为空，此时大图位置展示上传窗口   false 不为空，此时展示大图
         */
        largeImgEmpty: true,
        largeImg: {},
        abbrevDirection: true,
        abbrevImgArray: [{}, {}, {}, {}, {}, {}, {}],
        /**
         * 当前激活的缩略图序号，页面初始化时默认为第一个
         **/
        activeAbbrevImg: {
          imageUrl: ''
        },
        bookLabelList: ["编程语言", "数据库", "经典小说"],
        bookPressList: [
          {
            value: '选项1',
            label: '机械出版社'
          }, {
            value: '选项2',
            label: '清华大学出版社'
          }, {
            value: '选项3',
            label: '工业出版社'
          }, {
            value: '选项4',
            label: '人民出版社'
          }, {
            value: '选项5',
            label: '教育出版社'
          }
        ],
        ruleForm: {
          // 书本名称
          title: '',
          // 作者
          author: {
            authors: [],
            inputValue: ''
          },
          // 书本内容标签
          label: [],
          // 出版社
          press: '',
          // 书本简介
          synopsis: ''
        },
        inputVisible: false,
        rules: {
          title: [
            {required: true, message: '请输入书本名称', trigger: 'change'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change'}
          ],
          author: [{required: true, validator: validateAuthor, trigger: 'change'}],
          press: [{required: true, message: '请选择一个出版社', trigger: 'change'}],
          synopsis: [{required: true, message: '请填写书本简介', trigger: 'change'}]
        }
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      append(data) {
        const newChild = {id: uuidGenerator(), label: '新章节', children: []};
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      change(data, value) {
        data.label = value;
      },
      renderContent(h, {node, data}) {
        return (
          <span class="custom-tree-node">
            <input value={node.label} on-input={(event) => this.change(data, event.target.value)}/>
            <span>
              <el-button size="mini" type="text" on-click={() => this.append(data)}>添加</el-button>
              <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>删除</el-button>
            </span>
          </span>
        );
      },
      uploadImage(abbrevImg) {
        // 根据后台需求数据格式
        const form = new FormData();
        // 文件对象
        form.append("image", abbrevImg.file);
        saveBookImage(form).then(res => {
            abbrevImg.data.imageUrl = res.data.data.src;
            abbrevImg.file.id = res.data.data.id;
            this.imageIdSet.add(abbrevImg.file.id);
            this.activeAbbrevImg = abbrevImg.data;
            // 手动刷新当前的实例数据
            this.$forceUpdate();
          }
        );
      },
      removeImage(file) {
        removeBookImage(file.id);
        this.imageIdSet.delete(file.id);
      },
      /**
       * 大图上传方法
       **/
      uploadLargeImage(largeImg) {
        // 根据后台需求数据格式
        const form = new FormData();
        // 文件对象
        form.append("image", largeImg.file);
        saveBookImage(form).then(res => {
            largeImg.data.imageUrl = res.data.data.src;
            largeImg.file.id = res.data.data.id;
            this.imageIdSet.add(largeImg.file.id);
            // 手动刷新当前的实例数据
            this.$forceUpdate();
          }
        );
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      /**
       * 文件上传前判断
       **/
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleSave() {
        // 先检验用户信息form表单中的输入信息
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // 限制最少添加三张图片
            if (this.imageIdSet.size < 3) {
              this.$message.error("至少添加三张图片");
            }
            // 保存书本信息
            saveBook({
              title: this.ruleForm.title,
              synopsis: this.ruleForm.synopsis,
              authors: this.ruleForm.author.authors,
              press: this.ruleForm.press,
              label: this.ruleForm.label,
              imageIdList: Array.from(this.imageIdSet),
              catalogue: JSON.stringify(this.data)
            }).then(res => {
              if (res.data.code !== '0') {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 图片滑动
       * @param direction 滑动方向
       */
      abbrevImgSlide(direction) {
        if (direction === 'left') {
          console.log("left");
        } else {
          console.log("right");
        }
        this.abbrevDirection = !this.abbrevDirection;
      },
      /**
       * 处理缩略图点击事件，进行大图切换
       * @param data 缩略图对应的对象
       */
      abbrevImgLiClick(data) {
        this.activeAbbrevImg = data
      },
      handleClose(tag) {
        this.ruleForm.author.authors.splice(this.ruleForm.author.authors.indexOf(tag), 1);
        this.$refs['ruleForm'].validateField('author');
      },

      showInput() {
        this.inputVisible = true;
        // eslint-disable-next-line no-unused-vars
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.ruleForm.author.inputValue;
        if (inputValue) {
          if (this.ruleForm.author.authors.includes(inputValue)) {
            this.$refs['ruleForm'].validateField('author');
            return;
          } else if (this.ruleForm.author.authors.length >= 5) {
            this.$refs['ruleForm'].validateField('author');
            return;
          } else {
            this.ruleForm.author.authors.push(inputValue);
          }
        }
        this.inputVisible = false;
        this.ruleForm.author.inputValue = '';
      },
      /**
       * 页面滚动处理
       * @param event 滚动事件信息
       */
      handleScroll(event) {
        let scrollTop = event.target.scrollingElement.scrollTop;    // 获取页面滚动高度
        // let clientHeight = event.target.scrollingElement.clientHeight; // 获取窗口高度
        // let scrollHeight = event.target.scrollingElement.scrollHeight; // 获取当前元素高度
        this.positionFixed = scrollTop >= 60;
        if (this.showHeaderContent) {
          if (scrollTop < 60) {
            this.showHeaderContent = false;
          }
        } else {
          if (scrollTop >= 60) {
            this.showHeaderContent = true;
          }
        }
      }
    },
    computed: {
      sliderLeftLength() {
        return this.abbrevDirection === true ? '-2px' : '-232px';
      }
    },
    created() {
      // 将激活的缩略图指向第一个
      this.activeAbbrevImg = this.abbrevImgArray[0];
    },
    components: {
      'header-page': HeaderPage,
    },
    mounted() {
      this.addBookPage = document;
      this.throttledScrollHandler = throttle(200, true, this.handleScroll, true);
      //监听页面滚动事件
      this.addBookPage.addEventListener("scroll", this.throttledScrollHandler);
    },
    beforeDestroy() {
      this.addBookPage.removeEventListener('scroll', this.throttledScrollHandler);
    }
  }
</script>

<style lang="scss" scoped>
  .add-book-view {
    width: 800px;
    margin: 0 auto;
  }

  .tip-view {
    padding: 0 18px;
  }

  .book-content {
    height: 500px;
    margin-top: 50px;
  }

  .catalog-card-header {
    color: black;
  }

  .book-description {
    vertical-align: top;
  }

  .book-title, .book-author, .book-synopsis {
    margin-top: 30px;
  }

  .large-img-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 260px;
    height: 300px;
  }

  .large-img-upload /deep/ .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }

  .large-img-upload /deep/ .avatar-uploader-icon {
    width: 258px;
    height: 298px;
    line-height: 298px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .large-img {
    width: 260px;
    height: 300px;
    cursor: pointer;
  }

  .abbrev-img-wrapper {
    width: 260px;
    height: 56px;
    overflow: hidden;
    position: relative;
    margin: 10px auto 0;
  }

  #abbrev-img-arrow-left {
    width: 14px;
    height: 56px;
    position: absolute;
    line-height: 56px;
    vertical-align: center;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 100;
  }

  #abbrev-img-arrow-right {
    width: 14px;
    height: 56px;
    position: absolute;
    line-height: 56px;
    vertical-align: center;
    top: 0;
    right: 0;
    cursor: pointer;
    z-index: 100;
  }

  .abbrev-img-list {
    width: 232px;
    height: 56px;
    margin-left: 15px;
    overflow: hidden;
  }

  .abbrev-img-list-slider {
    width: 413px;
    height: 56px;
    position: relative;
    left: -215px;
    z-index: 1;
  }

  .abbrev-img-upload {
    width: 56px;
    height: 56px;
    overflow: hidden;
    float: left;
    margin-left: 2px;
    line-height: 56px;
    text-align: center;
    background-color: #d3dce6;
    cursor: pointer;
  }

  .abbrev-img-upload-item {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin: auto;
    display: inline-block;
    opacity: 0.7;
  }

  .abbrev-img {
    width: 56px;
    height: 56px;
  }

  .abbrev-img-upload-item .abbrev-uploader-icon {
    width: 20px;
    height: 20px;
  }

  .abbrev-img-upload-item .abbrev-uploader-icon:hover {
    color: #409eff;
  }

  .book-save {
    vertical-align: top;
    margin-top: 20px;
  }

  .book-save.is-hide {
    visibility: hidden;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-tag {
    margin-right: 10px;
  }

  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }

  .catalog-card {
    border-radius: 2px;
    border: 1px solid #ebebeb;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

</style>
