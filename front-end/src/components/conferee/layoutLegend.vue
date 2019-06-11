<template>
  <div :id="chartId"></div>
</template>

<script>
import * as d3 from 'd3';
export default {
  data() {
    return {
      chartId: 'layout_legend' + this.$util.randomString(),
      svgId: "layout_legend_id" + this.$util.randomString(),
      selectedLegend: new Set(),
      selectedLegendElement: new Set()
    }
  },
  methods: {
    paintLegend(option, layouts) {
      this.removeLegend();
      var cellSize = option.cellSize || 24;
      var margin = option.margin || 8;
      var cellFill = option.cellFill;
      var cellGap = 1;
      var width = 60;
      var height = (cellGap + cellSize + cellGap) * layouts.length;
      var vm = this;

      var svg = d3.select('#' + this.chartId)
        .append("svg")
        .attr("id", this.svgId)
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g")
        .attr("transform", `translate(${margin}, ${margin})`)

      var legendGroup = svg.append('g')
        .selectAll("rect")
        .data(layouts)
        .enter()
      var rectGroup = legendGroup
        .append("rect")
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('y', (d, i) => (cellGap + cellSize + cellGap) * i)
        .attr('x', 0)
        .attr('fill', d => cellFill.layout.get(d))
        .on('click', function (d) {
          vm.selectedLegend.delete(d) ||
            vm.selectedLegend.add(d)
          vm.selectedLegendElement.delete(this) ||
            vm.selectedLegendElement.add(this)
          rectGroup.attr('stroke', 'none');
          vm.selectedLegendElement.forEach(e =>
            d3.select(e)
              .attr('stroke', 'red')
          )
          vm.legendClick();
        })
      legendGroup
        .append("text")
        .text(d => d)
        .attr('y', (d, i) => (cellGap + cellSize + cellGap) * i)
        .attr('x', cellSize)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('transform', `translate(0, ${cellSize / 2})`)
    },
    removeLegend() {
      d3.select('#' + this.svgId).remove();
    },
    legendClick() {
      this.$emit('legendClick', this.selectedLegend);
    }
  }
}
</script>

<style>
</style>
