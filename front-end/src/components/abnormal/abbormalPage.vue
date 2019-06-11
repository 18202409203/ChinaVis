<template>
  <div>
    <v-row>
      <v-col :span="12">
        <div class="div_title">人员分类旭日图
          <div class="div_title_operation red">
            <v-select placeholder="统计方式" :allowClear="false" v-model="sunburstType" size="sm" :data="sunburstTypeOptions"></v-select>
            <v-button type="primary" size="small" @click="getSunburstData">绘制</v-button>
            <v-input v-model="confereeId" size="small" style="width:200px;display:inline-block"></v-input>
            <v-button type="primary" size="small" @click="selectOne">选中</v-button>
          </div>
        </div>
        <div class="div_card">
          <sunburst ref="sunburst"></sunburst>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import sunburst from '../calendar/sequenceSunburst.vue';
export default {
  components: { sunburst },
  data() {
    return {
      ip: this.$store.state.ip,
      confereeLayoutTimeUrl: '/days/getConfereesLayoutTime/',
      averageTime: '',
      sunburstTypeOptions: [
        { label: '时间发生顺序', value: 'sequence' },
        { label: '停留时长排序', value: 'stayTime' }
      ],
      confereeId: '14815',
      sunburstType: 'stayTime'
    }
  },
  methods: {
    selectOne() {
      this.$refs.sunburst.highlight(this.confereeId);
    },
    // 旭日图数据
    getSunburstData() {
      if (this.sunburstType === 'sequence') {
        this.$refs.sunburst.paint('./api/sequence.csv');
      } else
        if (this.sunburstType === 'stayTime') {
          this.$refs.sunburst.paint('./api/sequence_layers.csv');
        }
    },
  },
  mounted() {
    // this.getAverageData('餐厅');
    // this.getAverageData('签到处');
    this.getSunburstData();
    // this.paintLineChart();
  }

}
</script>

<style>
</style>
