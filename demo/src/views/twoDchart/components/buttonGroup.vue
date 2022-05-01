<template>
  <el-cascader
    placeholder="采样时长:20秒"
    :options="PrpsTimeScaleOption"
    :show-all-levels="false"
    @change="ChangePrpsTimescale"
  />

  <el-cascader
    placeholder="光标：未启用"
    :options="cursorStateOption"
    :show-all-levels="false"
    @change="ChangecursorstateOption"
  />
  <el-select
    v-model="ChartType"
    multiple
    multiple-limit="2"
    class="m-2"
    placeholder="显示图谱：AP PQ"
    @change="ChangeChartTypeOption"
  >
    <el-option
      v-for="item in ChartTypeOption"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <!-- <el-cascader
    placeholder="显示图谱：AP PQ"
    :options="ChartTypeOption"
    :show-all-levels="false"
    @change="ChangeChartTypeOption"
  /> -->
</template>

<script setup>
import { watch, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const PrpsTimeScale = ref();
const Cursorstate = ref();
const ChartType = ref([]);
const PrpsTimeScaleOption = [
  {
    value: "10",
    label: "采样时长：10秒",
  },
  {
    value: "20",
    label: "采样时长：20秒",
  },
  {
    value: "50",
    label: "采样时长：50秒",
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
const ChartTypeOption = [
  {
    value: "AP",
    label: "AP",
  },
  {
    value: "PQ",
    label: "PQ",
  },
  {
    value: "CILCULAR",
    label: "CILCULAR",
  },
];
const ChangePrpsTimescale = (value) => {
  PrpsTimeScale.value = value[0];
  store.commit("app/setPrpsTimescale", PrpsTimeScale.value);
  console.log(store.getters.PrpsTimeScale);
};

const ChangecursorstateOption = (value) => {
  Cursorstate.value = value[0];
  store.commit("app/setCursorstate", Cursorstate.value);
  console.log(store.getters.Cursorstate);
};
const ChangeChartTypeOption = (value) => {
  ChartType.value = value;
  store.commit("app/setChartType", ChartType.value);
  console.log(store.getters.ChartType);
};
</script>

<style></style>
