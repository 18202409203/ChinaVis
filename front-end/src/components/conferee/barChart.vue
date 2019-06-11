<template>
  <div :id="chartId" style="width: 100%; height: 100%;"></div>
</template>

<script>
var echarts = require('echarts');
export default {
  data() {
    return {
      chartId: 'bar' + this.$util.randomString(),
      option: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '5%',
          top: '10%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: -45,
            interval: 0,
            fontSize: 12
          },
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
    }
  },
  methods: {
    paintBar(optionData, brushFunction) {
      var myChart = echarts.init(document.getElementById(this.chartId));
      this.option.xAxis.data = optionData.xData;
      this.option.series = optionData.seriesData;
      optionData.color && (this.option.color = optionData.color)
      this.option.title.text = optionData.title || ''
      brushFunction && (
        this.option.brush = {
          toolbox: ['lineX', 'clear'],
          xAxisIndex: 0
        })
      myChart.setOption(this.option);

      brushFunction && myChart.on('brushSelected', brushFunction);
    },
  }
}
</script>

<style>
</style>
