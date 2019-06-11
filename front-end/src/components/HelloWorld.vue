<template>
  <div id="components-layout-demo-custom-trigger">
    <v-layout>
      <!-- 左侧菜单 -->
      <!-- <v-sider collapsible :collapsed="customCollapsed" :trigger="false" :collapsed-width="64">
        <div class="logo">
        </div>
        <v-menu theme="dark" mode="inline" :data="menuData">
          <template slot-scope="{data}">
            <router-link :to="data.router">
              <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
              <span class="nav-text">
                {{data.name}}
              </span>
            </router-link>
          </template>
        </v-menu>
      </v-sider> -->
      <!-- 右侧内容 -->
      <!-- <v-layout> -->
        <!-- <v-header :style="{ background: '#404040', padding: 0 }">
          <v-icon class="trigger" :type="this.customCollapsed ? 'menu-unfold' : 'menu-fold'" @click.native="toggle"></v-icon>
          <span style="font-weight: bold;color: #fff;font-size: 2em;">CHINA INTELLIGENCE CYBER SECURITY CONFERENCE</span>
        </v-header> -->
        <!-- <v-header :style="{ background: '#404040', margin: '0 5px' }">
          <div style="text-align: center;color: #fff;">
            <span style="font-weight: bold;color: #fff;font-size: 2em;">CHINA INTELLIGENCE CYBER SECURITY CONFERENCE VISUAL SYSTEM</span>
          </div>
        </v-header> -->
        <v-content :style="{ padding: '5px 5px' }">
          <!-- <v-breadcrumb :style="{ margin: '12px 0' }">
            <v-breadcrumb-item>{{pageName}}</v-breadcrumb-item>
            <v-breadcrumb-item href="">{{this.$store.state.currentPage}}</v-breadcrumb-item>
          </v-breadcrumb> -->
          <div style="padding: 5px; background: #fff; min-height: 800px;">
            <router-view />
          </div>
        </v-content>
        <!-- <v-footer :style="{ textAlign: 'center' }">
          Ant Design ©2016 Created by Ant UED | Redesigned by ZhuPengji from NEU
        </v-footer> -->
        <v-back-top></v-back-top>
      <!-- </v-layout> -->
    </v-layout>
  </div>
</template>

<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;
  color: #fff;
}
#components-layout-demo-custom-trigger .trigger:hover {
  color: #108ee9;
}
#components-layout-demo-custom-trigger .logo {
  line-height: 32px;
  height: 32px;
  color: #404040;
  background: #fff url(../assets/CICSC.png);
  border-radius: 6px;
  margin: 16px;
}
#components-layout-demo-custom-trigger .ant-layout-sider-collapsed .anticon {
  font-size: 16px;
}
#components-layout-demo-custom-trigger .ant-layout-sider-collapsed .nav-text {
  display: none;
}
</style>

<script>
export default {
  data() {
    return {
      pageName: "中国智能信息安全会议",
      customCollapsed: false,
      menuData: [{
        name: '主分会场日程安排',
        icon: 'calendar',
        router: 'calendar'
      }, {
        name: '与会人员移动规律',
        icon: 'idcard',
        router: 'conferee'
      }, {
        name: '单地点视图',
        icon: 'idcard',
        router: 'layout'
      }, {
        name: '会议期间异常事件',
        icon: 'file-unknown',
        router: 'abnormal'
      }]
    }
  },
  methods: {
    toggle() {
      this.customCollapsed = !this.customCollapsed;
    }
  }
}
</script>