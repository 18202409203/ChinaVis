import Nest from './Nest.js';
export default function Filter(data) {
    this.status = data;
    this.random = (num) => {
        let r = ~~(Math.random() * 1000);
        this.status = this.status.slice(r, r + num);
        return this;
    }

    // 属于[Ids]中的一员
    this.filterByIdArray = ({Ids , flag}) => {
        if (flag) {
            this.status = this.status.filter(d => Ids.includes(d[0].id))
        }
        return this;
    }

    // 单ID
    this.filterById = ({Id , flag}) => {
        if (flag) {
            this.status = this.status.filter(d => Id === d[0].id)
        }
        return this;
    }

    // 在某地单次停留长达[min~max]
    this.filterByOnceStayTime = ({min, max, flag, layout}) => {
        if (flag) {
            min = min || 0;
            max = max || Infinity;
            this.status = this.status.filter(d => {
                let _d = layout ? d.filter(v => v.layout === layout) : d
                return _d.some(v => max > (v.outTime - v.inTime) && (v.outTime - v.inTime) > min)
            })
        }
        return this;
    }

    // 在某地累计停留长达[min~max]
    this.filterByTotalStayTime = ({min, max, flag, layout}) => {
        if (flag) {
            min = min || 0;
            max = max || Infinity;
            this.status = this.status.filter(d => {
                let layoutStayTime = new Nest().key("layout").rollup(v => v.reduce((a, c) => a + c.outTime - c.inTime, 0)).entries(d);
                layoutStayTime = layout ? layoutStayTime[layout] : layoutStayTime
                return layoutStayTime.some(v => max > v.values && v.values > min);
            })
        }
        return this;
    }

    // 入场时间早于minTime
    this.filterByInTimeLessThan = ({minTime, flag, layout}) => {
        if (flag) {
            this.status = this.status.filter(d => {
                let _d = layout ? d.filter(v => v.layout === layout) : d
                return _d.some(v => v.inTime < minTime)
            })
        }
        return this;
    }

    // 离场时间晚于maxTime
    this.filterByOutTimeGreaterThan = ({maxTime, flag, layout}) => {
        if (flag) {
            this.status = this.status.filter(d => {
                let _d = layout ? d.filter(v => v.layout === layout) : d;
                return _d.some(v => v.outTime > maxTime)
            })
        }
        return this;
    }

    // 于[minTime, maxTime]期间未曾离开某地
    this.filterByStayBetween = ({minTime, maxTime, flag, layout}) => {
        if (flag) {
            minTime = minTime || 0;
            maxTime = maxTime || Infinity;
            this.status = this.status.filter(d => {
                let _d = layout ? d.filter(v => v.layout === layout) : d
                return _d.some(v => v.inTime < minTime && v.outTime > maxTime)
            })
        }
        return this;
    }


    // 过滤掉时长小于x的移动记录
    this.filterMicros = ({microTime, flag}) => {
        if (flag) {
            this.status = this.status.map(d => d.filter(v => (v.outTime - v.inTime) > microTime)).filter(s => s.length !== 0)
        }
        return this;
    }
}
