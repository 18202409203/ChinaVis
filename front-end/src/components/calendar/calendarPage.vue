<template>
  <div>
    <!-- row 1 -->
    <v-row>
      <!-- col 1 -->
      <v-col :span="4">
        <!-- 控制面板 -->
        <div class="div_title">控制面板
        </div>
        <div class="div_card" style="height: 370px; overflow-y: auto;">
          <div class="panel">
            <div class="panel-title">瀑布图</div>
            <div class="panel-body">
              <div class="panel-item">绘制全部：<v-switch v-model="parallelIsAll" size="small"></v-switch>
              </div>
              <div class="panel-item">起始时间：<v-input-number size="small" :min="startSecond" :max="endSecond" :step="1" v-model="startSecond" style="width: 50px;"></v-input-number>s({{this.$util.formatTime(startSecond).time}})</div>
              <div class="panel-item">采样间隔：<v-input-number size="small" :min="1" :max="3600" :step="1" v-model="interval" style="width: 50px;"></v-input-number>s</div>
              <div class="panel-item">结束时间：<v-input-number size="small" :min="startSecond" :max="endSecond" :step="1" v-model="endSecond" style="width: 50px;"></v-input-number>s({{this.$util.formatTime(endSecond).time}})</div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">逗留时长人员分布柱状图和饼图</div>
            <div class="panel-body">
              <div class="panel-item">地点：<v-select placeholder="地点选择" :allowClear="false" style="width: 150px;" :value="defaultLayout" @change="layoutSelected" size="sm" :data="layoutOptions"></v-select>
              </div>
              <div class="panel-item">分段：<v-input-number size="small" :min="5" :max="50" :step="1" v-model="segment"></v-input-number>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">人流路径</div>
            <div class="panel-body">
              <div class="panel-item">数据源选择：<v-select placeholder="数据源选择" :allowClear="false" v-model="selectedType" size="sm" :data="typeOptions" style="min-width: 100px;"></v-select>
              </div>
            </div>
          </div>
        </div>
        <!-- 饼图 -->
        <div class="div_title">逗留时长三日对比
        </div>
        <div class="div_card">
          <pie-chart ref="pieChart" style="height: 280px;"></pie-chart>
        </div>
      </v-col>
      <!-- col 2 -->
      <v-col :span="14">
        <!-- 瀑布 -->
        <div class="div_title">各地点人流瀑布
          <div class="div_title_operation red">
            地点：
            <v-select placeholder="地点选择" :value="selectedLayouts" size="sm" multiple :data="layoutOptions" @change="selectLayoutsChanged" style="min-width: 200px;"></v-select>
            日程：
            <v-select placeholder="日程选择" :value="selectedDays" size="sm" multiple :data="dayOptions" @change="selectDayChanged" style="min-width: 100px;"></v-select>
            <!-- 起始({{this.$util.formatTime(startSecond).time}}):
            <v-input-number size="small" :min="startSecond" :max="endSecond" :step="1" v-model="startSecond" style="width: 50px;"></v-input-number>
            间隔:
            <v-input-number size="small" :min="1" :max="3600" :step="1" v-model="interval" style="width: 50px;"></v-input-number>
            结束({{this.$util.formatTime(endSecond).time}}):
            <v-input-number size="small" :min="startSecond" :max="endSecond" :step="1" v-model="endSecond" style="width: 50px;"></v-input-number> -->
            <v-button @click="paintParallel" size="small" type="primary">绘制</v-button>
            <!-- <v-button @click="changeParallelData" size="small" type="primary">读取</v-button> -->
          </div>
        </div>
        <div class="div_card" style="height: 700px;">
          <parallel-timeline ref="parallelTimeline" @lineClick="lineClick"></parallel-timeline>
        </div>
      </v-col>
      <!-- col 3 -->
      <v-col :span="6">
        <!-- 地图 -->
        <!-- <div class="div_title">人流热力及路径
          <div class="div_title_operation">
            <v-button type="primary" size="small" @click="sameLayout">无色</v-button>
            <v-button type="primary" size="small" @click="allLayout">全色</v-button>
            <v-button type="primary" size="small" @click="getPathClick">读取</v-button>
            <v-select placeholder="数据源选择" :allowClear="false" v-model="selectedType" size="sm" :data="typeOptions" style="min-width: 100px;"></v-select>
            <v-button type="primary" size="small" @click="autoPlay">播放</v-button>
            <v-button type="primary" size="small" @click="clearAutoPlay">停止</v-button>
          </div>
        </div> -->
        <div class="div_title">
          人流热力及路径
          <div class="div_title_operation red">
            第{{selectedDays[0]}}天 {{sliderTipFormatter(sliderDateTime)}}
            <div style="width: 250px;display: inline-grid;">
              <v-slider @change="sliderChange" :min="startSecond" :max="endSecond" :step="interval" v-model="sliderDateTime" :tip-formatter="null" style="margin: 1px 6px;"></v-slider>
            </div>
            <v-icon v-if="countHeatFlag" type="check-circle-o" style="color: green;"></v-icon>
            <v-icon v-else type="close-circle-o" style="color: red;"></v-icon>
          </div>
        </div>
        <div class="div_card">
          <div :id="stageTraceOption.stageId" style="text-align: center;"></div>
        </div>
        <!-- 传感器记录 -->
        <div class="div_title">传感器人次记录
          <div class="div_title_operation red">
            当前SID：{{clickedSensor}}
            瀑布图筛选<v-switch v-model="sensorFilter.flag" size="small"></v-switch>
          </div>
        </div>
        <div class="div_card center" style="height: 200px; overflow-y: auto;">
          <data-list ref="confereeList" @rowClick="sensorListClick"></data-list>
        </div>
      </v-col>
    </v-row>
    <!-- row 2 -->
    <v-row>
      <!-- 逗留 -->
      <v-col :span="10">
        <div class="div_title">逗留时长人员分布
          <!-- <div class="div_title_operation red">
            地点：<v-select placeholder="地点选择" :allowClear="false" style="width: 150px;" :value="defaultLayout" @change="layoutSelected" size="sm" :data="layoutOptions"></v-select>
            分段：<v-input-number size="small" :min="5" :max="50" :step="1" v-model="segment"></v-input-number>
          </div> -->
        </div>
        <div class="div_card">
          <bar-chart ref="barChart" style="height: 250px;"></bar-chart>
        </div>
      </v-col>
      <!-- 筛选 -->
      <v-col :span="2">
        <div class="div_title">筛选列表
          <div class="div_title_operation red">
            瀑布图筛选<v-switch v-model="stayTimeFilter.flag" size="small"></v-switch>
          </div>
        </div>
        <div class="div_card center" style="height: 260px; overflow-y: scroll;">
          <data-list ref="IdDataList" @rowClick="stayTimeListClick"></data-list>
        </div>
      </v-col>
      <!-- 人流 -->
      <v-col :span="12">
        <div class="div_title">人流量时间趋势
          <div class="div_title_operation red">
            <v-button type="primary" size="small" @click="showConfereeModal">查人</v-button>
            <v-button type="primary" size="small" @click="getPathClick">绘制路径</v-button>
          </div>
        </div>
        <div class="div_card">
          <layout-traffic ref="layoutTraffic" style="height: 250px;" @brushSelected="brushed"></layout-traffic>
        </div>
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col :span="12">
      </v-col>
      <v-col :span="12">
        <v-row>
          <div class="div_title">人流量时间趋势
          </div>
          <div class="div_card">
            <layout-traffic ref="layoutTraffic" style="height: 300px;" @brushSelected="brushed"></layout-traffic>
          </div>
        </v-row>
        <v-row>
          <v-col :span="18">
            <div class="div_title">逗留时长人员分布
              <div class="div_title_operation red">
                地点：<v-select placeholder="地点选择" :allowClear="false" style="width: 150px;" :value="defaultLayout" @change="layoutSelected" size="sm" :data="layoutOptions"></v-select>
                分段：<v-input-number size="small" :min="5" :max="50" :step="1" v-model="segment"></v-input-number>
              </div>
            </div>
            <div class="div_card">
              <bar-chart ref="barChart" style="height: 200px;"></bar-chart>
            </div>
          </v-col>
          <v-col :span="6">
            <div class="div_title">筛选人员列表
              <div class="div_title_operation red">
                瀑布图筛选<v-switch v-model="stayTimeFilter.flag" size="small"></v-switch>
              </div>
            </div>
            <div class="div_card center" style="height: 210px; overflow-y: scroll;">
              <data-list ref="IdDataList" @rowClick="stayTimeListClick"></data-list>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col :span="10">
            <div class="div_title">传感器人次记录
              <div class="div_title_operation red">
                当前SID：{{clickedSensor}}
                瀑布图筛选<v-switch v-model="sensorFilter.flag" size="small"></v-switch>
              </div>
            </div>
            <div class="div_card center" style="height: 285px; overflow-y: scroll;">
              <data-list ref="confereeList" @rowClick="sensorListClick"></data-list>
            </div>
          </v-col>
          <v-col :span="14">
            <div class="div_title">逗留时长三日对比
            </div>
            <div class="div_card">
              <pie-chart ref="pieChart" style="height: 275px;"></pie-chart>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
    <!-- 人员--对话框 -->
    <v-modal title="与会人员详细信息" :visible="confereeDialogVisible" :width="1700" :maskClosable="false" @cancel="cancelConfereeDialog" :hasFooter="false">
      <conferee-page :defaultConfereeId="defaultConfereeId"></conferee-page>
    </v-modal>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Stage from '../Stage.js';
