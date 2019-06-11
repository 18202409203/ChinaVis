package com.zpj.chinavis.service.serviceImpl;

import com.zpj.chinavis.dao.DaysMapper;
import com.zpj.chinavis.dao.SensorMapper;
import com.zpj.chinavis.dto.DaysDto;
import com.zpj.chinavis.model.Days;
import com.zpj.chinavis.model.Days_Layout;
import com.zpj.chinavis.service.DaysService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;


@Service
public class DaysImpl implements DaysService {

    @Resource
    private DaysMapper daysMapper;

    @Resource
    private SensorMapper sensorMapper;

    @Override
    public List<DaysDto> selectDays(Days days) {
        List<Days> daysList = daysMapper.selectDays(days);
        List<DaysDto> daysDtoList = new ArrayList<>();

        for (Days d : daysList) {
            DaysDto daysDto = DaysDto.toDto(d);
            daysDto.setSensor(sensorMapper.selectByPrimaryKey(d.getSid()));
            daysDtoList.add(daysDto);
        }
        return daysDtoList;
    }

    @Override
    public List<Integer> selectAllConferees() {
        return daysMapper.selectAllConferees();
    }

    @Override
    public List<Integer> selectConfereesByDay(Integer day) {
        return daysMapper.selectConfereesByDay(day);
    }

    @Override
    public List<Integer> selectTimeNodesByDay(Integer day) {
        return daysMapper.selectTimeNodesByDay(day);
    }

    @Override
    public Map<Integer, LinkedList<Days_Layout>> selectAllDaysWithLayoutByLayoutByDay(Integer day, String layout) {

        Map<Integer, LinkedList<Days_Layout>> id_daysLayoutTimeList_Map = new HashMap<>();

        /* ********* 计算 ******** */
        //List<Days_Layout> daysLayouts = daysMapper.selectAllDaysWithLayoutByDay(day);
        //for (Days_Layout daysLayout_cur : daysLayouts) {
        //    // 出入一致
        //    daysLayout_cur.setOutTime(daysLayout_cur.getInTime());
        //    // 根据ID分层
        //    LinkedList<Days_Layout> daysLayoutLinkedList = id_daysLayoutTimeList_Map
        //            .computeIfAbsent(daysLayout_cur.getId(), v -> new LinkedList<>());
        //    // 第一次直接添加
        //    if (daysLayoutLinkedList.size() == 0) {
        //        daysLayoutLinkedList
        //                .add(daysLayout_cur);
        //    } else {
        //        // 得到前一个
        //        Days_Layout daysLayout_pre = daysLayoutLinkedList
        //                .getLast();
        //        // 不等于前一个
        //        if (!daysLayout_cur.getLayout().equals(daysLayout_pre.getLayout())) {
        //            daysLayout_pre.setOutTime(daysLayout_cur.getInTime());
        //            daysLayoutLinkedList
        //                    .add(daysLayout_cur);
        //        }
        //    }
        //}

        /* ********* 读取,速度更快些 ******** */
        List<Days_Layout> days_layouts = daysMapper.selectDaysLayoutByLayoutByDay(day, layout);
        for (Days_Layout days_layout : days_layouts) {
            id_daysLayoutTimeList_Map
                    .computeIfAbsent(days_layout.getId(), v -> new LinkedList<>())
                    .add(days_layout);
        }

        // zpj 2019年4月22日23:26:26 创建新表测试
        //daysMapper.insertCount(id_daysLayoutTimeList_Map);

        return id_daysLayoutTimeList_Map;
    }

    @Override
    public List<List<Integer>> getConfereeCountsByLayoutByDay(Integer day, String layout, Integer startSecond, Integer interval, Integer endSecond) {
        Map<Integer, LinkedList<Days_Layout>> id_daysWithLayoutList_Map = selectAllDaysWithLayoutByLayoutByDay(day, layout);
        //List<Integer> minMax = daysMapper.selectMinMaxTimeByDay(day); // {min,max}
        List<List<Integer>> time_count_list = new ArrayList<>();

        for (int timeNode = startSecond; timeNode <= endSecond; timeNode += interval) {
            List<Integer> list = new ArrayList<>();
            // 时间
            list.add(timeNode);
            // 人流量
            int counts = 0;
            for (LinkedList<Days_Layout> daysLayoutList : id_daysWithLayoutList_Map.values()) {
                for (Days_Layout daysLayout : daysLayoutList) {
                    // 时间
                    if (timeNode >= daysLayout.getInTime() && (
                            timeNode < daysLayout.getOutTime() || (
                                    layout.equals("出口") && timeNode == daysLayout.getOutTime()
                            )
                    )) {
                        counts++;
                        break;
                    }
                }
            }
            list.add(counts);
            time_count_list.add(list);
        }

        return time_count_list;
    }

