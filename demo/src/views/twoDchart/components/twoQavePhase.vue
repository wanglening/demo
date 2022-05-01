<template>
  <div class="echart" id="echart-lineQzvephase" style=""></div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import {
  getpqDataLimit as getPQDataLimit,
  getpqData as getPQData,
} from "@/api/pddata";

function jsonArray(data) {
  // eslint-disable-next-line
  let len = eval(data).length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr[i] = [];
    for (let key in data[i]) {
      arr[i].push(data[i][key]);
    }
  }
  return arr;
}

export default {
  data() {
    return {
      scatter_pqdata: [],
    };
  },
  computed: {},
  mounted() {
    this.getpqData();
  },
  methods: {
    getpqData() {
      getPQDataLimit({
        timeLimit: this.PrpsTimeScale ? this.PrpsTimeScale : 20,
      }).then(async (response) => {
        let res = response.data;
        this.scatter_pqdata = await jsonArray(res.result);

        this.drawChart();
      });
    },
    drawChart() {
      let that = this;
      const getchart = echarts.init(
        document.getElementById("echart-lineQzvephase")
      );
      let option = {
        animation: false,
        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
        grid: { width: "80%", height: "80%" },
        xAxis: [
          {
            name: "phase",
            min: 0,
            max: 360,
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: true,
            },
            axisPointer: {
              label: {
                formatter: "{value} °",
              },
            },
            axisLabel: {
              formatter: "{value} °",
              align: "center",
            },
          },
        ],
        yAxis: [
          {
            name: "Qave (10^(-10))",

            axisLabel: {
              formatter: "{value} c",
            },
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: true,
            },
          },
        ],
        dataZoom: [],
        series: [
          {
            type: "bar",
            data: this.scatter_pqdata,
            symbolSize: 5,
          },
        ],
      };
      getchart.clear();
      getchart.setOption(option);
    },
  },
  watch: {},
};
</script>
