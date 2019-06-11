<template>
  <div :id="chartId" style="width: 100%; height: 100%;"></div>
</template>

<script>
var echarts = require('echarts');
require('echarts-wordcloud');
export default {
  data() {
    return {
      chartId: 'wordCloud' + this.$util.randomString(),
      option: {
        tooltip: {},
        series: [{
          type: 'wordCloud',
          gridSize: 20,
          sizeRange: [12, 60],
          rotationRange: [0, 0],
          shape: 'circle',
          textStyle: {
            normal: {
              color: function () {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          drawOutOfBound: true,
          data: []
        }]
      }
    }
  },
  methods: {
    paintCloud(colorMap, seriesData) {
      var myChart = echarts.init(document.getElementById(this.chartId));
      this.option.series[0].data = seriesData;
      this.option.series[0].textStyle.normal.color = (data) => {
        return colorMap.get(data.name);
      }
      myChart.setOption(this.option);
    },
  }
}
</script>

<style>
</style>
