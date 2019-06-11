<template>
  <div>
    <!-- <v-row>
      <div class="div_title">操作栏</div>
      <div class="div_card">
        与会人员ID
        <v-select style="width: 200px" search :loading="isLoading" :remote-method="remoteMethod" :data="filtedConfereesList" :allowClear="false" placeholder="输入与会人员ID" @search="queryChange" @change="confereeSelected"></v-select> -->
    <!-- <v-button type="primary" @click="paintStage">绘制</v-button> -->
    <!-- <v-button type="primary" @click="addLayout">添加布局</v-button> -->
    <!-- <v-button type="primary" @click="removeLayout">清除布局</v-button> -->
    <!-- <v-button type="primary" @click="removeAllMove">清空人员移动记录</v-button> -->
    <!-- <v-button type="primary" @click="interrupt">中断动画</v-button> -->
    <!-- <v-button type="primary" @click="test">测试</v-button> -->
    <!-- </div>
    </v-row> -->

    <!-- stage -->
    <v-row>
      <v-col :span="12">
        <!-- <div style="width: 800px;"> -->
        <div class="div_title">人员移动追踪
          <div class="div_title_operation red">
            <v-select style="width: 200px" search :loading="isLoading" :remote-method="remoteMethod" :data="filtedConfereesList" :allowClear="false" size="sm" placeholder="输入与会人员ID" @search="queryChange" @change="confereeSelected" :value="defaultConfereeId"></v-select>
            <!-- <v-button type="primary" size="small" @click="sameLayout">同色</v-button> -->
            <v-button type="primary" size="small" @click="allLayout">全色</v-button>
            <!-- <v-button type="primary" size="small" @click="someLayout">选中</v-button> -->
            <v-button type="primary" size="small" @click="timeHeat">热力</v-button>
            <!-- <v-button type="primary" size="small" @click="removeCircle">除圆</v-button> -->
            <!-- 当前时间： {{sliderTimeFormatted}} -->
          </div>
        </div>
        <!-- time bar -->
        <!-- <div>
          <v-row>
            <v-col :span="4">
              时间： <v-input-number :min="0" :max="60*60*24*3" :step="1" v-model="sliderDateTime" @change="sliderDateTimeInputChange"></v-input-number>
            </v-col>
            <v-col :span="20">
              <v-slider :min="0" :max="60*60*24*3" :tip-formatter="sliderTipFormatter" v-model="sliderDateTime" :disabled="true"></v-slider>
            </v-col>
          </v-row>
        </div> -->
        <div class="div_card center">
          <div :id="stageId" style="text-align: center;"></div>
        </div>
        <!-- </div> -->
      </v-col>
      <v-col :span="2">
        <!-- <div style="width: 120px;"> -->
        <div class="div_title">布局图例</div>
        <div class="div_card center">
          <layoutLegend @legendClick="legendClick" ref="layoutLegend"></layoutLegend>
        </div>
        <!-- </div> -->
        <div class="div_title">会议特性
        </div>
        <div class="div_card">
          <meeting-feature ref="meetingFeature" style="height: 135px;"></meeting-feature>
        </div>
      </v-col>
      <v-col :span="10">
        <div class="div_title">人员列表信息
          <div class="div_title_operation red">
            播放速度： <v-input-number size="small" :min="200" :max="1000" :step="10" v-model="transitionSpeed" @change="transitionSpeedChange"></v-input-number>
            <v-button type="primary" size="small" @click="playMoveData">播放</v-button>
            <v-button type="primary" size="small" @click="pause">暂停</v-button>
          </div>
        </div>
        <v-row>
          <v-col :span="4">
            <div class="div_card center" style="height: 260px;">
              <movedata-list ref="confereeList" @rowClick="confereeListClick"></movedata-list>
            </div>
          </v-col>
          <v-col :span="20">
            <div id="scrollDiv" class="div_card center" style="height: 260px; overflow-y: scroll;">
              <movedata-list ref="movedataList" @rowClick="moveDataListClick"></movedata-list>
            </div>
          </v-col>
        </v-row>
        <div class="div_title">人员统计信息
          <div class="div_title_operation red">
            时间：<v-select placeholder="时间长度" :allowClear="false" style="width: 50px;" v-model="statisticsDaySelection" size="sm" :data="statisticsDaySelectionOptions"></v-select>
            按<v-select placeholder="统计方式" :allowClear="false" style="width: 100px;" v-model="statisticsTypeSelection" size="sm" :data="statisticsTypeSelectionOptions"></v-select>
            <v-button type="primary" size="small" @click="statistics">统计</v-button>
          </div>
        </div>
        <v-row>
          <v-col :span="12">
            <div class="div_card">
              <bar-chart ref="barChart" style="height: 250px;"></bar-chart>
            </div>
            <div class="div_card">
              <word-cloud ref="wordCloud" style="height: 250px;"></word-cloud>
            </div>
          </v-col>
          <v-col :span="12">
            <div class="div_card">
              <pie-chart ref="pieChart" style="height: 250px;"></pie-chart>
            </div>
            <div class="div_card">
              <radar-chart ref="radarChart" style="height: 250px;"></radar-chart>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- <v-row>
        <div class="div_title">会议特性
        </div>
        <div class="div_card">
          <meeting-feature ref="meetingFeature"></meeting-feature>
        </div>
    </v-row> -->
  </div>
