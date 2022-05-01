//定时刷新实现实时渲染表格数据
<template>
  <div class="echart" id="echart-line-pan" style=""></div>
</template>

<script>
import * as echarts from "echarts";
// import axios from "axios";
import { getpanData as getPANData } from "@/api/pddata";
import "echarts-gl";
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
      scatter_pandata: [],
      timer: null,
    };
  },
  mounted() {
    this.getpanData();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    // getpanData() {
    //   axios.get("http://localhost:3000/pddata/datapan").then((response) => {
    //     let res = response.data;
    //     this.scatter_pandata = jsonArray(res.result);
    //   });
    // },
    getpanData() {
      getPANData().then((response) => {
        let res = response.data;
        this.scatter_pandata = jsonArray(res.result);
      });
    },
    reFresh() {
      this.timer = setInterval(() => {
        const getchart = echarts.init(
          document.getElementById("echart-line-pan")
        );
        let option = {
          title: {
            // 标题设置
            text: "PRPD图谱", // 标题文字
            left: 250,
          },
          tooltip: {},
          xAxis3D: {
            name: "phase",
            min: 0,
            max: 360,
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: true,
            },
            isLabel: {
              formatter: "{value} °",
              align: "center",
            },
          },
          yAxis3D: {
            name: "Ample",
            min: 0,
            max: 128,
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: true,
            },
            axisLabel: {
              formatter: "{value} ",
              align: "center",
            },
          },
          zAxis3D: {
            name: "n",
          },
          grid3D: {
            show: true,
            zlevel: -10,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            boxWidth: 100,
            boxHeight: 100,
            boxDepth: 100,
          },
          series: [
            {
              type: "bar3D",
              data: this.scatter_pandata,
              shading: "lambert",
            },
          ],
        };
        getchart.clear();
        getchart.setOption(option);
      }, 1000);
    },
  },
};
</script>
