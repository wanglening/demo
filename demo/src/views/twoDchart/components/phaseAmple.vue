<template>
  <div class="echart" id="echart-line" style=""></div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import {
  getpqDataLimit as getPQDataLimit,
  getapDataLimit as getAPDataLimit,
  getapData as getAPData,
  getpqData as getPQData,
} from "@/api/pddata";
function func(x) {
  return 4000 * Math.sin(x);
}

function generateData() {
  let sinData = [];
  for (let i = 0; i <= 360; i += 5) {
    sinData.push([i, func((i / 180) * Math.PI)]);
  }
  return sinData;
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

export default {
  data() {
    return {
      scatter_apdata: [],
      scatter_pqdata: [],
      cursordataindex: [],
      phaseample_clickpointdata: [
        [0, 0],
        [0, 0],
      ],
    };
  },
  computed: {
    PrpsTimeScale() {
      return this.$store.getters.PrpsTimeScale;
    },
    Cursorstate() {
      return this.$store.getters.Cursorstate;
    },
  },
  mounted() {
    this.getapData();
    this.getpqData();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    getapData() {
      // getAPData().then((response) => {
      //   let res = response.data;
      //   this.scatter_apdata = jsonArray(res.result);
      // });
      getAPDataLimit({
        timeLimit: this.PrpsTimeScale ? this.PrpsTimeScale : 20,
      }).then((response) => {
        let res = response.data;
        this.saveArray(res.result, this.scatter_apdata).then((data) => {
          if (data) {
            this.drawChart();
          }
        });
      });
    },
    async saveArray(data, area) {
      if (area == this.scatter_apdata) {
        this.scatter_apdata = await jsonArray(data);
      } else {
        this.scatter_pqdata = await jsonArray(data);
      }
      return 1;
    },
    getpqData() {
      getPQDataLimit({
        timeLimit: this.PrpsTimeScale ? this.PrpsTimeScale : 20,
      }).then((response) => {
        let res = response.data;
        this.saveArray(res.result, this.scatter_pqdata).then((data) => {
          if (data) {
            this.drawChart();
          }
        });
      });
    },
    drawChart() {
      let that = this;
      const getchart = echarts.init(document.getElementById("echart-line"));
      let option = {
        animation: false,
        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
        grid: [
          { right: "7%", top: "7%", width: "38%", height: "80%" },
          { left: "7%", top: "7%", width: "38%", height: "80%" },
        ],
        xAxis: [
          {
            name: "phase",
            min: 0,
            max: 360,
            gridIndex: 0,
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
          {
            name: "phase",
            min: 0,
            max: 360,
            gridIndex: 1,
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
            name: "Ample",
            min: -4000,
            max: 4000,
            gridIndex: 0,
            axisLabel: {
              formatter: "{value} mv",
            },
            minorTick: {
              show: true,
            },
            minorSplitLine: {
              show: true,
            },
          },
          {
            name: "Qave (10^(-10))",
            gridIndex: 1,
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
        dataZoom: [
          {
            show: true,
            type: "inside",
            filterMode: "none",
            xAxisIndex: 0,
            startValue: 0,
            endValue: 360,
          },
          {
            show: true,
            type: "inside",
            filterMode: "none",
            yAxisIndex: 0,
            startValue: -4000,
            endValue: 4000,
          },
        ],
        series: [
          {
            type: "line",
            showSymbol: false,
            xAxisIndex: 0,
            yAxisIndex: 0,
            clip: true,
            data: generateData(),
            itemStyle: {
              lineStyle: {
                width: 1,
              },
            },
          },
          {
            type: "scatter",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.scatter_apdata,
            symbolSize: 5,
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
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.scatter_pqdata,
            symbolSize: 5,
          },
        ],
      };
      getchart.clear();
      getchart.setOption(option);

      if (this.Cursorstate == 1) {
        if (!getchart._$handlers) {
          getchart.on("click", function (params) {
            that.phaseample_clickpointdata.push(params.data);
            that.phaseample_clickpointdata.shift();
            that.cursordataindex.push(params.dataIndex);
            if (that.cursordataindex.length > 2) {
              that.cursordataindex.shift();
            }
            that.$store.commit(
              "app/setPhaseAmplePointdata",
              that.phaseample_clickpointdata
            );
            console.log(that.phaseample_clickpointdata);
          });
        }
      }
    },
  },
  watch: {
    PrpsTimeScale: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getpqData();
        this.getapData();
      },
    },
    Cursorstate: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getpqData();
        this.getapData();
      },
    },
    cursordataindex: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getpqData();
        this.getapData();
      },
    },
  },
};
</script>