</template>

<script>
import * as d3 from 'd3';
import Stage from '../../components/Stage.js';
import layoutLegend from './layoutLegend.vue';
import movedataList from './dataList.vue';
import barChart from './barChart.vue';
import pieChart from './pieChart.vue';
import wordCloud from './wordCloud.vue';
import radarChart from './radarChart.vue';
import meetingFeature from './meetingFeature.vue';
export default {
  props: ["defaultConfereeId"],
  components: { layoutLegend, movedataList, barChart, pieChart, wordCloud, radarChart, meetingFeature },
  data() {
    return {
      ip: this.$store.state.ip,
      allConfereesUrl: '/days/allConferees',
      oneConfereeSensorsUrl: '/days',
      allSensorsUrl: '/sensor/getAll',
      layoutUrl: '/sensor/layout',
      allConfereesList: [],
      filtedConfereesList: [],
      oneConfereeSensorsList: [],
      allSensorsList: [],
      floorCellsList: [],
      layoutList: [],
      nestedLayout: [],
      isLoading: false,
      debounceTimer: undefined, // 防抖
      debounceTime: 2000, // 抖动时间2s
      selectedConfereeId: undefined, // 操作栏
      stageId: 'stage',
      stage: {},
      xLength: 16,
      yLength: 30,
      option: {
        cellFill: this.$util.cellFill,
        hasWall: true
      },
      statisticsTypeSelectionOptions: [
        { value: '出现频次', label: '出现频次' },
        { value: '停留时长', label: '停留时长' },
      ],
      statisticsDaySelectionOptions: [
        { value: 0, label: '全' },
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 }
      ],
      statisticsTypeSelection: '停留时长',
      statisticsDaySelection: 0,
      staytimeData: [],
      frequencyData: [],
      sensorTimeData: [],
      selectedLegend: undefined,
      // sliderDateTime: 0,
      currentSelectedListConfereeId: null, // 列表
      currentMoveDataList: [],
      currentMoveDataIndex: 0,
      intervalId: undefined,
      transitionSpeed: 200,
      currentMoveDataListWithStayTime: [],
      combineSequenceData: []
    }
  },
  // computed: {
  //   sliderTimeFormatted() {
  //     let dateTime = this.$util.formatTime(this.sliderDateTime);
  //     return `第${dateTime.date}天${dateTime.time}`;
  //   }
  // },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.isLoading = true;
        // 定时器防抖，在用户输入后等待1秒，不再继续输入则开始过滤搜索
        this.debounceTimer = setTimeout(() => {
          this.filtedConfereesList = this.allConfereesList.filter(item => {
            return item.label.indexOf(query) > -1;
          });
          this.isLoading = false;
        }, this.debounceTime);
      } else {
        this.filtedConfereesList = [];
      }
    },
    queryChange() {
      clearTimeout(this.debounceTimer);
    },
    // 与会人员ID列表
    getAllConferees() {
      this.$http.get(this.ip + this.allConfereesUrl).then(Response => {
        this.allConfereesList = Response.data.map(item => {
          // 字符串格式方便查询过滤
          return { value: item, label: '' + item };
        });
      })
    },
    // 操作栏的人员ID选择
    confereeSelected(confereeId) {
      this.selectedConfereeId = confereeId;
      let postContent = {
        id: confereeId
      }
      this.getConfereeSensors(postContent);
    },
    // 人员移动数据
    getConfereeSensors(postContent) {
      this.$http.post(this.ip + this.oneConfereeSensorsUrl, postContent).then(Response => {
        console.log(Response.data);
        this.oneConfereeSensorsList = Response.data;
        this.stage.addOneConfereeMoveData(this.oneConfereeSensorsList);

        this.paintConfereeList();
        this.paintMoveDataList(this.selectedConfereeId);
        this.timeHeat();
      })
    },
    // 传感器位置信息
    getAllSensors() {
      this.$http.get(this.ip + this.allSensorsUrl).then(Response => {
        // console.log(Response.data);
        this.allSensorsList = Response.data;
        this.paintStage();
      })
    },
    // 布局信息
    getLayout() {
      this.$http.get(this.ip + this.layoutUrl).then(Response => {
        // console.log(Response.data);
        this.layoutList = Response.data;
        this.nestedLayout = d3.nest()
          .key(d => d.layout)
          .entries(Response.data)
      })
    },
    // 绘制图例
    paintLegend() {
      this.$refs.layoutLegend.paintLegend(this.option, Array.from(this.option.cellFill.layout.keys()));
    },
    // 图例点击
    legendClick(selectedLegend) {
      this.selectedLegend = selectedLegend;
    },
    // 人员列表点击
    confereeListClick(d) {
      this.currentSelectedListConfereeId = d[0];
      this.paintMoveDataList(this.currentSelectedListConfereeId);
    },
    // 移动记录列表点击
    moveDataListClick(d, i) {
      this.currentMoveDataIndex = i;
      this.displayCurrentPosition(i);
    },
    // 播放速度改变
    transitionSpeedChange() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.pause();
      }, this.debounceTime);
    },
    // 滑动时间轴改变,联动列表
    // sliderDateTimeInputChange() {
    //   clearTimeout(this.debounceTimer);
    //   this.debounceTimer = setTimeout(() => {
    //     let trueTime = 0;
    //     for (let i = 0; i < this.currentMoveDataList.length; i++) {
    //       trueTime = this.$util.getTrueTime(this.currentMoveDataList[i][1], this.currentMoveDataList[i][2]);
    //       if (this.sliderDateTime <= trueTime) {
    //         this.moveDataListClick(this.currentMoveDataList[i - 1], i - 1);
    //         this.manualImitateClick();
    //         return;
    //       }
    //     }
    //   }, this.debounceTime);
    // },
    // 人员地点信息统计
    statistics() {
      this.updateCurrentMoveDataListWithStayTime(this.statisticsDaySelection);
      var paintData = this.statisticsTypeSelection === '停留时长' ? this.staytimeData : this.frequencyData;
      paintData.sort((a, b) => b.value - a.value); // 排序
      // bar
      this.$refs.barChart.paintBar(
        {
          color: paintData.map(d => this.option.cellFill.layout.get(d.key)),
          xData: paintData.map(d => d.key),
          seriesData: [
            {
              name: this.statisticsTypeSelection,
              type: 'bar',
              data: paintData
            }
          ]
        }
      );
      // pie
      this.$refs.pieChart.paintPie(
        {
          color: paintData.map(d => this.option.cellFill.layout.get(d.key)),
          seriesData:
          {
            name: '出现地点',
            type: 'pie',
            center: ['68%', '60%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: params => {
                  return params.name + "\n" + params.percent + "%";
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            data: JSON.parse(JSON.stringify(paintData).replace(/key/g, 'name'))
          }
        }
      );
      // wordCloud
      this.$refs.wordCloud.paintCloud(
        this.option.cellFill.layout,
        JSON.parse(JSON.stringify(paintData).replace(/key/g, 'name'))
      );
      // radar
      console.log(paintData)
      this.$refs.radarChart.paintRadar(paintData);
    },
    // 滑块提示框格式化
    // sliderTipFormatter(value) {
    //   return `${value}s`
    // },

    // 绘制展示地图
    paintStage() {
      this.stage.initStage(this.allSensorsList);
      this.bindCellClick();
    },
    // 绘制人员移动记录列表
    paintMoveDataList(confereeId) {
      this.updateCurrentMoveDataList(confereeId);
      this.statistics();
      this.$refs.movedataList.paintList(
        { margin: 1, cellWidth: 58 },
        ['序列', '日程', '时间', '传感器', '楼层', 'x', 'y', '布局', '停留时长'],
        this.currentMoveDataListWithStayTime
      );
    },
    // 绘制与会人员列表
    paintConfereeList() {
      this.$refs.confereeList.paintList(
        { margin: 5 },
        ['与会人员'],
        this.stage.circleData_allConfereeMoveData.map(d => [d.confereeId])
      );
    },
    // 定时器播放移动记录
    playMoveData() {
      if (this.intervalId === undefined) {
        this.intervalId = setInterval(() => {
          this.displayCurrentPosition(this.currentMoveDataIndex);
          this.manualImitateClick();
          if (this.currentMoveDataIndex === this.currentMoveDataList.length) {
            clearInterval(this.intervalId);
          }
        }, this.transitionSpeed);
      }
    },
    // 自动播放时需要手动触发click使得rowRect边框变红
    manualImitateClick() {
      var cellSize = 24;
      this.$refs.movedataList.rowRectClick(this.currentMoveDataList[this.currentMoveDataIndex], this.currentMoveDataIndex++);
      // 滚动滑轮至可视区域
      this.scrollArea("scrollDiv", (this.currentMoveDataIndex - 5) * cellSize);
    },
    // 暂停播放
    pause() {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    },
    // 显示当前位置
    displayCurrentPosition(currentIndex) {
      this.stage.paintConfereeBySequence(this.currentMoveDataList[currentIndex]);
      // this.setSliderTime(currentIndex);
    },
    // 联动时间轴
    // setSliderTime(currentIndex) {
    //   let cmd = this.currentMoveDataList[currentIndex];
    //   this.sliderDateTime = this.$util.getTrueTime(cmd[1], cmd[2]);
    // },
    // 更新当前移动记录列表数据
    updateCurrentMoveDataList(confereeId) {
      this.currentMoveDataList = this.stage.getOneConfereeMoveData(confereeId).moveData.map(d => [d.sequence, d.day, d.time, d.sensor.sid, d.sensor.floor, d.sensor.x, d.sensor.y, d.sensor.layout]);
    },
    // 更新当前移动记录列表数据，带有 停留时间， 并且准备频次和时长数据
    updateCurrentMoveDataListWithStayTime(day) {
      this.currentMoveDataListWithStayTime = [];
      for (let i = 0; i < this.currentMoveDataList.length; i++) {
        this.currentMoveDataListWithStayTime[i] = this.currentMoveDataList[i].slice(0);
        this.currentMoveDataListWithStayTime[i].push(this.$util.getStayTime(this.currentMoveDataList[i], this.currentMoveDataList[i + 1]));
      }

      let currentMoveDataListWithStayTimeFiltedByDay = this.currentMoveDataListWithStayTime.filter(d => day === 0 || d[1] === day)
        .map(d => d.slice(0)); // 深拷贝

      // 制造数据
      this.frequencyData = d3.nest().key(d => d[7]).rollup(v => v.length).entries(currentMoveDataListWithStayTimeFiltedByDay)
      this.staytimeData = d3.nest().key(d => d[7]).rollup(v => v.reduce((a, c) => a + c[8], 0)).entries(currentMoveDataListWithStayTimeFiltedByDay)
      this.sensorTimeData = d3.nest().key(d => d[3]).rollup(v => v.reduce((a, c) => a + c[8], 0)).map(currentMoveDataListWithStayTimeFiltedByDay)
      // meeting feature
      var a = [];
      for (let c of currentMoveDataListWithStayTimeFiltedByDay) {
        let pre = a.pop();
        if (pre && (pre[7] === c[7])) {
          pre[8] += c[8];
          a.push(pre);
        } else {
          pre && a.push(pre);
          a.push(c);
        }
      }
      // filt
      var filterLayout = ['主会场', '分会场A', '分会场B', '分会场C', '分会场D'];
      this.combineSequenceData = a.filter(d => filterLayout.includes(d[7]));
      console.log(this.combineSequenceData);
      this.$refs.meetingFeature.paint(this.combineSequenceData)
    },
    // 滚动区域
    scrollArea(id, value) {
      document.getElementById(id).scrollTop = value;
    },
    // 绑定格子点击事件
    bindCellClick() {
      var vm = this;
      this.stage.cellView_CellGroup.on("click", function (x) {
        if (vm.currentMoveDataListWithStayTime.length > 0) {
          let index = 0;
          vm.currentMoveDataListWithStayTime.reduce((a, c, i) => {
            if (c[3] === x.sid && a < c[8]) {
              index = i;
              return c[8];
            }
            return a;
          }, 0)
          if (index >= 0) {
            console.log(index)
            vm.currentMoveDataIndex = index;
            vm.displayCurrentPosition(vm.currentMoveDataIndex);
            vm.manualImitateClick();
          }
        }
      })
    },



    // test
    // removeCircle() {
    //   this.stage.removeMoveDataCircle();
    // },
    // removeLayout() {
    //   this.$refs.layoutLegend.removeLegend();
    // },
    // removeAllMove() {
    //   this.stage.removeAllMoveRecord();
    // },
    allLayout() {
      this.stage.displayAllLayoutCellFill();
    },
    timeHeat() {
      console.log(this.sensorTimeData)
      this.stage.timeHeatFill(this.sensorTimeData);
    },
    // someLayout() {
    //   this.stage.displaySomeLayoutCellFill(this.selectedLegend);
    // },
    // sameLayout() {
    //   this.stage.displayAllLayoutSameCellFill();
    // },
    // interrupt() {
    //   this.stage.interruptConfereeMoveTransition();
    // },
    test() {
      // this.stage.paintOneConfereeMoveTransition(this.currentSelectedListConfereeId, 1);
    }

  },
  mounted() {
    this.stage = new Stage(this.option);
    this.getAllConferees();
    this.getAllSensors();
    this.paintLegend();
    this.defaultConfereeId && this.confereeSelected(this.defaultConfereeId);
  }
}
</script>


<style>
</style>
