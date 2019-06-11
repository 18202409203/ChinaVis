<template>
  <div :id="chartId" style="width: 100%; height: 100%;"></div>
</template>

<script>
var echarts = require('echarts');
export default {
  data() {
    return {
      chartId: 'line' + this.$util.randomString(),
      option: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: []
      }
    }
  },
  methods: {
    paint(optionData) {
      var myChart = echarts.init(document.getElementById(this.chartId));
      this.option.xAxis.data = optionData.axisData;
      this.option.series = optionData.seriesData;
      //   this.option.color = optionData.color;
      myChart.setOption(this.option);
    },
  }
}
</script>

<style>
</style>
