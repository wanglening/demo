<template>
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
          光标间距离：{{
            [
              (
                PhaseAmplePointdata[1][0] - PhaseAmplePointdata[0][0]
              ).toPrecision(5),
              (
                PhaseAmplePointdata[1][1] - PhaseAmplePointdata[0][1]
              ).toPrecision(5),
            ]
          }}
        </div>
      </div>
      <div class="Own_tableContainer">
        <div v-if="Cursorstate == 1" class="curse_distanse">
          光标1：{{ PhaseAmplePointdata[0] }} 光标2：{{
            PhaseAmplePointdata[1]
          }}
        </div>
      </div>
      <div class="Own_chartContainer">
        <twoPhaseAmple
          v-if="showAP != -1"
          ref="chart_line_one"
          class="Chart1"
        ></twoPhaseAmple>

        <twoQavePhase
          v-if="showPQ != -1"
          ref="chart_line_two"
          class="Chart1"
        ></twoQavePhase>
        <twoCircular
          v-if="showCilcular != -1"
          ref="chart_line_three"
          class="Chart1"
        ></twoCircular>
      </div>
    </div>
    <div class="Own_buttoncontainer">
      <buttonGroup></buttonGroup>
    </div>
  </div>
</template>

<script>
import twoPhaseAmple from "./components/twoPhaseAmple.vue";
import twoQavePhase from "./components/twoQavePhase.vue";
import twoCircular from "./components/twoCircular.vue";
import buttonGroup from "./components/buttonGroup.vue";
export default {
  data() {
    return {
      name: "PRPD",
      frequency: 0,
      showAP: 1,
      showPQ: 1,
      showCilcular: 0,
    };
  },
  computed: {
    Cursorstate() {
      return this.$store.getters.Cursorstate;
    },
    PhaseAmplePointdata() {
      return this.$store.getters.PhaseAmplePointdata;
    },
    ChartType() {
      return this.$store.getters.ChartType;
    },
  },
  mounted() {
    this.$refs.chart_line_one.getapData();
    this.$refs.chart_line_two.getpqData();
  },
  components: {
    twoPhaseAmple,
    twoQavePhase,
    buttonGroup,
    twoCircular,
  },
  watch: {
    ChartType: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        this.showAP = this.ChartType.indexOf("AP");
        this.showPQ = this.ChartType.indexOf("PQ");
        this.showCilcular = this.ChartType.indexOf("CILCULAR");
      },
    },
  },
};
</script>
<style scoped>
.container {
  width: 1500px;
  height: 1050px;
  display: flex;
  position: inherit;
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
.Own_tableContainer {
  display: -webkit-flex;
  display: flex;
  background-color: lightgrey;
  width: 100%;
  height: 550px;
}
.Own_buttoncontainer {
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
  width: 200px;
  border: 1px solid;
}
.Chart1 {
  width: 600px;
  height: 600px;
  display: flex;
  border: 1px solid;
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
