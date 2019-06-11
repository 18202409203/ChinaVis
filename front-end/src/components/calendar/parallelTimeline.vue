<template>
  <v-row>
    <!-- <v-col :span="20"> -->
    <div :id="chartId"></div>
    <!-- </v-col>
    <v-col :span="4">
      <div class="div_card" style="height: 700px; overflow-y: auto;"> -->
    <!-- 滤除微小 -->
    <!-- <div class="panel">
          <div class="panel-title">
            滤除微小
            <div class="panel-tool">
              <v-switch v-model="filterPanel.filterMicros.flag" size="small"></v-switch>
            </div>
          </div>
          <div class="panel-body">
            <v-input-number v-model="filterPanel.filterMicros.microTime"></v-input-number>
            <br />
            滤除小于{{this.$util.visualTime(filterPanel.filterMicros.microTime)}}的记录
          </div>
        </div> -->
    <!-- ID过滤 -->
    <!-- <div class="panel">
          <div class="panel-title">
            ID查看
            <div class="panel-tool">
              <v-switch v-model="filterPanel.filterById.flag" size="small"></v-switch>
            </div>
          </div>
          <div class="panel-body">
            <v-input-number v-model="filterPanel.filterById.Id"></v-input-number>
            <br />
            选择ID为{{filterPanel.filterById.Id}}的人员记录
          </div>
        </div> -->
    <!-- 单次停留 -->
    <!-- <div class="panel">
          <div class="panel-title">
            单次停留
            <div class="panel-tool">
              <v-switch v-model="filterPanel.filterByOnceStayTime.flag" size="small"></v-switch>
            </div>
          </div>
          <div class="panel-body">
            <v-input-number v-model="filterPanel.filterByOnceStayTime.min"></v-input-number>~
            <v-input-number v-model="filterPanel.filterByOnceStayTime.max"></v-input-number>
            <br />
            在某地单次停留时长在({{this.$util.visualTime(filterPanel.filterByOnceStayTime.min)}})~{{this.$util.visualTime(filterPanel.filterByOnceStayTime.max)}}
            之间
          </div>
        </div> -->
    <!-- 累计停留 -->
    <!-- <div class="panel">
          <div class="panel-title">
            累计停留
            <div class="panel-tool">
              <v-switch v-model="filterPanel.filterByTotalStayTime.flag" size="small"></v-switch>
            </div>
          </div>
          <div class="panel-body">
            <v-input-number v-model="filterPanel.filterByTotalStayTime.min"></v-input-number> ~
            <v-input-number v-model="filterPanel.filterByTotalStayTime.max"></v-input-number>
            <br />
            在某地累计停留时长在{{this.$util.visualTime(filterPanel.filterByTotalStayTime.min)}}~{{this.$util.visualTime(filterPanel.filterByTotalStayTime.max)}}之间
          </div>
        </div> -->
    <!-- 入场时间 -->
    <!-- <div class="panel">
          <div class="panel-title">
            入场时间
            <div class="panel-tool">
              <v-switch v-model="filterPanel.filterByInTimeLessThan.flag" size="small"></v-switch>
            </div>
          </div>
          <div class="panel-body">
            <v-input-number v-model="filterPanel.filterByInTimeLessThan.minTime"></v-input-number>
            <br />
            入场时间早于{{this.$util.formatTime(filterPanel.filterByInTimeLessThan.minTime, 'hm')}}
          </div>
        </div> -->
    <!-- 离场时间 -->
    <!-- <div class="panel">
          <div class="panel-title">
            离场时间
            <div class="panel-tool">
              <v-switch v-model="filterPanel.filterByOutTimeGreaterThan.flag" size="small"></v-switch>
            </div>
          </div>
          <div class="panel-body">
            <v-input-number v-model="filterPanel.filterByOutTimeGreaterThan.maxTime"></v-input-number>
            <br />
            离场时间晚于{{this.$util.formatTime(filterPanel.filterByOutTimeGreaterThan.maxTime, 'hm')}}
          </div>
        </div> -->
    <!-- 持续逗留 -->
    <!-- <div class="panel">
          <div class="panel-title">
            持续逗留
            <div class="panel-tool">
              <v-switch v-model="filterPanel.filterByStayBetween.flag" size="small"></v-switch>
            </div>
          </div>
          <div class="panel-body">
            <v-input-number v-model="filterPanel.filterByStayBetween.minTime"></v-input-number> ~
            <v-input-number v-model="filterPanel.filterByStayBetween.maxTime"></v-input-number>
            <br />
            于{{this.$util.formatTime(filterPanel.filterByStayBetween.minTime, 'hm')}}~{{this.$util.formatTime(filterPanel.filterByStayBetween.maxTime, 'hm')}}期间未曾离开某地
          </div>
        </div> -->
    <!-- </div>
    </v-col> -->
  </v-row>
