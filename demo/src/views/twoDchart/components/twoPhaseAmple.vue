<template>
  <div class="echart" id="echart-line-phaseample" style=""></div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import {
  getapDataLimit as getAPDataLimit,
  getapData as getAPData,
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
        this.scatter_apdata = await jsonArray(res.result);
        this.drawChart();
      });
    },
    drawChart() {
      let that = this;
      const getchart = echarts.init(
        document.getElementById("echart-line-phaseample")
      );
      let option = {
        animation: false,
        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
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
            name: "Ample",
            min: -4000,
            max: 4000,
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
        ],
        dataZoom: [
          {
            show: true,
            type: "inside",
            filterMode: "none",
            startValue: 0,
            endValue: 360,
          },
          {
            show: true,
            type: "inside",
            filterMode: "none",
            startValue: -4000,
            endValue: 4000,
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
            itemStyle: {
              lineStyle: {
                width: 1,
              },
            },
          },
          {
            type: "scatter",
            data: this.scatter_apdata,
            xAxisIndex: 0,
            yAxisIndex: 0,
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
        this.getapData();
      },
    },
    Cursorstate: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getapData();
      },
    },
    cursordataindex: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getapData();
      },
    },
  },
};
</script>
