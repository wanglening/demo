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
      cursordataindex: [],
      prpdclickpointdata: [
        [0, 0, 0],
        [0, 0, 0],
      ],
    };
  },
  mounted() {
    this.getpanData();
  },
  computed: {
    PrpdClickPointdata() {
      return this.$store.getters.PrpdClickPointdata;
    },
    Cursorstate() {
      return this.$store.getters.Cursorstate;
    },
  },
  methods: {
    // getpanData() {
    //   axios.get("http://localhost:3000/pddata/datapan").then((response) => {
    //     let res = response.data;
    //     this.scatter_pandata = jsonArray(res.result);
    //   });
    // },
    getpanData() {
      getPANData().then(async (response) => {
        let res = response.data;
        this.scatter_pandata = await jsonArray(res.result);
        this.drawChart();
      });
    },
    drawChart() {
      let that = this;
      const getchart = echarts.init(document.getElementById("echart-line-pan"));
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
          axisLabel: {
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
          axisLabel: {
            formatter: "{value} ",
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
            name: "PRPD",
            type: "bar3D",
            data: this.scatter_pandata,
            shading: "color",
            barSize: 0.8,
            itemStyle: {
              color(params) {
                let colorList = [];
                if (that.cursordataindex.includes(params.dataIndex)) {
                  colorList[params.dataIndex] = "#007DFF";
                } else {
                  colorList[params.dataIndex] = "black";
                }
                return colorList[params.dataIndex];
              },
            },
          },
        ],
      };
      getchart.clear();
      getchart.setOption(option);

      if (this.Cursorstate == 1) {
        if (!getchart._$handlers) {
          getchart.on("click", function (params) {
            that.prpdclickpointdata.push(params.data);
            that.prpdclickpointdata.shift();
            that.cursordataindex.push(params.dataIndex);
            if (that.cursordataindex.length > 2) {
              that.cursordataindex.shift();
            }

            that.$store.commit(
              "app/setPrpdClickPointdata",
              that.prpdclickpointdata
            );
            console.log(that.PrpdClickPointdata);
          });
        }
      }
    },
  },
  watch: {
    PrpdTimeScale: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getpanData();
      },
    },
    Cursorstate: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getpanData();
      },
    },
    cursordataindex: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getpanData();
      },
    },
  },
};
</script>
