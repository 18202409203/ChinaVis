<template>
  <div :id="chartId" style="width: 100%; height: 100%;"></div>
</template>

<script>
var echarts = require('echarts');
export default {
  data() {
    return {
      chartId: 'pie' + this.$util.randomString(),
      option: {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          itemGap: 1,
          itemWidth: 10,
          itemHeight: 10
        },
        series: []
      }
    }
  },
  methods: {
    paintPie(optionData) {
      var myChart = echarts.init(document.getElementById(this.chartId));
      optionData.color && (this.option.color = optionData.color)
      optionData.isHorizontal && (this.option.legend.orient = 'horizontal')
      this.option.series = optionData.seriesData;
      myChart.setOption(this.option);

      // 默认高亮
      if (!optionData.closeHighLight) {
        let index = 0;
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: index,
          dataIndex: index
        });
        myChart.on("mouseover", function (e) {
          if (e.dataIndex != index) {
            myChart.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: index
            });
          }
        });
        myChart.on("mouseout", function (e) {
          index = e.dataIndex;
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: e.dataIndex
          });
        });
      }
    },
  }
}
</script>

<style>
</style>
