<template>
  <div class="echart" id="echart-line-prps"></div>
</template>

<script>
import * as echarts from "echarts";
import { useStore } from "vuex";
import {
  getprpsDataLimit as getPRPSDataLimit,
  getprpsData as getPRPSData,
} from "@/api/pddata";
import "echarts-gl";

const store = useStore();
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
      scatter_prpsdata: [],
      timer: null,
    };
  },
  computed: {
    PrpsTimeScale() {
      return this.$store.getters.PrpsTimeScale;
    },
  },
  mounted() {
    this.getprpsData();
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
    // getprpsData() {
    //   getPRPSData().then((response) => {
    //     let res = response.data;
    //     this.scatter_prpsdata = jsonArray(res.result);
    //   });
    // },
    getprpsData() {
      getPRPSDataLimit({
        timeLimit: this.PrpsTimeScale ? this.PrpsTimeScale : 20,
      }).then((response) => {
        let res = response.data;
        this.scatter_prpsdata = jsonArray(res.result);
      });
    },
    reFresh() {
      this.timer = setInterval(() => {
        this.getprpsData();
        console.log(this.PrpsTimeScale);
        const getchart = echarts.init(
          document.getElementById("echart-line-prps")
        );
        let option = {
          title: {
            // 标题设置
            text: "PRPS图谱", // 标题文字
            left: 250,
          },
          tooltip: {
            alwaysShowContent: false,
          },
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
            axisLabel: {
              formatter: "{value} °",
              align: "center",
            },
          },
          yAxis3D: {
            name: `T=${this.PrpsTimeScale ? this.PrpsTimeScale : 20}`,
            min: 0,
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
            name: "Q",
            axisLabel: {
              formatter: "",
              align: "center",
            },
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
              data: this.scatter_prpsdata,
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
