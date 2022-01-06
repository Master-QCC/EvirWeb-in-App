<template>
  <div class="chart-line" ref="line"></div>
</template>

<script>
import echarts from "echarts";

export default {
  props: ["lineData"],
  data() {
    return {
      lineChart: "",
      lineData: "",
      option: {
        tooltip: {
          trigger: "axis",
          backgroundColor: "#F9F9F9",
          textStyle: {
            color: "#393C43"
          },
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "32px",
          left: "32px",
          right: "0"
        },
        legend: {
          selectedMode: false,
          left: "center",
          bottom: "0",
          textStyle: {
            color: "#393C43"
          },
          data: ["正常", "异常", "漏检", "标签异常"]
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            axisLabel: {
              color: "#393C43"
            },
            axisLine: {
              lineStyle: {
                color: "#1B367C"
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#393C43"
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "#1B367C"
              }
            }
          }
        ],
        series: [
          {
            name: "正常",
            type: "bar",
            barGap: 1,
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              normal: {
                borderRadius: [10, 10, 0, 0],
                color: "#00B02F"
              }
            },
            data: []
          },
          {
            name: "异常",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              normal: {
                borderRadius: [10, 10, 0, 0],
                color: "#F47004"
              }
            },
            data: []
          },
          {
            name: "漏检",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              normal: {
                borderRadius: [10, 10, 0, 0],
                color: "#F5D370"
              }
            },
            data: []
          },
          {
            name: "标签异常",
            type: "bar",
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              normal: {
                borderRadius: [10, 10, 0, 0],
                color: "#48008b"
              }
            },
            data: []
          }
        ]
      }
    };
  },
  watch: {
    lineData() {
      this.reflashEchart();
    }
  },
  methods: {
    getOption() {
      let option = this.option;
      this.option.xAxis[0].data = this.lineData.daysList;
      this.option.series[0].data = this.lineData.normalCountList;
      this.option.series[1].data = this.lineData.abnormalCountList;
      this.option.series[2].data = this.lineData.missedInspectList;
      this.option.series[3].data = this.lineData.labelExCountList;
      return option;
    },
    initEchart() {
      let line = this.$refs.line;
      this.lineChart = this.$echarts.init(line);
      let option = this.getOption();
      this.lineChart.setOption(option);
    },
    reflashEchart() {
      let option = this.getOption();
      this.lineChart.setOption(option);
    },
    resizeEchart() {
      this.lineChart.resize();
    }
  },
  mounted() {
    this.initEchart();
    this.lineData = {
      daysList: ["11/30", "12/01", "12/02", "12/03", "12/04", "12/05", "12/06"],
      abnormalCountList: [0, 0, 2, 0, 0, 0, 0],
      normalCountList: [0, 0, 7, 0, 0, 0, 0],
      missedInspectList: [550, 550, 541, 550, 550, 550, 550],
      labelExCountList: [0, 0, 0, 0, 0, 0, 0]
    };
    window.onresize = () => {
      this.resizeEchart();
    };
  }
};
</script>

<style lang="scss" scoped>
.chart-line {
  width: 100%;
  height: 380px;
  position: relative;
}
</style>
