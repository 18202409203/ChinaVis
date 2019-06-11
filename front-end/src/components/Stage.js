import * as d3 from 'd3';
import d3Tip from "d3-tip";
export default function Stage(option) {
    /* ------------------------- 私有参数 ---------------------- */
    // 传入参数
    var stageId = option.stageId || 'stage';
    var cellSize = option.cellSize || 24;
    var circleRadius = option.circleRadius || 10;
    var yLength = option.yLength || 30;
    var xLength = option.xLength || 16;
    var margin = option.margin || 20;
    var hasWall = option.hasWall;
    // var transitionSequenceInterval = option.transitionSequenceInterval || 200;
    var transitionDuration = option.transitionDuration || 200;
    var cellFill = option.cellFill;

    // 推算参数
    var width = cellSize * yLength;
    var height = cellSize * xLength;

    // 内定参数
    var cellStroke = {
        normal: '#c9c9c9',
        blackBorder: '#333'
    }
    var circleFill = {
        normal: 'transparent',
        red: 'red'
    }
    /* -------------------------------- 私有方法 -------------------------- */
    // 平移函数
    var translate = (x, y) => `translate(${x}, ${y})`;

    /* ------------------------------- 公有属性 ---------------------------- */
    this.svg = undefined;
    this.baseGroup = undefined;
    this.cellView_floorGroup = undefined;
    this.cellView_CellGroup = undefined;
    this.moveDataCircle = undefined;
    this.heatlegendGroup = undefined;
    this.circleData_allConfereeMoveData = [];

    /* ------------------------------ 公有方法 ----------------------------- */
    // 初始化地图
    this.initStage = (allSensorsList) => {
        this.svg === undefined || this.svg.remove();
        this.svg = d3.select("#" + stageId)
            .append("svg")
            .attr("width", width + 2 * margin)
            .attr("height", height * 2 + 3 * margin)
            .attr("transform", translate(margin, margin))
        // 添加滤镜
        var defs = this.svg.append("defs");
        var filter = defs.append("filter")
            .attr("id", "shadow")
            .attr("height", "200%")
        filter.append("feGaussianBlur")
            .attr("in", "sourceAlpha")
            .attr("stdDeviation", 1)
            .attr("result", "blur")

        this.baseGroup = this.svg.append("g");
        // 补齐所有Cell位置信息
        let floorCellsList = [
            [],
            []
        ];
        console.log(allSensorsList)
        for (let i = 0; i < xLength; i++) {
            for (let j = 0; j < yLength; j++) {
                for (let f = 0; f < floorCellsList.length; f++) {
                    let uniqueSensor = allSensorsList.filter(d => d.floor === (f + 1) && d.x === i && d.y === j)[0];
                    let cell = {
                        floor: f + 1, // 1、2
                        x: i,
                        y: j,
                        sid: uniqueSensor && uniqueSensor.sid,
                        layout: uniqueSensor && uniqueSensor.layout
                    }
                    if (hasWall) {
                        floorCellsList[f].push(cell)
                    } else if (uniqueSensor !== undefined) {
                        floorCellsList[f].push(cell)
                    }
                }
            }
        }
        // 按楼层分组的Cell
        this.cellView_floorGroup = this.baseGroup.append("g")
            .selectAll("g")
            .data(floorCellsList)
            .enter()
            .append("g")
            .attr("transform", (f, i) => i === 1 ? translate(0, height + margin) : translate(0, 0)) // 2楼往下平移
        this.cellView_CellGroup = this.cellView_floorGroup.append("g")
            .selectAll("rect")
            .data(f => f)
            .enter()
            .append("rect")
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('y', d => cellSize * d.x)
            .attr('x', d => cellSize * d.y)
            .attr('stroke', cellStroke.normal)
            .attr('fill', d => d.sid === undefined ? cellFill.nonSensor : d.layout === null ? cellFill.hasSensor : cellFill.layout.get(d.layout))


        let tipCell = d3Tip().attr('class', 'd3-tip').html(function (d) {
            return d.layout || '墙体';
        });
        this.cellView_CellGroup.call(tipCell);
        this.cellView_CellGroup.on("mouseover", tipCell.show).on("mouseout", tipCell.hide)
        return this.cellView_CellGroup;
    }
    // 所有布局同一颜色
    this.displayAllLayoutSameCellFill = () => {
        this.cellView_CellGroup &&
            this.cellView_CellGroup
            .attr('fill', d => d.sid === undefined ? cellFill.nonSensor : d.layout === null ? cellFill.hasSensor : cellFill.hasLayout)
    }
    // 所有布局格子颜色
    this.displayAllLayoutCellFill = () => {
        this.cellView_CellGroup &&
            this.cellView_CellGroup
            .attr('fill', d => d.sid === undefined ? cellFill.nonSensor : d.layout === null ? cellFill.hasSensor : cellFill.layout.get(d.layout))
    }
    // 人数热力映射颜色
    this.countHeatFill = (heatObject, heatLegend) => {
        var maxCount = 2500; // 最大人数
        this.cellView_CellGroup &&
            this.cellView_CellGroup
            .attr('fill', d => d.sid === undefined ? cellFill.nonSensor : d3.interpolateReds((heatObject[d.layout] || 0) / maxCount))
        heatLegend && this.heatLegend(10, maxCount);
    }
    // 时长热力映射颜色
    this.timeHeatFill = (heatObject, heatLegend) => {
        var max = Math.max(...heatObject.values())
        this.cellView_CellGroup &&
            this.cellView_CellGroup
            .attr('fill', d => d.sid === undefined ? cellFill.nonSensor : d3.interpolateReds((heatObject.get(d.sid) || 0) / max))
        heatLegend && this.heatLegend(10, max);
    }
    this.heatLegend = (segment, max) => {
        this.removeHeatLegend();
        var legend = gradient(segment, max);
        this.heatlegendGroup = this.baseGroup.append("g")
            .attr("transform", translate(cellSize, cellSize * 4))
        this.heatlegendGroup
            .selectAll("rect")
            .data(legend)
            .enter()
            .append("rect")
            .attr('x', width / 2)
            .attr("y", d => d.index * cellSize + height)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", d => d.color)
        this.heatlegendGroup
            .selectAll("text")
            .data(legend)
            .enter()
            .append("text")
            .text(d => d.value)
            .attr('x', width / 2 + cellSize)
            .attr("y", d => d.index * cellSize + height + cellSize / 2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'middle')
    }
    this.removeHeatLegend = () => {
        if (this.heatlegendGroup !== undefined) {
            console.log(this.heatlegendGroup)
            this.heatlegendGroup.remove()
            this.heatlegendGroup = undefined
        }
    }
    // 布局格子颜色
    this.displaySomeLayoutCellFill = (selectedLegend) => {
        let layouts = Array.from(selectedLegend);
        this.cellView_CellGroup &&
            this.cellView_CellGroup
            .attr('fill', d => d.sid === undefined ? cellFill.nonSensor : layouts.includes(d.layout) ? cellFill.layout.get(d.layout) : cellFill.hasSensor)
    }

    // 添加一个人员的移动记录
    this.addOneConfereeMoveData = (oneConfereeSensorsList) => {
        let oneConfereeMoveData = new ConfereeMoveData(oneConfereeSensorsList[0].id, oneConfereeSensorsList);
        // 防止重复
        this.circleData_allConfereeMoveData.map(d => d.confereeId).includes(oneConfereeMoveData.confereeId) || this.circleData_allConfereeMoveData.push(oneConfereeMoveData)
    }
    // 清空所有人员移动记录
    this.removeAllConfereeMoveData = () => {
        this.circleData_allConfereeMoveData = [];
    }
    // 清除指定人员移动记录
    this.removeOneConfereeMoveData = (confereeId) => {
        this.circleData_allConfereeMoveData = this.circleData_allConfereeMoveData.filter(d => d.confereeId !== confereeId);
    }
    // 得到指定人员移动记录
    this.getOneConfereeMoveData = (confereeId) => {
        return this.circleData_allConfereeMoveData.filter(d => d.confereeId == confereeId)[0];
    }
    // 绘制移动数据
    this.paintAllConfereeMoveData = (list) => {
        this.removeBatchConfereeMoveTransition();
        let floorIdData = d3.nest()
            .key(d => new Sensor(d.sid).floor)
            .key(d => d.id)
            .entries(list);
        console.log(floorIdData);

        var line = d3.line()
            .x(d => {
                if (new Sensor(d.sid).y > 28) {
                    console.log(d.sid)
                }
                return cellSize * new Sensor(d.sid).y + cellSize / 2
            })
            .y(d => {
                if (new Sensor(d.sid).x > 15) {
                    console.log(d.sid)
                }
                return cellSize * new Sensor(d.sid).x + cellSize / 2
            })
        this.batchTransitionFloorGroup = this.baseGroup.append("g")
            .selectAll("g")
            .data(floorIdData)
            .enter()
            .append("g")
            .attr("transform", f => f.key === '2' ? translate(0, height + margin) : translate(0, 0)) // 2楼往下平移


        let tipId = d3Tip().attr('class', 'd3-tip').html(function (d) {
            return d.key;
        });
        this.batchTransitionFloorGroup.call(tipId);
        // var zoom = d3.zoom()
        //     .scaleExtent([1, Infinity])
        //     .translateExtent([
        //         [0, 0],
        //         [width, height]
        //     ])
        //     .extent([
        //         [0, 0],
        //         [width, height]
        //     ])
        //     .on("zoom", zoomed);
        var brushGroup = this.batchTransitionFloorGroup.append("g")
        this.batchTransitionIdGroup = brushGroup
            .selectAll("g")
            .data(c => {
                return c.values.map(s => {
                    s["confereeCounts"] = c.values.length;
                    return s
                })
            })
            .enter()
            .append("g")
            .attr("transform", (f, i) => translate((i + 1) / f.confereeCounts * cellSize / 2, (i + 1) / f.confereeCounts * cellSize / 2))
            .on("mouseover", tipId.show)
            .on("mouseout", tipId.hide)
            .attr("id", d => ("id" + d.key));
        var lineGroup = this.batchTransitionIdGroup.append("path")
            .datum(p => {
                return p.values
                // .map((s, i) => {
                //     let next = p.values[i + 1];
                //     s["moveCounts"] = p.values.length;
                //     s["stayTime"] = util.getStayTime([i, s.day, s.time], [i + 1, next === undefined ? next : next.day, next === undefined ? next : next.time]);
                //     return s
                // })
            })
            .attr("fill", "none")
            .attr("stroke-opacity", 0.4)
            .attr("stroke", 'black')
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line)

        // this.batchTransitionIdGroup
        //     .append("g")
        //     .selectAll("circle")
        //     .data(p => {
        //         return p.values
        //         .map((s, i) => {
        //             let next = p.values[i + 1];
        //             // s["moveCounts"] = p.values.length;
        //             s["stayTime"] = util.getStayTime([i, s.day, s.time], [i + 1, next === undefined ? s.day : next.day, next === undefined ? s.time : next.time]);
        //             return s
        //         })
        //     })
        //     .enter()
        //     .append("circle")
        //     .attr("fill", "red")
        //     // .attr("fill-opacity", 0.2)
        //     // .attr("stroke", 'red')
        //     // .attr("stroke-width", 1)
        //     .attr("r", d => {return d.stayTime/60/60 * cellSize/2})
        //     .attr("cx", d => new Sensor(d.sid).y * cellSize + cellSize / 2)
        //     .attr("cy", d => new Sensor(d.sid).x * cellSize + cellSize / 2)

        // 鼠标悬浮事件
        lineGroup.on("mouseover", function () {
            d3.select(this)
                .attr("stroke-opacity", 0.8)
                .attr("stroke-width", 5)
                .attr("stroke", 'red')
                .attr("class", "dynamic_path")
        })
        lineGroup.on("mouseout", function () {
            d3.select(this)
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 2)
                .attr("stroke", 'black')
                .attr("class", "")
        })
    }
    // 筛选id
    this.filterLinesBySensors = (sensorsIdList) => {
        let IDfilted = [];
        this.batchTransitionIdGroup.style("display", d => {
            for (let each of d.values) {
                if (sensorsIdList.includes(each.sid)) {
                    IDfilted.push(each.id);
                    return 'block';
                }
            }
            return 'none';
        })
        console.log(IDfilted);
        return IDfilted;
    }
    // 清除移动轨迹
    this.removeBatchConfereeMoveTransition = () => {
        if (this.batchTransitionFloorGroup !== undefined) {
            this.batchTransitionFloorGroup.remove()
            this.batchTransitionFloorGroup = undefined;
        }
    }
    // 绘制指定人员的移动记录
    // this.paintOneConfereeMoveTransition = (confereeId) => {
    //     // 错误处理
    //     if (!this.circleData_allConfereeMoveData.map(d => d.confereeId).includes(confereeId)) {
    //         throw new Error(`no exist confereeId:${confereeId}`);
    //     }
    //     let oneConfereeMoveData = this.circleData_allConfereeMoveData.filter(d => d.confereeId === confereeId)[0]
    //     console.log(oneConfereeMoveData)

    // this.paintAllConfereeMoveData(oneConfereeMoveData);
    // let floorData = [
    //     oneConfereeMoveData.moveData.filter(d => d.sensor.floor === 1 && d.day === day),
    //     oneConfereeMoveData.moveData.filter(d => d.sensor.floor === 2 && d.day === day)
    // ];
    // var line = d3.line()
    //     .x(d => cellSize * d.sensor.y + cellSize / 2)
    //     .y(d => cellSize * d.sensor.x + cellSize / 2)
    // this.circleView_floorGroup = this.baseGroup.append("g")
    //     .selectAll("g")
    //     .data(floorData)
    //     .enter()
    //     .append("g")
    //     .attr("transform", (f, i) => i === 1 ? translate(0, height + margin) : translate(0, 0)) // 2楼往下平移
    // this.circleView_floorGroup.append("path")
    //     .datum(c => c)
    //     .attr("fill", "none")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1.5)
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")
    //     .attr("d", line)
    // }

    // 时间点绘
    this.paintConfereeBySequence = (moveData) => {
        if (this.moveDataCircle === undefined) {
            this.moveDataCircle = this.baseGroup.append("g")
                .attr("transform", translate(cellSize * moveData[6], (height + margin) * (moveData[4] - 1) + cellSize * moveData[5]))
            this.moveDataCircle
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr('r', circleRadius)
                .attr("transform", translate(cellSize / 2, cellSize / 2))
                .attr("fill", circleFill.red)
                .attr("class", 'blink')
                .style("filter", "url(#shadow)")
            this.moveDataCircleText = this.moveDataCircle.append("text")
                .text(`第${moveData[1]}天${formatTime(moveData[2]).time}${moveData[7]}`)
        } else {
            this.moveDataCircle
                .transition()
                .duration(transitionDuration)
                .attr("transform", translate(cellSize * moveData[6], (height + margin) * (moveData[4] - 1) + cellSize * moveData[5]))
            this.moveDataCircleText
                .text(`第${moveData[1]}天${formatTime(moveData[2]).time}${moveData[7]}`)
        }
    }
    // 移除小红点
    this.removeMoveDataCircle = () => {
        this.moveDataCircle.remove();
        this.moveDataCircle = undefined;
    }


}

