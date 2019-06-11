<template>
  <div :id="chartId" style="width: 100%; height: 100%;"></div>
</template>

<script>
var echarts = require('echarts');
export default {
  data() {
    return {
      chartId: 'para_axis' + this.$util.randomString(),
      option: {
        backgroundColor: '#333',
        parallelAxis: [],
        // visualMap: {},
        parallel: {
          left: '5%',
          right: '5%',
          bottom: 100,
          parallelAxisDefault: {
            type: 'value',
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
              color: '#fff',
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: '#aaa'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#777'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        },
        series: []
      }
    }
  },
  methods: {
    paint(optionData) {
      var myChart = echarts.init(document.getElementById(this.chartId));
      this.option.parallelAxis = optionData.parallelAxis;
      this.option.series = optionData.seriesData;
    //   this.option.color = optionData.color;
      myChart.setOption(this.option);
    },
  }
}
</script>

<style>
</style>
