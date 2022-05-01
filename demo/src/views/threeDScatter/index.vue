<template>
  <div>
    <div class="container">
      <div class="tablechartcontainer">
        <div class="Own_tableContainer">
          <div class="radius">频率:{{ frequency }}HZ</div>
          <div class="radius">电压:{{ frequency }}mV</div>
          <div class="radius">相移:{{ frequency }}°</div>
          <div class="radius">前置增益：×{{ frequency }}</div>
          <div class="radius">主增益：×{{ frequency }}</div>
        </div>
        <div class="Own_tableContainer">
          <div v-if="Cursorstate == 1" class="curse_distanse">
            光标间距离：{{ curse_distanse }}
          </div>
        </div>
        <div class="Own_tableContainer">
          <div v-if="Cursorstate == 1" class="curse_distanse">
            光标1：{{
              this.ChartUsingCursor == "1"
                ? this.PrpsClickPointdata[0]
                : this.PrpdClickPointdata[0]
            }}
            光标2：{{
              this.ChartUsingCursor == "1"
                ? this.PrpsClickPointdata[1]
                : this.PrpdClickPointdata[1]
            }}
          </div>
        </div>
        <div class="Own_chartContainer">
          <threeDPRPD ref="chart_line_one" class="Chart1"></threeDPRPD>
          <threeDPRPS ref="chart_line_two" class="Chart2"></threeDPRPS>
        </div>
      </div>
      <div class="Own_buttoncontainer">
        <buttonGroup></buttonGroup>
      </div>
    </div>
  </div>
</template>

<script>
import threeDPRPD from "./components/threeDPRPD.vue";
import threeDPRPS from "./components/threeDPRPS.vue";
import buttonGroup from "./components/buttonGroup";
export default {
  data() {
    return {
      frequency: 50,
      cursor: [],
    };
  },
  computed: {
    PrpsClickPointdata() {
      return this.$store.getters.PrpsClickPointdata;
    },
    PrpdClickPointdata() {
      return this.$store.getters.PrpdClickPointdata;
    },
    ChartUsingCursor() {
      return this.$store.getters.ChartUsingCursor;
    },
    curse_distanse() {
      let newArray = [];
      let curSor0 = [];
      let curSor1 = [];
      if (this.ChartUsingCursor == 1) {
        curSor0 = this.PrpsClickPointdata[0];
        curSor1 = this.PrpsClickPointdata[1];
        for (let item in curSor1) {
          newArray[item] = (curSor1[item] - curSor0[item]).toPrecision(5);
        }
      } else {
        curSor0 = this.PrpdClickPointdata[0];
        curSor1 = this.PrpdClickPointdata[1];
        for (let item in curSor1) {
          newArray[item] = (curSor1[item] - curSor0[item]).toPrecision(5);
        }
      }
      return newArray;
    },
    Cursorstate() {
      return this.$store.getters.Cursorstate;
    },
  },
  mounted() {
    // this.$refs.chart_line_one.reFresh();
    this.$refs.chart_line_one.drawChart();
    // this.$refs.chart_line_two.reFresh();
    this.$refs.chart_line_two.drawChart();
  },
  components: {
    threeDPRPD,
    threeDPRPS,
    buttonGroup,
  },
};
</script>
<style scoped>
.container {
  width: 1500px;
  display: flex;
  flex-direction: row;
}
.tablechartcontainer {
  width: 1200px;
  display: flex;
  flex-direction: column;
}
.Own_chartContainer {
  display: -webkit-flex;
  display: flex;
  background-color: lightgrey;
  width: 1200px;
  height: 600px;
}
.Own_buttoncontainer {
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
  width: 200px;
}
.Chart1 {
  border: 1px solid;
  width: 600px;
  height: 600px;
}
.Chart2 {
  border: 1px solid;
  width: 600px;
  height: 600px;
}
.Own_tableContainer {
  display: -webkit-flex;
  display: flex;
  background-color: lightgrey;
  width: 100%;
  height: 150px;
}
.radius {
  position: relative;
  font-size: 30px;
  height: 50px;
  width: 300px;
  border: 1px solid;
  border-radius: 3px;
}
.curse_distanse {
  position: relative;
  font-size: 30px;
  height: 50px;
  width: 1200px;
  border: 1px solid;
  border-radius: 3px;
}
</style>
