<template>
  <div class="vehicle-score" ref="score"></div>
</template>

<script>
export default {
  data() {
    return {
      scoreChart: "",
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            minAngle: 15,
            radius: ['30%', '60%'],
            center: ["50%", "50%"],
            itemStyle: {
              borderRadius: 0
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 8
              }
            },
            label: {
              normal: {
                formatter(v) {
                  let text = v.name;
                  let value =  v.value;
                  if (text.length <= 3) {
                    return `${text}\n${value}`;
                  } else if (text.length > 3 && text.length <= 6) {
                    return text = `${text.slice(0, 3)}\n${text.slice(3)}\n${value}`
                  } else if (text.length > 6 && text.length <= 9) {
                    return text = `${text.slice(0, 3)}\n${text.slice(3, 6)}\n${text.slice(6)}\n${value}`
                  }
                }
              }
            },
            data: [
              { value: 40, name: "前部" },
              { value: 30, name: "前卫翻起" },
              { value: 32, name: "左侧前轴附近" },
              { value: 40, name: "右侧前轴附近" },
              { value: 28, name: "工作平台" },
              { value: 26, name: "底盘" },
              { value: 22, name: "左侧中后桥" },
              { value: 18, name: "右侧中后桥" }
            ]
          }
        ]
      }
    };
  },
  methods: {
    getOption() {
      let option = this.option;
      return option;
    },
    initEchart() {
      let score = this.$refs.score;
      this.scoreChart = this.$echarts.init(score);
      let option = this.getOption();
      this.scoreChart.setOption(option);
    },
    reflashEchart() {
      let option = this.getOption();
      this.scoreChart.setOption(option);
    },
    resizeEchart() {
      this.scoreChart.resize();
    }
  },
  mounted() {
    this.initEchart();
    window.onresize = () => {
      this.resizeEchart();
    };
  }
};
</script>

<style lang="scss" scoped>
.vehicle-score {
  margin-top: -1rem;
  width: 100%;
  height: 330px;
  position: relative;
  overflow: hidden;
}
</style>
