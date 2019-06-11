import * as d3 from 'd3';
export default {
    interpolateReds: d3.interpolateReds,
    daysColor: d3.schemeCategory10.slice(0,3),
    cellFill: {
        nonSensor: '#8f8f8f', // 无传感器的墙体
        hasSensor: '#fff', // 无布局的通道
        hasLayout: '#fff', // 会场餐厅等布局
        transparent: 'none',
        // layout: new Map([
        //     // 绿色（通道）
        //     ['入口', d3.interpolateGreens(0.2)],
        //     ['出口', d3.interpolateGreens(0.4)],
        //     ['扶梯', d3.interpolateGreens(0.6)],
        //     ['通道', d3.interpolateGreens(0.8)],
        //     // 红色（集中关注）
        //     ['分会场A', d3.interpolateOranges(0.2)],
        //     ['分会场B', d3.interpolateOranges(0.4)],
        //     ['分会场C', d3.interpolateOranges(0.6)],
        //     ['分会场D', d3.interpolateOranges(0.8)],
        //     ['主会场', d3.interpolateOranges(1.0)],
        //     // 蓝色（休息，准备]）
        //     ['room1', d3.interpolateBlues(0.1)],
        //     ['room2', d3.interpolateBlues(0.2)],
        //     ['room3', d3.interpolateBlues(0.3)],
        //     ['room4', d3.interpolateBlues(0.4)],
        //     ['room5', d3.interpolateBlues(0.5)],
        //     ['room6', d3.interpolateBlues(0.6)],
        //     ['厕所1', d3.interpolateBlues(0.7)],
        //     ['厕所2', d3.interpolateBlues(0.8)],
        //     ['厕所3', d3.interpolateBlues(0.9)],
        //     // 紫色（官方，服务]）
        //     ['签到处', d3.interpolatePurples(0.3)],
        //     ['海报区', d3.interpolatePurples(0.4)],
        //     ['展厅', d3.interpolatePurples(0.5)],
        //     ['服务台', d3.interpolatePurples(0.6)],
        //     ['休闲区', d3.interpolatePurples(0.7)],
        //     ['餐厅', d3.interpolatePurples(0.8)],
        // ])
        layout: new Map([
            // （集中关注）
            ['分会场A', d3.schemeCategory10[0]],
            ['分会场B', d3.schemeCategory10[1]],
            ['分会场C', d3.schemeCategory10[2]],
            ['分会场D', d3.schemePaired[9]],
            ['主会场', d3.schemePaired[11]],
            // （官方，服务]）
            ['展厅', d3.schemeCategory10[6]],
            ['海报区', d3.schemeCategory10[9]],
            ['签到处', d3.schemeCategory10[4]],
            ['服务台', d3.schemeCategory10[5]],
            ['休闲区', d3.schemePaired[7]],
            ['餐厅', d3.schemeCategory10[8]],
            // （休息，准备]）
            ['room1', d3.schemePaired[6]],
            ['room2', d3.schemePaired[8]],
            ['room3', d3.schemePaired[0]],
            ['room4', d3.schemePaired[2]],
            ['room5', d3.schemePaired[4]],
            ['room6', d3.schemePastel1[4]],
            ['厕所1', d3.schemePastel1[6]],
            ['厕所2', d3.schemePastel2[0]],
            ['厕所3', d3.schemePastel1[3]],
            // （通道）
            ['扶梯', d3.schemePastel1[7]],
            ['通道', d3.schemePastel1[2]],
            ['入口', d3.schemePastel1[5]],
            ['出口', d3.schemePastel1[8]],
        ])
    },


    formatTime: function (time, str) {
        if (time > 60 * 60 * 24 * 3 || time < 0) throw new Error('time should between 0~259200')
        let base = new Date('2000-01-01 00:00:00').getTime();
        let date = new Date(base + time * 1000);
        let obj = {
            d: addZero(date.getDate()),
            h: addZero(date.getHours()),
            m: addZero(date.getMinutes()),
            s: addZero(date.getSeconds())
        }
        let res = {
            date: obj["d"],
            time: obj["h"] + ':' + obj["m"] + ':' + obj["s"]
        }
        return str ? str.split("").map(t => obj[t]).join(":") : res
    },
    addZero: addZero,
    randomString: function () {
        return (Math.random()).toString(16).replace('.', '_')
    },
    getTrueTime: getTrueTime,
    getDayAndTime: function (value) {
        if (value > 60 * 60 * 24 * 3 || value < 0) throw new Error('time should between 0~259200');
        let day = Math.ceil(value / 24 / 60 / 60);
        let time = value % (24 * 60 * 60);
        return {
            day: day,
            time: time
        }
    },
    getStayTime(cur, nxt) {
        let next = nxt || cur;
        if (next[1] > cur[1]) {
            return 0;
        }
        return next[2] - cur[2];
    },
    visualTime(time) {
        if (time < 60)
            return time.toFixed(2) + '秒';
        if (time < 60 * 60)
            return (time / 60).toFixed(2) + '分钟';
        return (time / 60 / 60).toFixed(2) + '小时';
    },
    // 平移函数
    translate(x, y) {
        return `translate(${x}, ${y})`;
    },
    // 清空DOM
    removeAllChildren(div) {
        while (
            div.hasChildNodes() //当div下还存在子节点时 循环继续
        ) {
            div.removeChild(div.firstChild);
        }
    },
}

function addZero(value) {
    return ('0' + value).slice(-2);
}

function getTrueTime(day, time) {
    return (day - 1) * 24 * 60 * 60 + time;
}