<template>
  <div class="vehicle-score" ref="score"></div>
</template>

<script>

export default {
  props: {
    scoreData: Number
  },
  data() {
    return {
      scoreChart: "",
      scoreData: 0,
      option: {
        tooltip: {
          formatter: '{a}：<br/>{b} {c}分'
        },
        grid:{
          left: '2px',
          right: '2px',
          top: '2px',
          bottom: '2px',
        },
        series: [
          {
            name: '车辆状况',
            type: 'gauge',
            progress: {
              show: true,
              roundCap: true,
              width: 16
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 18
              }
            },
            axisLabel: {
              distance: 30,
              color: '#393C43',
              fontSize: 16
            },
            itemStyle: {
              color: '#003DE3',
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            pointer: {
              icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
              length: '70%',
              width: 12,
              offsetCenter: [0, '5%']
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}',
              borderRadius: 8,
              fontSize: 40,
              color: '#003DE3',
            },
            data: [
              {
                value: 0
              }
            ]
          }
        ]
      }
    };
  },
  watch: {
    scoreData(){
      this.reflashEchart();
    },
  },
  methods: {
    getOption() {
      let option = this.option;
      this.option.series[0].data[0].value = this.scoreData;
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
    },
  },
  mounted() {
    this.initEchart();
    window.onresize = () => {
      this.resizeEchart();
    }
  },
  activated() {

  }
};
</script>

<style lang="scss" scoped>
.vehicle-score {
  width: 100%;
  height: 340px;
  position: relative;
  overflow: hidden;
}
</style>
