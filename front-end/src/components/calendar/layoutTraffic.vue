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
        color: [],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            snap: true
          },
          formatter: (params) => `地点：${params.seriesName}<br/>时间：${this.$util.formatTime(params.name).time}<br/>人流量：${params.value}`
        },
        legend: {
          x: 'left'
        },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          toolbox: ['lineX', 'clear'],
          outOfBrush: {
            colorAlpha: 0.1
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              // yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: {
          show: false
        },
        grid: {
          left: 50,
          right: 50,
          height: '65%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          axisPointer: {
            label: {
              formatter: (params) => this.$util.formatTime(params.value).time
            }
          },
          data: []
        },
        yAxis: {
          name: '人流量',
          type: 'value',
        },
        series: []
      }
    }
  },
  methods: {
    paintLine(optionData) {
      // console.log(optionData)
      var myChart = echarts.init(document.getElementById(this.chartId));
      this.option.color = optionData.color;
      this.option.xAxis.data = optionData.x;
      this.option.series = optionData.y;
      myChart.setOption(this.option, true);
      myChart.on('brushSelected', this.renderBrushed);
    },
    renderBrushed(params) {
      if (params.batch[0].areas.length > 0) {
        this.$emit('brushSelected', params.batch[0].areas[0].coordRange)
      }
    }
  }
}
</script>

<style>
</style>
