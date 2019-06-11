import * as d3 from 'd3';
export default function ParallelTimeline() {
    this.svg = undefined;
    this.baseGroup = undefined;
    this.parallelLineGroup = undefined;
    this.timeScaler = undefined;
    this.reTimeScaler = undefined;
    this.everyLineGroup = undefined;

    var chartId, margin, minTime, maxTime, height, width, gap, innerHeight, innerWidth, textPadding, timePadding, legendPadding;
    this.setOption = function (option) {
        chartId = option.chartId;
        this.lineData = option.lineData;
        this.parallelAxis = option.parallelAxis;
        margin = option.margin || 20;
        width = option.width || 1000;
        /**************** 1. height **********************/
        // gap = option.gap || 30;
        height = option.height || 700;
        /** **********************************************/
        minTime = option.minTime || 0;
        maxTime = option.maxTime || 3600;

        textPadding = 50;
        timePadding = 20;
        legendPadding = 100;
        /**************** 2. gap *************************/
        // height = option.parallelAxis.length * gap + 2 * margin + timePadding;
        gap = (height - 2 * margin - timePadding) / option.parallelAxis.length;
        /** **********************************************/
        innerWidth = width - 2 * margin - textPadding - legendPadding;
        innerHeight = option.parallelAxis.length * gap;
    }

    this.paint = function () {
        this.svg && this.svg.remove();
        this.svg = d3.select('#' + chartId)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        this.baseGroup = this.svg.append("g")
            .attr("transform", translate(margin, margin))

        // 时间比例尺
        this.timeScaler = d3.scaleTime()
            .domain([num2Date(minTime), num2Date(maxTime)])
            .range([0, innerWidth])
        var reTimeScaler = d3.scaleTime()
            .domain([0, innerWidth])
            .range([num2Date(minTime), num2Date(maxTime)])
        this.reTimeScaler = reTimeScaler

        // 时间轴
        var axisTop = d3.axisTop(this.timeScaler)
            .ticks(d3.timeMinute.every(30))
            .tickFormat(d3.timeFormat("%H:%M"))
        this.baseGroup.append("g")
            .attr("transform", translate(textPadding, timePadding))
            .call(axisTop)

        // 平行线分组
        var parallelAxisGroup = this.baseGroup.append("g")
            .selectAll("g")
            .data(this.parallelAxis)
            .enter()
            .append("g")
        // 平行线文字
        parallelAxisGroup.append("g")
            .attr("transform", (d, i) => translate(0, timePadding + i * gap + gap / 2))
            .append("text")
            .text(d => d)
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
        // 平行线线条
        var parallelRect = parallelAxisGroup.append("g")
            .attr("transform", (d, i) => translate(textPadding, timePadding + i * gap))
            .append("rect")
            .attr("width", innerWidth)
            .attr("height", gap)
            .attr("stroke", "#c9c9c9")
            .attr("fill", "none")
            .attr("pointer-events", "all")

        this.parallelLineGroup =
            this.baseGroup.append("g")
            .attr("transform", translate(textPadding, timePadding))

        // 线数据
        // this.paintLineData(this.lineData);

        /* zpj 2019-5-11 13:39:09 zoom */
        // this.zoomHandler = d3.zoom()
        // .scaleExtent([1, 10]) // zoom limit
        // .translateExtent([[0, 0], [ 2 * width, 2 * height]]) // translate limit
        // .on('zoom', () => {
        //   this.baseGroup.attr('transform', d3.event.transform )
        // })
        // this.svg.call(this.zoomHandler)

        // 指示器分组
        var pointerGroup = this.baseGroup.append("g")
            .attr("transform", translate(textPadding, timePadding))
        // 指示器文字
        var pointerText = pointerGroup.append("text")
            .attr("x", 0)
            .attr("y", innerHeight)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .text("")
        // 指示器线条
        var pointerLine = pointerGroup.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", innerHeight)
            .attr("stroke", "black")
            .attr("pointer-events", "none")
        // 平行线分组 鼠标悬浮
        parallelRect
            .on("mousemove", function ( /*x,y,z*/ ) {
                // console.log(x, y, z);
                // console.log(d3.event)
                // console.log(d3.mouse(this))
                var positionX = d3.event.offsetX - margin - textPadding;
                pointerLine
                    .attr("x1", positionX)
                    .attr("x2", positionX)
                pointerText
                    .attr("x", positionX)
                    .text(
                        d3.timeFormat("%H:%M")(reTimeScaler(positionX))
                    )
                // .attr("transform", `rotate(90, ${positionX}, 0)`)
            })

        // legend
        var cellSize = 25;
        var legends = ["0~1h", "1~2h", "2~3h", "3~4h", "4~5h", "5~6h", "6~7h", "7~8h", "8~9h"];
        var legendGroup = this.baseGroup.append("g")
            .attr("transform", translate(textPadding + innerWidth, timePadding))
            .selectAll("g")
            .data(legends)
            .enter()
            .append("g")
            .attr("transform", (d, i) => translate(legendPadding / 2, i * cellSize))
        legendGroup
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", (d, i) => strokeColorScaler(i))
        legendGroup
            .append("text")
            .text(d => d)
            .attr("x", cellSize)
            .attr("y", cellSize / 2)
            .attr("dominant-baseline", "middle")
    }

    this.paintLineData = function (lineData) {
        var railCounts = lineData.length;
        console.log(lineData)

        // 线数据
        this.everyLineGroup = this.parallelLineGroup
            .selectAll("g")
            .data(lineData, d => d)
            .join(
                enter => enter.append("g")
                .attr("id", c => c[0].id),
                update => update
                .call(update => update),
                exit => exit
                .call(exit => exit.remove())
            )
            .attr("transform", (c, i) => translate(0, (2*i+1) / (2*railCounts) * gap))
            .selectAll("line")
            .data(c => c.filter(d => this.parallelAxis.includes(d.layout)))
            .enter()
            .append("line")
            .attr("x1", d => this.timeScaler(num2Date(d.inTime)))
            .attr("x2", d => this.timeScaler(num2Date(d.outTime)))
            .attr("y1", d => this.parallelAxis.indexOf(d.layout) * gap)
            .attr("y2", d => this.parallelAxis.indexOf(d.layout) * gap)
            // .attr("stroke-opacity", 0.5)
            .attr("stroke-width", d => strokeWidthScaler(d.outTime - d.inTime) + 0.5)
            .attr("stroke", d => strokeColorScaler(~~((d.outTime - d.inTime) / 60 / 60)))


        /* zpj 2019-5-11 13:39:48 tips */
        var tipGroup = this.baseGroup.append("g")
        var tipText = tipGroup.append("text")
            .text("")
            .attr("x", innerWidth + textPadding)
            .attr("y", 0)
            .attr("stroke", "black")
            .attr("dominant-baseline", "hanging")

        this.everyLineGroup
            .on("mouseover",
                function (x, y, z) {
                    z.forEach(
                        e => d3.select(e)
                        // .attr("stroke-opacity", 1)
                        .attr("stroke-width", 3)
                        .attr("stroke", 'blue')
                    )
                    tipText.attr("y", d3.event.offsetY - margin)
                    tipText.text(x.id)
                })
            .on("mouseout",
                function (x, y, z) {
                    z.forEach(
                        e => d3.select(e)
                        // .attr("stroke-opacity", 0.5)
                        .attr("stroke-width", d => strokeWidthScaler(d.outTime - d.inTime) + 0.5)
                        .attr("stroke", d => strokeColorScaler(~~((d.outTime - d.inTime) / 60 / 60)))
                    )
                    tipText.text("")
                })
        return this.everyLineGroup
    }
}

function translate(x, y) {
    return `translate(${x}, ${y})`;
}

function num2Date(time) {
    return new Date(+new Date('2000-01-01 00:00:00') + time * 1000);
}

function strokeWidthScaler(value) {
    var s = d3.scaleLinear()
        .domain([60 * 60 * 2, 60 * 60 * 6]) // 连续2~6个小时
        .range([1, 2.5])
        .clamp(true)
    return s(value);
}

function strokeColorScaler(index) {
    var colors = [
        d3.interpolateReds(0.2),
        d3.interpolateReds(0.3),
        d3.interpolateReds(0.4),
        d3.interpolateReds(0.5),
        d3.interpolateReds(0.6),
        d3.interpolateReds(0.7),
        d3.interpolateReds(0.8),
        d3.interpolateReds(0.9),
        d3.interpolateReds(1.0)
    ];
    return colors[index];
}