function ConfereeMoveData(confereeId, moveData) {
    this.confereeId = confereeId
    this.moveData = moveData.map((d, i) => new MoveData(d, i))
}

function MoveData(data, index) {
    this.day = data.day;
    this.id = data.id;
    this.sensor = data.sensor;
    this.time = data.time;

    this.trueTime = (data.day - 1) * 24 * 60 * 60 + data.time;
    this.sequence = index;
}

function Sensor(sid) {
    this.sid = sid;
    this.floor = Math.floor(sid / 10000);
    this.x = +sid.toString().slice(1, 3);
    this.y = +sid.toString().slice(-2);
}

function formatTime(time) {
    if (time > 60 * 60 * 24 * 3 || time < 0) throw new Error('time should between 0~259200')
    let base = new Date('2000-01-01 00:00:00').getTime();
    let date = new Date(base + time * 1000);
    let d = addZero(date.getDate());
    let h = addZero(date.getHours());
    let m = addZero(date.getMinutes());
    let s = addZero(date.getSeconds());
    return {
        date: d,
        time: h + ':' + m + ':' + s
    }
}

function addZero(value) {
    return ('0' + value).slice(-2);
}

function gradient(segment, max) {
    var interpolate = [];
    for (let i = 0; i < segment; i++) {
        let proportion = (i + 1) / segment;
        interpolate[i] = {
            color: d3.interpolateReds(proportion),
            value: Math.floor(max * proportion),
            index: i
        }
    }
    return interpolate
}