    @Override
    public Map<Integer, Map<String, Integer>> getConfereeCountsAllLayoutByDay(Integer day, Integer startSecond, Integer interval, Integer endSecond) {
        Map<Integer, LinkedList<Days_Layout>> id_daysWithLayoutList_Map = selectAllDaysWithLayoutByLayoutByDay(day, "all");
        List<String> layouts = sensorMapper.selectAllLayouts();
        //List<Integer> minMax = daysMapper.selectMinMaxTimeByDay(day); // {min,max}
        Map<Integer, Map<String, Integer>> time_layout_count_Map = new HashMap<>();

        for (int timeNode = startSecond; timeNode <= endSecond; timeNode += interval) {
            // 时间
            Map<String, Integer> layout_count_map = time_layout_count_Map.computeIfAbsent(timeNode, v -> new HashMap<>());
            //list.add();
            // 人流量
            for (LinkedList<Days_Layout> daysLayoutList : id_daysWithLayoutList_Map.values()) {
                for (Days_Layout daysLayout : daysLayoutList) {
                    Integer counts = layout_count_map.computeIfAbsent(daysLayout.getLayout(), v -> 0);
                    // 时间
                    if (timeNode >= daysLayout.getInTime() && (
                            timeNode < daysLayout.getOutTime() || (
                                    daysLayout.getLayout().equals("出口") && timeNode == daysLayout.getOutTime()
                            )
                    )) {
                        layout_count_map.put(daysLayout.getLayout(), ++counts);
                        break;
                    }
                }
            }
            time_layout_count_Map.put(timeNode, layout_count_map);
        }

        return time_layout_count_Map;
    }

    @Override
    public Map<Integer, List<Integer>> getEveryoneMatrixByDay(Integer day) {
        List<Days_Layout> everyoneData = daysMapper.selectDaysLayoutByDay(day);
        List<String> layouts = sensorMapper.selectAllLayouts();

        Map<Integer, List<Integer>> matrix = new HashMap<>();

        for (Days_Layout days_layout : everyoneData) {
            List<Integer> row = matrix
                    .computeIfAbsent(days_layout.getId(), v -> {
                        List<Integer> temp = new ArrayList<Integer>();
                        for (int i = 0; i < layouts.size(); i++) {
                            temp.add(0);
                        }
                        return temp;
                    });
            for (int i = 0; i < layouts.size(); i++) {
                String layout = layouts.get(i);
                if (days_layout.getLayout().equals(layout)) {
                    row.set(i, row.get(i) + days_layout.getOutTime() - days_layout.getInTime());
                }
            }
        }
        return matrix;
    }

    @Override
    public List<Days> getConfereesPathByTimeAndDay(Integer startTime, Integer endTime, Integer day, String layout, String type) {
        return daysMapper.selectIdSidByTimeByDay(startTime, endTime, day, layout, type);
    }

    // sunburst 时序
    @Override
    public Map<Integer, List<String>> getEveryOneSequence(Integer filterTime) {
        List<Days_Layout> days_layouts = daysMapper.getEveryoneSequence(filterTime);
        Map<Integer, List<String>> everyoneMap = new HashMap<>();
        for (Days_Layout days_layout : days_layouts) {
            List<String> layoutList = everyoneMap.computeIfAbsent(days_layout.getId(), v -> new ArrayList<>());
            layoutList.add(days_layout.getLayout());
        }
        return everyoneMap;
    }

    @Override
    public Map<Integer, List<String>> getEveryOneSequenceByLayers(Integer layers) {
        List<Days_Layout> days_layouts = daysMapper.selectAllDaysLayout();
        Map<Integer, List<Days_Layout>> everyoneMap = new HashMap<>();
        Map<Integer, List<String>> resultMap = new HashMap<>();
        for (Days_Layout days_layout : days_layouts) {
            List<Days_Layout> layoutList = everyoneMap.computeIfAbsent(days_layout.getId(), v -> new ArrayList<>());
            layoutList.add(days_layout);
        }
        for (Map.Entry<Integer, List<Days_Layout>> entry : everyoneMap.entrySet()) {
            List<Days_Layout> oneList = entry.getValue();
            Collections.sort(oneList);
            // 先排序, 再截取
            List<String> stringList = new ArrayList<>();
            Integer len = Math.min(layers, oneList.size());
            for (int i = 0; i < len; i++) {
                stringList.add(oneList.get(i).getLayout());
            }
            resultMap.put(entry.getKey(), stringList);
        }
        return resultMap;
    }

    // 地点停留时长分布
    @Override
    public Map<Integer, Map<Integer, Integer>> getEveryOneLayoutTime(String layout) {
        List<Days_Layout> times = daysMapper.getEveryOneLayoutTime(layout);
        Map<Integer, Map<Integer, Integer>> timesMap = new HashMap<>();
        Integer max = 0;
        for (Days_Layout time : times) {
            Map<Integer, Integer> timeList = timesMap.computeIfAbsent(time.getId(), v -> new HashMap<>());
            Integer key;
            // 对餐厅单独处理？
            if (time.getLayout().equals("餐厅")) {
                key = (time.getDay() - 1) * 60 * 60 * 24 + time.getInTime();
            } else {
                key = time.getDay();
            }
            Integer t = timeList.computeIfAbsent(key, v -> 0);
            // 累加求和
            t += time.getOutTime() - time.getInTime();
            timeList.put(key, t);
            if (t > max) {
                max = t;
            }
        }
        Map<Integer, Integer> m = timesMap.computeIfAbsent(99999, v -> new HashMap<>());
        m.put(99999, max);
        return timesMap;
    }

    @Override
    public List<Days> selectSensorConferee(String layout) {
        return daysMapper.selectSensorConferee(layout);
    }

}
