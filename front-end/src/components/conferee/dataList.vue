<template>
    <div :id="chartId"></div>
</template>

<script>
import * as d3 from 'd3';
export default {
    data(){
        return {
            chartId: 'data_list' + this.$util.randomString(),
            svgId: 'data_list_id' + this.$util.randomString(),
            rowRect: {},
            bodyList: [],
            titleList: []
        }
    },
    methods: {
        paintList(option, titleList, bodyList){
            let vm = this;
            this.removeList();

            var margin = option.margin || 20;
            var cellSize = option.cellSize || 24;
            var cellWidth = option.cellWidth || 60;
            var rectStroke = option.rectStroke || '#c9c9c9';
            var titleFill = option.titleFill || '#d9d9d9';

            var width = cellWidth * titleList.length;
            var height = (bodyList.length + 1) * cellSize;

            var svg = d3.select('#' + this.chartId)
                .append('svg')
                .attr("id", this.svgId)
                .attr('width', width + 2 * margin)
                .attr('height', height + 2 * margin)
                .append("g")
                .attr("transform", `translate(${margin}, ${margin})`)

            // var confereeGroup = svg.append("g")
            //     .selectAll('g')
            //     .data(allConfereeMoveData)
            //     .enter()
            //     .append('g')
            //     .attr('transform', (d,i) => `translate(0, ${i*cellSize})`)
            // confereeGroup
            //     .append('text')
            //     .text(d => d.confereeId)
            //     .attr('transform', `translate(${cellWidth/2}, ${cellSize/2})`)
            //     .attr('text-anchor', 'middle')
            //     .attr('dominant-baseline', 'middle')
            // confereeGroup
            //     .append('rect')
            //     .attr('x', 0)
            //     .attr('y', 0)
            //     .attr('width', cellWidth)
            //     .attr('height', cellSize)
            //     .attr('fill', 'none')
            //     .attr('stroke', rectStroke)
            // confereeGroup.on('click', paintMoveData)

            // var titleGroup = 
                paintMoveData([titleList], 'title');
            var bodyGroup = paintMoveData(bodyList, 'body');
            bodyGroup.group.attr('transform', `translate(0, ${cellSize})`)

            function paintMoveData(listData, type){
                var rowGroup = svg.append("g")
                    .selectAll("g")
                    .data(listData)
                    .enter()
                    .append("g")
                    .attr('transform', (d,i) => `translate(0, ${i*cellSize})`)
                    .append("g")
                var cellGroup = rowGroup
                    .selectAll('g')
                    .data(d => d)
                    .enter()
                    .append("g")
                    .attr('transform', (v,i) => `translate(${i*cellWidth}, 0)`)
                var rectGroup = cellGroup
                        .append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', cellWidth)
                        .attr('height', cellSize)
                        .attr('fill', 'none')
                        .attr('stroke', rectStroke)
                // var textGroup = 
                cellGroup
                        .append('text')
                        .text(v => v)
                        .attr('transform', `translate(${cellWidth/2}, ${cellSize/2})`)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        
                vm.rowRect = rowGroup.append("rect")
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', d => cellWidth * d.length)
                    .attr('height', cellSize)
                    .attr('fill', 'transparent')
                    .attr('stroke', 'transparent')
                if(type === 'title'){
                    rectGroup
                        .attr('fill', titleFill)
                } else if(type === 'body'){
                    vm.rowRect
                        .on('click', function (d, i) {
                            vm.rowRectClick(d, i);
                            vm.$emit('rowClick', d, i);
                        })
                }

                return {
                    group: rowGroup
                }
            }
        },
        removeList(){
            d3.select('#' + this.svgId).remove();
        },
        rowRectClick(d, i){
            this.rowRect
                .attr('stroke', 'transparent')
            d3.select(this.rowRect._groups[0][i])
                .attr('stroke', 'red')
        }

    }
}
</script>

<style>

</style>
