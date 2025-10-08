<template>
  <div class="source-container">
    <div class="source-content">
      <p>{{ source.sourceName }}</p>
      <p>{{ source.sourceDesc }}</p>
      <p>{{ source.url }}</p>
    </div>

    <div class="source-api">
      <div class="api-fetch">
        <el-button @click="handleApiFetch" plain>同步接口数据</el-button>
      </div>
      <div class="api-content">
        {{ sourceApi }}
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-tree :data="contentTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>

    <div v-if="apiContentList.length > 0">
      <ul v-for="content in apiContentList" :key="content.id">
        <li class="project-row">
          <div class="project-details">
            <router-link :to="'/project/' + content.id + '/list'">
              <span>{{ content.method }}  {{ content.path }}</span>
            </router-link>
          </div>
        </li>
      </ul>
      <el-pagination
          background
          :page-size="pageSize"
          :hide-on-single-page=true
          layout="prev, pager, next"
          :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {fetchSource, fetchSourceContentList, fetchSourceContentTree, pullSourceApi} from "@/api/api-source";

export default {
  name: "api-source",
  props: {
    sourceId: String
  },
  data() {
    return {
      source: {},
      sourceApi: '',
      pageSize: 10,
      pageTotal: 0,
      apiContentList: [],
      contentTree: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    pullSourceApi() {
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("apiSourceId", this.sourceId);
      pullSourceApi(form).then(res => {
        this.sourceApi = res.data.data;
      })
    },
    fetchSourceContentList() {
      fetchSourceContentList({
        pageNum: 0,
        pageSize: this.pageSize,
        data: {apiSourceId: this.sourceId, keyword: this.keyword}
      }).then(res => {
        if (res.data.data.list != null) {
          this.apiContentList = res.data.data.list;
          this.pageTotal = res.data.data.total;
        }
      });
    },
    fetchSourceContentTree() {
      fetchSourceContentTree({apiSourceId: this.sourceId}
      ).then(res => {
        if (res.data.data != null) {
          this.contentTree = res.data.data;

        }
      });
    },
    handleApiFetch() {
      this.openSocket();
      this.pullSourceApi();
    },
    openSocket() {
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        // var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        // var socketUrl = "http://localhost:8081/ws/" + this.userId;
        let socketUrl = process.env.VUE_APP_WEB_SOCKET + '/' + this.sourceId;
        // socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
        console.log(socketUrl);
        if (this.socket != null) {
          this.socket.close();
          this.socket = null;
        }
        // this.socket = new WebSocket(socketUrl);
        //打开事件
        this.socket = new WebSocket(socketUrl);
        //打开事件
        this.socket.onopen = function () {
          console.log("websocket已打开");
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件（使用箭头函数，指定this）
        this.socket.onmessage = (msg) => {
          console.log(msg);
          let webSocketMessage = JSON.parse(msg.data);
          //发现消息进入    开始处理前端触发逻辑
          if (webSocketMessage.topic === 'api_source_content_pull' && webSocketMessage.data.apiSourceId === this.sourceId) {
            this.fetchSourceContentList();
          }
        };
        //关闭事件
        this.socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        this.socket.onerror = function () {
          console.log("websocket发生了错误");
        };
      }
    },
    sendMessage() {
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        console.log(
            '{"toUserId":"' +
            this.toUserId +
            '","contentText":"' +
            this.content +
            '"}'
        );
        this.socket.send(
            '{"toUserId":"' +
            this.toUserId +
            '","contentText":"' +
            this.content +
            '"}'
        );

      }
    },
    handleNodeClick() {

    }
  },
  created() {
    // 查询api源信息
    fetchSource(this.sourceId).then(res => {
      this.source = res.data.data;
    });
    // 查询api内容信息
    // this.fetchSourceContentList();
    this.fetchSourceContentTree();
  },
  destroyed() {
  }
}
</script>

<style lang="scss" scoped>
.source-container {
  position: relative;
}

.source-content{
  min-height: 400px;
}

.source-api::after {
  content: "";
  display: block;
  clear: both;
}

.api-fetch {
  float: right;
}

</style>