</template>

<script>
import ParallelTimeline from "./parallelTimeline.js";
import Filter from './Filter.js';
export default {
  data() {
    return {
      chartId: 'parallel_timeline' + this.$util.randomString(),
      parallelTimeline: undefined,
      lineDataFilter: new Filter(),
      filterData: {},
      filterPanel: {
        filterByOnceStayTime: {
          flag: false,
          min: 3 * 60 * 60,
          max: 6 * 60 * 60
        },
        filterByTotalStayTime: {
          flag: false,
          min: 8 * 60 * 60,
          max: 15 * 60 * 60
        },
        filterByInTimeLessThan: {
          flag: false,
          minTime: 30000
        },
        filterByOutTimeGreaterThan: {
          flag: false,
          maxTime: 68000
        },
        filterByStayBetween: {
          flag: false,
          minTime: 38580,
          maxTime: 39000
        },
        filterMicros: {
          flag: true,
          microTime: 30 * 60
        },
        filterById: {
          Id: 10000,
          flag: false
        }
      }
    }
  },
  methods: {
    paint({ minTime, maxTime, lineData, parallelAxis }) {
      var chartDiv = document.getElementById(this.chartId);
      var option = {
        chartId: this.chartId,
        width: chartDiv.style.width || chartDiv.clientWidth || chartDiv.offsetWidth || chartDiv.scrollWidth,
        parallelAxis: parallelAxis,
        lineData: lineData,
        minTime: minTime,
        maxTime: maxTime
      }
      this.parallelTimeline = this.parallelTimeline || new ParallelTimeline();
      this.parallelTimeline.setOption(option);
      this.parallelTimeline.paint();
    },
    changeLineData(lineData, filterByIdArray) {
      var vm = this;
      this.lineDataFilter.status = lineData
      this.filterData =
        this.lineDataFilter
          .filterByOnceStayTime(this.filterPanel.filterByOnceStayTime)
          .filterByTotalStayTime(this.filterPanel.filterByTotalStayTime)
          .filterByInTimeLessThan(this.filterPanel.filterByInTimeLessThan)
          .filterByOutTimeGreaterThan(this.filterPanel.filterByOutTimeGreaterThan)
          .filterByStayBetween(this.filterPanel.filterByStayBetween)
          .filterMicros(this.filterPanel.filterMicros)
          .filterById(this.filterPanel.filterById)
          .filterByIdArray(filterByIdArray)

      this.parallelTimeline.paintLineData(this.filterData.status)
        .on("click",
          function (x, y, z) {
            vm.$emit('lineClick', x)
          });
    }
  }
}
</script>

<style lang="less">
.panel {
  padding: 5px;
  border: 1px solid black;
  margin: 5px 0;
  .panel-title {
    margin: 5px;
    padding: 5px;
    font-weight: bold;
    border-bottom: 1px #ccc solid;
    .panel-tool {
      float: right;
    }
  }
  .panel-body {
    margin: 5px;
  }
}
</style>
