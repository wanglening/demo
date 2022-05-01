<template>
  <el-cascader
    placeholder="刷新周期：20秒"
    :options="PrpsTimeScaleOption"
    :show-all-levels="false"
    @change="ChangePrpsTimescale"
  />
  <el-cascader
    placeholder="图表状态：固定"
    :options="fixOrfreshOption"
    :show-all-levels="false"
    @change="ChangefixOrfresh"
  />
  <el-cascader
    placeholder="光标：未启用"
    :options="cursorStateOption"
    :show-all-levels="false"
    @change="ChangecursorstateOption"
  />
  <el-cascader
    v-if="Cursorstate == '1'"
    placeholder="光标：PRPD图谱"
    :options="ChartUsingCursorOption"
    :show-all-levels="false"
    @change="ChangeChartUsingCursor"
  />
</template>

<script setup>
import { watch, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const PrpsTimeScale = ref();
const fixOrfresh = ref();
const Cursorstate = ref();
const ChartUsingCursor = ref();
const PrpsTimeScaleOption = [
  {
    value: "5",
    label: "刷新周期：5秒",
  },
  {
    value: "10",
    label: "刷新周期：10秒",
  },
  {
    value: "20",
    label: "刷新周期：20秒",
  },
  {
    value: "50",
    label: "刷新周期：50秒",
  },
];
const fixOrfreshOption = [
  {
    value: "0",
    label: "图表状态：固定",
  },
  {
    value: "1",
    label: "图表状态：刷新",
  },
];
const cursorStateOption = [
  {
    value: "0",
    label: "光标：未启用",
  },
  {
    value: "1",
    label: "光标：启用",
  },
];
const ChartUsingCursorOption = [
  {
    value: "0",
    label: "光标：PRPD图谱",
  },
  {
    value: "1",
    label: "光标：PRPS图谱",
  },
];
const ChangePrpsTimescale = (value) => {
  PrpsTimeScale.value = value[0];
  store.commit("app/setPrpsTimescale", PrpsTimeScale.value);
  console.log(store.getters.PrpsTimeScale);
};
const ChangefixOrfresh = (value) => {
  fixOrfresh.value = value[0];
  store.commit("app/setfixOrfresh", fixOrfresh.value);
  console.log(store.getters.fixOrfresh);
};
const ChangecursorstateOption = (value) => {
  Cursorstate.value = value[0];
  store.commit("app/setCursorstate", Cursorstate.value);
  console.log(store.getters.Cursorstate);
};
const ChangeChartUsingCursor = (value) => {
  ChartUsingCursor.value = value[0];
  store.commit("app/setChartUsingCursor", ChartUsingCursor.value);
  console.log(store.getters.ChartUsingCursor);
};
</script>

<style></style>