import barChart from '../conferee/barChart.vue';
import dataList from '../conferee/dataList.vue';
import pieChart from '../conferee/pieChart.vue';
import layoutTraffic from './layoutTraffic.vue';
import parallelTimeline from '../calendar/parallelTimeline.vue';
import confereePage from '../conferee/confereePage.vue';
export default {
  components: { layoutTraffic, parallelTimeline, confereePage, barChart, pieChart, dataList },
  data() {
    return {
      ip: this.$store.state.ip,
      layoutUrl: '/sensor/layout',
      timeNodeUrl: '/days/allTimeNodes/',
      confereeCountsUrl: '/days/getConfereeCountsByLayoutByDay/',
      everyOneUrl: '/days/getEveryOneByDayByLayout/',
      pathUrl: '/days/getConfereesPath/',
      countsHeatUrl: '/days/getConfereeCountsByDay',
      layoutStayUrl: '/days/getConfereesLayoutTime/',
      layoutSensorConfereeUrl: '/days/selectSensorConferee/',
      layoutMap: [],
      layoutOptions: [],
      selectedLayouts: [],
      timeNodes: [],
      trafficData: [],
      selectedDays: [],
      dayOptions: [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 }
      ],
      typeOptions: [
        { value: 'stay', label: '头尾' },
        { value: 'out', label: '离场' },
        { value: 'in', label: '入场' },
        { value: 'always', label: '所有' },
      ],
      selectedType: 'always', // 所选时间段内的所有移动记录
      selectedLegend: '',
      startSecond: 25200, // 7:00
      sliderDateTime: 25200,
      interval: 60,
      endSecond: 73800, // 8:30
      stageTrace: undefined,
      stageTraceOption: {
        stageId: 'trace' + this.$util.randomString(),
        cellFill: this.$util.cellFill,
        cellSize: 12,
        hasWall: false
      },
      // stageHeat: undefined,
      // stageHeatOption: {
      //   stageId: 'heat',
      //   cellFill: this.$util.cellFill,
      //   hasWall: false
      // },
      brushedTimeNodeRange: [],
      countsHeat: {},
      countHeatFlag: false,
      autoPlayTimer: undefined,
      parallelTimelineData: [],
      parallelIsAll: true,
      confereeDialogVisible: false,
      layoutDialogVisible: false,
      defaultConfereeId: '',
      defaultLayout: '',
      sensorConfereeMap: undefined,
      clickedSensor: undefined,
      segment: 20,
      stayTimeFilter: {
        flag: false,
        Ids: []
      },
      sensorFilter: {
        flag: false,
        Ids: []
      }
    }
  },
  computed: {
  },
  methods: {
    showConfereeModal() {
      this.confereeDialogVisible = true;
    },
    cancelConfereeDialog() {
      this.confereeDialogVisible = false;
    },
    cancelLayoutDialog() {
      this.layoutDialogVisible = false;
    },
    // 绘图
    paintTraffic() {
      this.$refs.layoutTraffic.paintLine({
        x: this.trafficData[0].x,
        y: this.trafficData.map(t => {
          return {
            name: t.name + t.day,
            type: 'line',
            data: t.y
          }
        }),
        color: this.trafficData.map(d => this.$util.cellFill.layout.get(d.name))
      });
    },
    // 人流数据
    getTrafficData(selectedLayout, day) {
      this.$http.get(this.ip + this.confereeCountsUrl + day + `/${selectedLayout}/${this.startSecond}/${this.interval}/${this.endSecond}`).then(Response => {
        let confereeCounts = Response.data;
        this.timeNodes = confereeCounts.map(d => d[0]);
        this.trafficData.push({
          name: selectedLayout,
          day: day,
          x: confereeCounts.map(d => d[0]),
          y: confereeCounts.map(d => d[1])
        });
        console.log(this.trafficData);
        this.paintTraffic();
      })
    },
    // 布局信息
    getLayouts() {
      var vm = this;
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

        // this.stageHeat.initStage(Response.data)
        //   .on("click", function (x, y, z) {
        //     vm.openLayoutDialog(x.layout)
        //   });
        this.stageTrace.initStage(Response.data);
        this.stageTrace.displaySomeLayoutCellFill([this.layoutOption])
      })
    },
    // 地点选择改变
    selectLayoutsChanged(layouts) {
      // 读取新增的
      for (let layout of layouts) {
        if (!this.trafficData.map(d => d.name).includes(layout)) {
          for (let day of this.selectedDays) {
            this.getTrafficData(layout, day);
          }
        }
      }
      // 删掉去除的
      for (let t of this.trafficData) {
        if (!layouts.includes(t.name)) {
          this.trafficData = this.trafficData.filter(d => d.name !== t.name);
          this.trafficData.length > 0 && this.paintTraffic();
        }
      }
    },
    // 日程改变
    selectDayChanged(days) {
      // 读取新增的
      for (let day of days) {
        if (!this.trafficData.map(d => d.day).includes(day)) {
          for (let layout of this.selectedLayouts) {
            this.getTrafficData(layout, day);
          }
        }
      }
      // 删掉去除的
      for (let t of this.trafficData) {
        if (!days.includes(t.day)) {
          this.trafficData = this.trafficData.filter(d => d.day !== t.day);
          this.trafficData.length > 0 && this.paintTraffic();
        }
      }
    },
    // 刷选更新
    brushed(range) {
      this.brushedTimeNodeRange = range.map(d => this.timeNodes[d]);
    },
    // 得到路径信息
    getconfereesPath(start, end, day, layout) {
      this.$http.get(this.ip + this.pathUrl + `${start}/${end}/${day}/${layout}/${this.selectedType}`).then(Response => {
        // console.log(Response.data);
        // let nestByConferee = d3.nest()
        //   .key(d => d.id)
        //   .entries(Response.data)
        // console.log(nestByConferee);
        this.stageTrace.paintAllConfereeMoveData(Response.data);
      })
    },
    // 得到热力信息
    getCountsHeat(start, interval, end) {
      this.$http.all([
        this.$http.get('./api/confereeCountsDay_1.json'),
        this.$http.get('./api/confereeCountsDay_2.json'),
        this.$http.get('./api/confereeCountsDay_3.json')
        // this.$http.get(this.ip + this.countsHeatUrl + `/${1}/${start}/${interval}/${end}`),
        // this.$http.get(this.ip + this.countsHeatUrl + `/${2}/${start}/${interval}/${end}`),
        // this.$http.get(this.ip + this.countsHeatUrl + `/${3}/${start}/${interval}/${end}`)
      ])
        .then(this.$http.spread((one, two, three) => {
          this.countHeatFlag = true;
          this.countsHeat = {
            "1": one.data,
            "2": two.data,
            "3": three.data,
          }
        }))
    },
    // 滑条移动
    sliderChange() {
      this.countHeatFlag && this.selectedDays.length > 0 && this.stageTrace.countHeatFill(this.countsHeat[this.selectedDays[0]][this.sliderDateTime], true);
    },
    // 自动播放人流热力
    autoPlay() {
      var vm = this;
      function increase() {
        vm.sliderDateTime += vm.interval;
        vm.sliderChange(); // 手动触发
      }
      this.autoPlayTimer = setInterval(increase, 200);
    },
    // 清除自动播放定时
    clearAutoPlay() {
      this.autoPlayTimer && clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = undefined;
    },
    // 点击读取路径按钮
    getPathClick() {
      this.getconfereesPath(this.brushedTimeNodeRange[0], this.brushedTimeNodeRange[1], this.selectedDays[0], this.selectedLayouts[0]);
    },
    // 图例点击
    // legendClick(selectedLegend) {
    //   this.selectedLegend = selectedLegend;
    //   console.log(selectedLegend, this.layoutMap);
    //   let selectedSensors = [];
    //   for (let legend of this.selectedLegend) {
    //     console.log(this.layoutMap.get(legend));
    //     console.log(this.layoutMap.get(legend).map(d => d.sid));
    //     selectedSensors = selectedSensors.concat(this.layoutMap.get(legend).map(d => d.sid))
    //   }
    //   console.log(selectedSensors);
    //   this.stageTrace.filterLinesBySensors(selectedSensors);
    // },
    // 绘制图例
    // paintLegend() {
    //   this.$refs.layoutLegend.paintLegend(this.stageTraceOption, Array.from(this.stageTraceOption.cellFill.layout.keys()));
    // },
    // 全色
    allLayout() {
      this.stageTrace.displayAllLayoutCellFill();
    },
    // 同色
    sameLayout() {
      this.stageTrace.displayAllLayoutSameCellFill();
    },
    // 滑块提示框格式化
    sliderTipFormatter(value) {
      return this.$util.formatTime(value).time
    },
    paintParallel() {
      this.selectedDays.length > 0 &&
        this.$http.get(this.ip + this.everyOneUrl + this.selectedDays[0] + `/all`).then(Response => {
          this.parallelTimelineData = [];
          for (let key in Response.data) {
            this.parallelTimelineData.push(Response.data[key])
          }
          this.$refs.parallelTimeline.paint(
            {
              minTime: this.startSecond,
              maxTime: this.endSecond,
              lineData: this.parallelTimelineData,
              parallelAxis: this.parallelIsAll ? Array.from(this.$util.cellFill.layout.keys()) : this.selectedLayouts
            }
          );
          this.changeParallelData();
        })
    },
    changeParallelData() {
      // zpj 2019-6-8 17:12:28
      console.log(this.stayTimeFilter, this.sensorFilter)
      if (this.stayTimeFilter.flag === true) {
        this.$refs.parallelTimeline.changeLineData(this.parallelTimelineData, this.stayTimeFilter);
      } else {
        this.$refs.parallelTimeline.changeLineData(this.parallelTimelineData, this.sensorFilter);
      }
    },
    // 瀑布图线条点击
    lineClick(x) {
      console.log(x.id);
      this.openConfereeDialog(x.id);
    },
    openConfereeDialog(id) {
      this.defaultConfereeId = id;
      this.showConfereeModal();
    },

    // layout page
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
              .map(d => [+d, s.seriesName])
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
      // 瀑布图筛选
      this.stayTimeFilter.Ids = dataList.map(d => d[0])
    },
    // 饼
    paintPie(pieSeries, interpolateReds) {
      var pieOption = {
        seriesData: [
          {
            name: '三天对比',
            type: 'pie',
            radius: [0, '15%'],
            center: ['60%', '60%'],
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
            radius: ['20%', '35%'],
            center: ['60%', '60%'],
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
            radius: ['40%', '55%'],
            center: ['60%', '60%'],
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
            radius: ['60%', '75%'],
            center: ['60%', '60%'],
            data: pieSeries[2]
          },
        ],
        color: this.$util.daysColor.concat(interpolateReds),
        closeHighLight: true,
        isHorizontal: false,
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

      this.stageTrace.timeHeatFill(daySensorCount, true)
      this.bindCellClick();
    },
    // 绑定格子点击事件
    bindCellClick() {
      var vm = this;
      this.stageTrace.cellView_CellGroup.on("click", function (x) {
        vm.clickedSensor = x.sid;
        if (vm.sensorConfereeMap.get(x.sid)) {
          // 数据列表
          var conferees = vm.sensorConfereeMap.get(x.sid).map(d => [d.id, d.sid, d.day, d.time])
          vm.$refs.confereeList.paintList(
            { margin: 1, cellWidth: 58 },
            ['ID', 'sid', 'day', 'time'],
            conferees)

          // 瀑布图筛选
          vm.sensorFilter.Ids = conferees.map(d => d[0])
        }
      })
    },
    stayTimeListClick(d) {
      console.log(d[0])
      this.openConfereeDialog(d[0])
    },
    sensorListClick(d) {
      console.log(d[0])
      this.openConfereeDialog(d[0])
    },
  },
  mounted() {
    this.stageTrace = new Stage(this.stageTraceOption);
    this.getLayouts();
    // this.paintLegend();

    // 离线数据
    this.getCountsHeat(this.startSecond, this.interval, this.endSecond);
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
    .panel-item {
      margin: 5px 0;
    }
  }
}
</style>
