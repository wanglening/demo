<template>
  <div class="echart" id="echart-line-cilcular" style=""></div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import {
  getapDataLimit as getAPDataLimit,
  getapData as getAPData,
} from "@/api/pddata";

function generateData() {
  let circularData = [];
  for (let i = 0; i <= 360; i += 5) {
    circularData.push([
      Math.sin((i / 180) * Math.PI),
      Math.cos((i / 180) * Math.PI),
    ]);
  }
  return circularData;
}
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
function circularTransfomer(data) {
  // eslint-disable-next-line
  let len = eval(data).length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr[i] = [];
    arr[i][0] = Math.cos((data[i][0] / 180) * Math.PI).toPrecision(3);
    arr[i][1] = (
      data[i][1] / 10000 +
      Math.sin((data[i][0] / 180) * Math.PI)
    ).toPrecision(3);
    arr[i][2] = (
      -data[i][1] / 10000 +
      Math.sin((data[i][0] / 180) * Math.PI)
    ).toPrecision(3);
  }
  return arr;
}
export default {
  data() {
    return {
      circular_Data1: [],
      circular_Data2: [],
    };
  },
  computed: {
    PrpsTimeScale() {
      return this.$store.getters.PrpsTimeScale;
    },
  },
  mounted() {
    this.getapData();
  },
  methods: {
    getapData() {
      // getAPData().then((response) => {
      //   let res = response.data;
      //   this.scatter_apdata = jsonArray(res.result);
      // });
      getAPDataLimit({
        timeLimit: this.PrpsTimeScale ? this.PrpsTimeScale : 20,
      }).then(async (response) => {
        let res = response.data;
        this.circular_Data1 = [];
        this.circular_Data2 = [];
        this.scatter_apdata = await jsonArray(res.result);
        this.circular_Data = await circularTransfomer(this.scatter_apdata);
        this.circular_Data.forEach((arr, index) => {
          this.circular_Data1[index] = [arr[0], arr[1]];
          this.circular_Data2[index] = [arr[0], arr[2]];
        });
        this.drawChart();
      });
    },
    drawChart() {
      let that = this;
      const getchart = echarts.init(
        document.getElementById("echart-line-cilcular")
      );
      let option = {
        animation: false,
        tooltip: {
          trigger: "",
          axisPointer: {
            type: "cross",
          },
        },
        xAxis: [
          {
            name: "",
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: false,
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
            name: "",
            axisLabel: {
              formatter: "{value} mv",
            },
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
            showSymbol: false,
            clip: true,
            data: generateData(),
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {},
          },
          {
            type: "bar",
            data: this.circular_Data1,
            xAxisIndex: 0,
            yAxisIndex: 0,
            z: "0",
            barWidth: 2,
          },
          {
            type: "bar",
            data: this.circular_Data2,
            xAxisIndex: 0,
            yAxisIndex: 0,
            barWidth: 2,
            z: "1",
            barGap: "-100%",
            itemStyle: {
              color: "lightgrey",
            },
          },
        ],
      };
      console.log("change");
      getchart.clear();
      getchart.setOption(option);
    },
  },
  watch: {
    PrpsTimeScale: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getapData();
      },
    },
  },
};
</script>
