<template>
  <div>
    <v-row>
      <!-- 左侧列 -->
      <v-col :span="12">
        <div class="div_title">地点人流热力
          <div class="div_title_operation red">
            地点：<v-select placeholder="地点选择" :allowClear="false" style="width: 150px;" :value="defaultLayout" @change="layoutSelected" size="sm" :data="layoutOptions"></v-select>
            分段：<v-input-number size="small" :min="5" :max="50" :step="1" v-model="segment"></v-input-number>
          </div>
        </div>
        <div class="div_card">
          <div :id="stageSensorOption.stageId" style="text-align: center;"></div>
        </div>
      </v-col>
      <!-- 右侧列 -->
      <v-col :span="12">
        <!-- 右侧第一行 -->
        <v-row>
          <v-col :span="18">
            <div class="div_title">逗留时长人员分布
            </div>
            <div class="div_card">
              <bar-chart ref="barChart" style="height: 400px;"></bar-chart>
            </div>
          </v-col>
          <v-col :span="6">
            <div class="div_title">筛选人员列表(会场工作人员)
            </div>
            <div class="div_card center" style="height: 410px; overflow-y: scroll;">
              <data-list ref="IdDataList" @rowClick="stayTimeListClick"></data-list>
            </div>
          </v-col>
        </v-row>
        <!-- 右侧第二行 -->
        <v-row>
          <v-col :span="14">
            <div class="div_title">逗留时长三日对比
            </div>
            <div class="div_card">
              <pie-chart ref="pieChart" style="height: 375px;"></pie-chart>
            </div>
          </v-col>
          <v-col :span="10">
            <div class="div_title">传感器人次记录(会议报告人员)
              <div class="div_title_operation red">
                {{clickedSensor}}
              </div>
            </div>
            <div class="div_card center" style="height: 385px; overflow-y: scroll;">
              <data-list ref="confereeList" @rowClick="sensorListClick"></data-list>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Stage from '../Stage.js';
