<style>
  body {
    margin: 0;
  }
</style>

<template>
  <div>
    <div class="headerWrapper">
      <header class="header">
        <div class="container">
          <el-menu :default-active="activeIndex" class="nav" mode="horizontal">
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="2">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </header>
    </div>


    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: null
      }
    },

    methods: {

    }
  };
</script>