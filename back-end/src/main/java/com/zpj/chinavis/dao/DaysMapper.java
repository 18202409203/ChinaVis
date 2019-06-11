package com.zpj.chinavis.dao;

import com.zpj.chinavis.model.Days;
import com.zpj.chinavis.model.Days_Layout;
import com.zpj.chinavis.model.Layout_Count;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Repository
public interface DaysMapper {
    List<Days> selectDays(Days days);
    List<Integer> selectAllConferees();
    List<Integer> selectConfereesByDay(Integer day);
    List<Integer> selectTimeNodesByDay(Integer day);
    List<Days_Layout> selectAllDaysWithLayoutByDay(Integer day);
    List<Days_Layout> selectAllDaysWithLayoutByDayAndId(Integer day, Integer id);

    void insertCount(@Param("map")  Map<Integer,LinkedList<Days_Layout>> id_daysLayoutTimeList_Map);
    List<Days_Layout> selectAllDaysLayout();
    List<Days_Layout> selectDaysLayoutByDay(Integer day);
    List<Days_Layout> selectDaysLayoutByLayoutByDay(@Param("day") Integer day, @Param("layout") String layout);

    List<Layout_Count> countConfereeNumByDay(@Param("node") Integer timeNode, @Param("day") Integer day);

    List<Integer> selectMinMaxTimeByDay(Integer day);

    List<Days> selectIdSidByTimeByDay(@Param("startTime") Integer startTime, @Param("endTime") Integer endTime,@Param("day") Integer day, @Param("layout") String layout, @Param("type") String type);

    List<Days_Layout> getEveryoneSequence(@Param("filterTime") Integer filterTime);

    List<Days_Layout> getEveryOneLayoutTime(@Param("layout") String layout);

    // sid与人员
    List<Days> selectSensorConferee(@Param("layout") String layout);
}