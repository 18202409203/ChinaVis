<template>
  <div :id="chartId" style="width: 100%; height: 100%;"></div>
</template>

<script>
var echarts = require('echarts');
export default {
  data() {
    return {
      chartId: 'radar' + this.$util.randomString(),
      option: {
        tooltip: {},
        legend: {
          x: 'center',
        },
        radar: [
          {
            indicator: [],
            center: ['50%', '55%'],
            radius: 80
          }
        ],
        series: [
          {
            type: 'radar',
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: []
          }
        ]
      }
    }
  },
  methods: {
    paintRadar(paintData) {
      var myChart = echarts.init(document.getElementById(this.chartId));
        this.option.radar[0].indicator = paintData.map(d => {
            return {
                text: d.key,
                max: Math.max(...(paintData.map(d => d.value)))
            }
        });
        this.option.series[0].data[0] = {
            name: '出现地点',
            value: paintData.map(d => d.value)
        }
        console.log(this.option)
      myChart.setOption(this.option);
    }
  }
}
</script>

<style>
</style>