import barChart from '../conferee/barChart.vue';
import dataList from '../conferee/dataList.vue';
import pieChart from '../conferee/pieChart.vue';
export default {
  props: ["defaultLayout"],
  components: { barChart, dataList, pieChart },
  data() {
    return {
      ip: this.$store.state.ip,
      layoutOptions: [],
      layoutUrl: '/sensor/layout',
      layoutStayUrl: '/days/getConfereesLayoutTime/',
      layoutSensorConfereeUrl: '/days/selectSensorConferee/',
      segment: 20,
      stageSensor: undefined,
      stageSensorOption: {
        stageId: 'sensorHeat' + this.$util.randomString(),
        cellFill: this.$util.cellFill,
        hasWall: false
      },
      sensorConfereeMap: undefined,
      clickedSensor: undefined
    }
  },
  methods: {
    async getData(layoutOption) {
      var vm = this;
      // 并发
      var [layoutStayData, layoutSensorConfereeData] = (
        await vm.$http.all([
          vm.$http.get(vm.ip + vm.layoutStayUrl + layoutOption),
          vm.$http.get(vm.ip + vm.layoutSensorConfereeUrl + layoutOption)
        ])
      ).map(d => d.data)
      var maxTime = layoutStayData['99999']['99999'] + 1
      delete layoutStayData['99999']
      var interpolateReds = []
      var conferees = []
      var xData = []
      for (let i = 0; i < vm.segment; i++) {
        let proportion = (i + 1) / vm.segment;
        xData[i] = this.$util.visualTime(proportion * maxTime)
        interpolateReds[i] = this.$util.interpolateReds(proportion)
      }
      // 柱数
      var barSeries = [
        {
          data: xData.map(d => 0),
          type: 'bar',
          name: '1'
        }, {
          data: xData.map(d => 0),
          type: 'bar',
          name: '2'
        }, {
          data: xData.map(d => 0),
          type: 'bar',
          name: '3'
        }
      ]
      // 饼数
      var pieSeries = [
        xData.map(d => { return { name: d, value: 0 } }),
        xData.map(d => { return { name: d, value: 0 } }),
        xData.map(d => { return { name: d, value: 0 } }),
      ]
      // 人员
      var confereesData = [
        {
          data: xData.map(d => []),
          name: '1'
        }, {
          data: xData.map(d => []),
          name: '2'
        }, {
          data: xData.map(d => []),
          name: '3'
        }
      ]
      if (layoutOption === '餐厅') {
        for (let key in layoutStayData) {
          conferees.push(key);
          for (let time in layoutStayData[key]) {
            if (time < 60 * 60 * 24) {
              // 第一天
              barSeries[0].data[floor(layoutStayData[key][time])] += 1
              pieSeries[0][floor(layoutStayData[key][time])].value += 1
              confereesData[0].data[floor(layoutStayData[key][time])].push(key)
            } else if (time < 60 * 60 * (24 + 16)) {
              // 第二天16点之前
              barSeries[1].data[floor(layoutStayData[key][time])] += 1
              pieSeries[1][floor(layoutStayData[key][time])].value += 1
              confereesData[1].data[floor(layoutStayData[key][time])].push(key)
            } else {
              // 第二天晚饭
              barSeries[2].data[floor(layoutStayData[key][time])] += 1
              pieSeries[2][floor(layoutStayData[key][time])].value += 1
              confereesData[2].data[floor(layoutStayData[key][time])].push(key)
            }
          }
        }
      } else {
        for (let key in layoutStayData) {
          conferees.push(key);
          for (let time of [1, 2, 3]) {
            if (layoutStayData[key][time]) {
              barSeries[time - 1].data[floor(layoutStayData[key][time])] += 1
              pieSeries[time - 1][floor(layoutStayData[key][time])].value += 1
              confereesData[time - 1].data[floor(layoutStayData[key][time])].push(key)
            }
          }
        }
      }

      this.confereesData = confereesData

      // paint bar
      var barOption = {
        xData: xData,
        seriesData: barSeries,
        color: this.$util.daysColor,
        title: layoutOption + '逗留时长人员分布图'
      }
      this.$refs.barChart.paintBar(barOption, vm.brushFunction);

      // paint pie
      this.paintPie(pieSeries, interpolateReds)

      // paint sensor conferee count heat
      this.paintSensorHeat(layoutSensorConfereeData)

      function floor(time) {
        return Math.floor(time / maxTime * vm.segment)
      }
    },
    layoutSelected(layout) {
      this.getData(layout)
    },
    brushFunction(brushed) {
      let selected = brushed.batch[0].selected
      var dataList = []
      for (let s of selected) {
        s && (
          dataList.push(...
            this.confereesData[s.seriesIndex].data
              .slice(s.dataIndex[0], s.dataIndex.slice(-1)[0] + 1)
              .reduce((a, c) => a.concat(c), [])
              .map(d => [d, s.seriesName])
          )
        )
      }
      console.log(dataList)

      // datalist
      this.$refs.IdDataList.paintList(
        { margin: 1, cellWidth: 55 },
        ['ID', 'Series'],
        dataList
      );
    },
    // 布局信息
    getLayouts() {
      this.$http.get(this.ip + this.layoutUrl).then(Response => {
        console.log(Response.data);
        this.layoutMap = d3.nest()
          .key(d => d.layout)
          .map(Response.data)
        this.layoutOptions = this.layoutMap.keys()
          .map(d => {
            return {
              value: d,
              label: d
            }
          })

        this.stageSensor.initStage(Response.data);
        this.stageSensor.displaySomeLayoutCellFill([this.layoutOption])
      })
    },
    // 饼
    paintPie(pieSeries, interpolateReds) {
      var pieOption = {
        seriesData: [
          {
            name: '三天对比',
            type: 'pie',
            radius: [0, '20%'],
            center: ['60%', '50%'],
            label: {
              normal: {
                show: false,
              }
            },
            data: pieSeries.map((p, i) => {
              return {
                value: p.reduce((a, c) => a + c.value, 0),
                name: i + 1
              }
            })
          },
          {
            name: '第一天',
            type: 'pie',
            label: {
              normal: {
                show: false,
              }
            },
            radius: ['25%', '45%'],
            center: ['60%', '50%'],
            data: pieSeries[0]
          },
          {
            name: '第二天',
            type: 'pie',
            label: {
              normal: {
                show: false,
              }
            },
            radius: ['50%', '70%'],
            center: ['60%', '50%'],
            data: pieSeries[1]
          },
          {
            name: '第三天',
            type: 'pie',
            label: {
              normal: {
                show: false,
              }
            },
            radius: ['75%', '95%'],
            center: ['60%', '50%'],
            data: pieSeries[2]
          },
        ],
        color: this.$util.daysColor.concat(interpolateReds),
        closeHighLight: true
      }
      this.$refs.pieChart.paintPie(pieOption);
    },
    // 热力
    paintSensorHeat(layoutSensorConfereeData) {
      var daySensorCount = d3.nest()
        .key(d => d.sid)
        .rollup(v => new Set(v.map(i => i.id)).size)
        .map(layoutSensorConfereeData)
      this.sensorConfereeMap = d3.nest()
        .key(d => d.sid)
        .map(layoutSensorConfereeData)

      this.stageSensor.timeHeatFill(daySensorCount, true)
      this.bindCellClick();
    },
    // 绑定格子点击事件
    bindCellClick() {
      var vm = this;
      this.stageSensor.cellView_CellGroup.on("click", function (x) {
        vm.clickedSensor = x.sid;
        if (vm.sensorConfereeMap.get(x.sid)) {
          var conferees = vm.sensorConfereeMap.get(x.sid).map(d => [d.id, d.sid, d.day, d.time])
          vm.$refs.confereeList.paintList(
            { margin: 1, cellWidth: 58 },
            ['ID', 'sid', 'day', 'time'],
            conferees)
        }
      })
    },
    stayTimeListClick(d) {
      this.$emit("layoutOpenConferee", d[0])
    },
    sensorListClick(d) {
      this.$emit("layoutOpenConferee", d[0])
    },
  },
  mounted() {
    this.stageSensor = new Stage(this.stageSensorOption);
    this.getLayouts();
    this.getData(this.defaultLayout);
  }
}
</script>

<style>
</style>
