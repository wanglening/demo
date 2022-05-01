<template>
  <div class="echart" id="echart-line-prps"></div>
</template>

<script>
import * as echarts from "echarts";
import { useStore } from "vuex";
import {
  getTestPrpsDataLimit as getTESTPRPSDataLimit,
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
      flag: false, // 标注曾经由fix转为fresh 或 刷新是由于timescale变化导致的 控制是否重新申请数据
      timer: null,
      prpsdisplayrange: 100,
      scatter_prpsdata: [],
      cursordataindex: [],
      orderLimit: [0, 20], // 下限，上限
      prpsclickpointdata: [
        [0, 0, 0],
        [0, 0, 0],
      ],
    };
  },
  computed: {
    PrpsTimeScale() {
      // 读取数据的时间大小
      return this.$store.getters.PrpsTimeScale;
    },
    PrpsClickPointdata() {
      return this.$store.getters.PrpsClickPointdata;
    },
    Cursorstate() {
      return this.$store.getters.Cursorstate;
    },
    fixOrfresh() {
      return this.$store.getters.fixOrfresh;
    },
  },
  mounted() {
    this.getprpsData();
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
      if (this.fixOrfresh == 0) {
        if (this.flag == false) {
          getTESTPRPSDataLimit({
            timeLimit: this.PrpsTimeScale,
            ifDelete: 0,
            orderLimit: this.orderLimit,
          }).then(async (response) => {
            let res = response.data;
            this.scatter_prpsdata = await jsonArray(res.result);
            this.drawChart();
          });
        } else {
          this.drawChart();
        }
      } else {
        clearInterval(this.timer);
        console.log("clearInterval");
        this.timer = setInterval(() => {
          getTESTPRPSDataLimit({
            timeLimit: this.PrpsTimeScale,
            ifDelete: 0,
            orderLimit: this.orderLimit,
          }).then(async (response) => {
            console.log(this.orderLimit);
            let res = response.data;
            this.orderLimit[0] =
              parseInt(this.orderLimit[0]) + parseInt(this.PrpsTimeScale);
            this.orderLimit[1] =
              parseInt(this.orderLimit[0]) + parseInt(this.PrpsTimeScale);

            let array = await jsonArray(res.result);
            this.scatter_prpsdata = this.scatter_prpsdata.concat(array);
            this.drawChart();
            this.flag = true;
          });
        }, this.PrpsTimeScale * 1000);
      }
    },
    drawChart() {
      let that = this; // 保存this指向是函数的内部函数可以获取this指针
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
          name: `刷新周期T=${this.PrpsTimeScale}`,
          max: (value) => {
            return value.max;
          },
          min: (value) => {
            return value.min;
          },

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
            formatter: function (value) {
              var res = value.toString();
              var numN1 = 0;
              var numN2 = 1;
              var num1 = 0;
              var num2 = 0;
              var t1 = 1;
              for (var k = 0; k < res.length; k++) {
                if (res[k] === ".") t1 = 0;
                if (t1) num1++;
                else num2++;
              }

              if (Math.abs(value) < 1 && res.length > 4) {
                for (var i = 2; i < res.length; i++) {
                  if (res[i] === "0") {
                    numN2++;
                  } else if (res[i] === ".") continue;
                  else break;
                }
                var v = parseFloat(value);
                v = v * Math.pow(10, numN2);
                return v.toString() + "e-" + numN2;
              } else if (num1 > 4) {
                if (res[0] === "-") numN1 = num1 - 2;
                else numN1 = num1 - 1;
                var v = parseFloat(value);
                v = v / Math.pow(10, numN1);
                if (num2 > 4) v = v.toFixed(4);
                return v.toString() + "e" + numN1;
              } else return parseFloat(value);
            },
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
            name: "PRPS",
            type: "bar3D",
            data: this.scatter_prpsdata,
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
            that.prpsclickpointdata.push(params.data);
            that.prpsclickpointdata.shift();
            that.cursordataindex.push(params.dataIndex);
            if (that.cursordataindex.length > 2) {
              that.cursordataindex.shift();
            }
            that.$store.commit(
              "app/setPrpsClickPointdata",
              that.prpsclickpointdata
            );
          });
        }
      }
    },
  },
  watch: {
    PrpsTimeScale: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (this.fixOrfresh == 0) {
          this.orderLimit = [0, this.PrpsTimeScale];
          console.log("watch PrpsTimeScale", this.PrpsTimeScale);
          this.getprpsData();
        } else {
          this.orderLimit[0] =
            parseInt(this.orderLimit[1]) - parseInt(this.PrpsTimeScale);
          this.orderLimit[1] =
            parseInt(this.orderLimit[0]) + parseInt(this.PrpsTimeScale);
          this.getprpsData();
        }
      },
    },
    Cursorstate: {
      deep: true,
      handler: function (newValue, oldValue) {
        this.getprpsData();
      },
    },
    cursordataindex: {
      deep: true,
      handler: function (newValue, oldValue) {
        this.getprpsData();
      },
    },
    fixOrfresh: {
      deep: true,
      handler: function (newValue, oldValue) {
        if (this.fixOrfresh == 0) {
          console.log("clearInterval");
          clearInterval(this.timer);
        }
        this.getprpsData();
      },
    },
  },
};
</script>
