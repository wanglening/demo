<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="2"
    text-color="#fff"
    router
    unique-opened
    :collapse="!$store.getters.siderType"
    ><el-menu-item index="1">
      <el-icon><svg-icon icon="user"></svg-icon></el-icon>
      <span>用户管理</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><svg-icon icon="user"></svg-icon></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group title="图标">
        <el-menu-item index="/web/twoDchart">二维图</el-menu-item>
        <el-menu-item index="/web/threeDScatter">三维图</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from "vue";
</script>

<style lang="scss" scoped></style>
