<template>
    <div :id="chartId"></div>
</template>

<script>
import * as d3 from 'd3';
import d3Tip from "d3-tip";
export default {
    data(){
        return {
            chartId: 'meeting' + this.$util.randomString(),
            svg: undefined
        }
    },
    methods:{
        paint(paintData){
            var vm = this;
            var maxTime = Math.max( ...paintData.map(d =>d[8]) );
            var width = document.getElementById(this.chartId).offsetWidth;
            var height = document.getElementById(this.chartId).offsetHeight;
            var gap = 2;
            var barWidth = 8;
            var svgWidth = 8 * paintData.length;
            this.svg && this.svg.remove();
            this.svg = d3.select('#' + this.chartId)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                // .attr("transform", this.$util.translate(0, margin))
                // .style("border", '1px black solid')
            
            // base line
            var lineGroup = this.svg.append("g")
            lineGroup.append("line")
                .attr("x1", 0)
                .attr("y1", height/2)
                .attr("x2", width)
                .attr("y2", height/2)
                .style("stroke-width", 1)
                .style("stroke", 'black')
            // 1 hour reference line
            var reference = 60;
            lineGroup.append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", height/2 * (1 - reference*60/maxTime) )
                .attr("y2", height/2 * (1 - reference*60/maxTime) )
                .style("stroke-width", 1)
                .style("stroke", 'red')
                
            var barGroup = this.svg.append("g")
                .selectAll("g")
                .data(paintData)
                .enter()
                .append("g")
                .attr("transform", (d,i) => this.$util.translate(i * barWidth + gap + (width-svgWidth)/2, height / 2)) // 中心化

            // tooltips
            let tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
                return `地点：${d[7]}<br/>
                        时间：第${d[1]}天 ${vm.$util.formatTime(d[2]).time}<br/>
                        停留时长：${vm.$util.visualTime(d[8])}`;
            });
            barGroup.call(tip);

            barGroup.append("rect")
                .attr("height", v => v[8] / maxTime * height)
                .attr("width", barWidth - gap)
                .attr("x", 0)
                .attr("y", v => - v[8] / maxTime * height / 2)
                .attr("fill", v => this.$util.cellFill.layout.get(v[7]))
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide)
        }
    }
}
</script>

<style>

</style>
