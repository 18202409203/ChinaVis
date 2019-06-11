package com.zpj.chinavis.service;

import com.zpj.chinavis.dto.DaysDto;
import com.zpj.chinavis.model.Days;
import com.zpj.chinavis.model.Days_Layout;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public interface DaysService {
    List<DaysDto> selectDays(Days days);
    List<Integer> selectAllConferees();
    List<Integer> selectConfereesByDay(Integer day);
    List<Integer> selectTimeNodesByDay(Integer day);

    Map<Integer, LinkedList<Days_Layout>> selectAllDaysWithLayoutByLayoutByDay(Integer day, String layout);
    List<List<Integer>> getConfereeCountsByLayoutByDay(Integer day, String layout, Integer startSecond, Integer interval, Integer endSecond);
    Map<Integer, Map<String, Integer>> getConfereeCountsAllLayoutByDay(Integer day, Integer startSecond, Integer interval, Integer endSecond);

    // 矩阵
    Map<Integer, List<Integer>> getEveryoneMatrixByDay(Integer day);

    // 路径
    List<Days> getConfereesPathByTimeAndDay(Integer startTime, Integer endTime, Integer day, String layout, String type);

    // sunburst
    Map<Integer, List<String>> getEveryOneSequence(Integer filterTime);
    Map<Integer, List<String>> getEveryOneSequenceByLayers(Integer layers);

    // 每人每地三天停留时长
    Map<Integer, Map<Integer, Integer>> getEveryOneLayoutTime(String layout);

    // sid与人员
    List<Days> selectSensorConferee(String layout);
}
