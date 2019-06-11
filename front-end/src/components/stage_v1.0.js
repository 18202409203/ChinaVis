import * as d3 from 'd3';
export default function Stage(stageId) {
    // utils
    var translate = (x, y) => `translate(${x}, ${y})`;

    // measures
    const cellSize = 24;
    const cellCircleRadius = 6;
    const yLength = 30;
    const xLength = 16;
    var width = cellSize * yLength;
    var height = cellSize * xLength;
    var margin = 20;

    // colors
    var cellStroke = {
        normal: '#c9c9c9',
        blackBorder: '#333'
    }
    var cellFill = {
        nonSensor: '#8f8f8f', // 无传感器的墙体
        hasSensor: '#fff', // 无布局的通道
        hasLayout: '#00BFFF', // 会场餐厅等布局
        conferee: [
            'red',
            'green',
            'orange',
            'black'
        ], // 人员移动
        transparent: 'none',
        layout: {
            // 绿色（通道）
            '入口': '#69F0AE',
            '出口': '#00C853',
            '扶梯': '#00E676',

            // 蓝色（正式，专业）
            '分会场A': '#80D8FF',
            '分会场B': '#40C4FF',
            '分会场C': '#00B0FF',
            '分会场D': '#0091EA',
            '主会场': '#01579B',
            '海报区': '#0277BD',
            '展厅': '#0288D1',

            // 黄色（休息，准备）
            'room1': '#FFFF00',
            'room2': '#FFEA00',
            'room3': '#FFD600',
            'room4': '#FFFF00',
            'room5': '#FFEA00',
            'room6': '#FFD600',

            // 棕色（与会议无关）
            '厕所1': '#6D4C41',
            '厕所2': '#5D4037',
            '厕所3': '#4E342E',

            // 紫色（官方，服务）
            '签到处': '#8E24AA',
            '服务台': '#7B1FA2',
            '餐厅': '#6A1B9A',
            '休闲区': '#4A148C'
        }
    }

    this.svg = d3.select("#" + stageId)
        .append("svg")
        .attr("width", width + 2 * margin)
        .attr("height", height * 2 + 3 * margin)
        .attr("transform", translate(margin, margin))

    this.baseGroup = this.svg.append("g")
    this.confereesMoveRecordList = []; // 与会人员移动轨迹列表

    // 初始化地图
    this.initStage = (allSensorsList) => {
        // 补齐所有Cell位置信息
        this.floorCellsList = [
            [],
            []
        ];
        for (let i = 0; i < xLength; i++) {
            for (let j = 0; j < yLength; j++) {
                for (let f = 0; f < this.floorCellsList.length; f++) {
                    let uniqueSensor = allSensorsList.filter(d => d.floor === (f + 1) && d.x === i && d.y === j)[0];
                    let cell = {
                        floor: f + 1, // 1、2
                        x: i,
                        y: j,
                        sid: uniqueSensor && uniqueSensor.sid,
                        layout: uniqueSensor && uniqueSensor.layout
                    }
                    this.floorCellsList[f].push(cell)
                }
            }
        }
        // 按楼层分组的Cell
        this.floorCellGroup = this.baseGroup.append("g")
            .selectAll("g")
            .data(this.floorCellsList)
            .enter()
            .append("g")
            .attr("transform", (f, i) => i === 1 ? translate(0, height + margin) : translate(0, 0)) // 2楼往下平移
        this.floorCellGroup.append("g")
            .selectAll("rect")
            .data(f => f)
            .enter()
            .append("rect")
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('y', d => cellSize * d.x)
            .attr('x', d => cellSize * d.y)
            .attr('stroke', cellStroke.normal)
            .attr('fill', d => d.sid === undefined ? cellFill.nonSensor : d.layout === null ? cellFill.hasSensor : cellFill.layout[d.layout] )
    }

    // 添加布局信息
    this.addLayout = (layoutList) => {
        // 分楼层整理
        this.floorLayoutNestList = [
            d3.nest()
            .key(k => k.layout)
            .entries(layoutList.filter(d => d.floor === 1)),
            d3.nest()
            .key(k => k.layout)
            .entries(layoutList.filter(d => d.floor === 2))
        ];
        console.log(this.floorLayoutNestList)
    }

    // 单个与会人员的移动记录
    this.addOneConfereeMoveRecord = (oneConfereeSensorsList) => {
        this.currentConfereeMoveRecord = [
            oneConfereeSensorsList.filter(d => d.sensor.floor === 1),
            oneConfereeSensorsList.filter(d => d.sensor.floor === 2)
        ];
        // 暂时支持四个路线对比
        let count = 4;
        let currentIndex = this.confereesMoveRecordList.length;
        let offsetMatrix = [
            [1, 1],
            [3, 1],
            [1, 3],
            [3, 3]
        ];
        this.currentConfereeMoveRecordGroup = this.baseGroup.append("g")
            .selectAll("g")
            .data(this.currentConfereeMoveRecord)
            .enter()
            .append("g")
            .attr("transform", (f, i) => i === 1 ? translate(0, height + margin) : translate(0, 0)) // 2楼往下平移
        this.currentConfereeMoveRecordGroup.append("g")
            .selectAll("circle")
            .data(c => c)
            .enter()
            .append("circle")
            .attr("cx", d => cellSize * d.sensor.y)
            .attr("cy", d => cellSize * d.sensor.x)
            .attr("transform", translate(cellSize / count * offsetMatrix[currentIndex][0], cellSize / count * offsetMatrix[currentIndex][1] ))
            .attr("r", cellCircleRadius)
            .attr("fill", cellFill.conferee[currentIndex])

        this.confereesMoveRecordList.push(this.currentConfereeMoveRecordGroup);
    }
    // 清除人员移动记录
    this.clearMoveRecord = () => {
        let preRecord = this.confereesMoveRecordList.pop()
        preRecord && preRecord.remove();
    }

    // 单人移动路线动画
    this.oneConfereeMoveTransition = (oneConfereeSensorsList) => {
        this.oneConfereeMoveTransitionGroup = this.baseGroup.append("g")
        .selectAll("g")
        .data(this.currentConfereeMoveRecord)
        .enter()
        .append("g")
        .attr("transform", (f, i) => i === 1 ? translate(0, height + margin) : translate(0, 0)) // 2楼往下平移

    }

}