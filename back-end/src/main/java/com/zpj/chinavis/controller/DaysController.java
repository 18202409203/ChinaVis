package com.zpj.chinavis.controller;

import com.zpj.chinavis.dto.DaysDto;
import com.zpj.chinavis.model.Days;
import com.zpj.chinavis.model.Days_Layout;
import com.zpj.chinavis.service.DaysService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


@Api(value="日数据")
@RestController
@RequestMapping("/days")
public class DaysController {

    @Resource
    private DaysService daysService;

    @RequestMapping(method = {RequestMethod.POST})
    public List<DaysDto> getDays(@RequestBody Days days){
        return daysService.selectDays(days);
    }

    @ApiOperation(value = "所有人员ID")
    @GetMapping("/allConferees")
    public List<Integer> getAllConferees(){
        return daysService.selectAllConferees();
    }

    //@GetMapping("/allTimeNodes/{day}")
    //public List<Integer> getAllTimeNodes(@PathVariable Integer day){
    //   return daysService.selectTimeNodesByDay(day);
    //}

    @ApiOperation(value = "某天的所有人员ID")
    @GetMapping("/allConfereesOfDay/{day}")
    public List<Integer> getAllConfereesByDay(@PathVariable Integer day){
       return daysService.selectConfereesByDay(day);
    }

    @ApiOperation(value = "每个人某天内走过某个地方及其出入时间")
    @GetMapping("/getEveryOneByDayByLayout/{day}/{layout}")
    public Map<Integer, LinkedList<Days_Layout>> getEveryOneByDay(@PathVariable Integer day, @PathVariable String layout){
        return daysService.selectAllDaysWithLayoutByLayoutByDay(day, layout);
    }

    @ApiOperation(value = "每个人的运动序列，带时间过滤")
    @GetMapping("/getEveryOneSequence/{filterTime}")
    public Map<Integer, List<String>> getEveryOneSequence(@PathVariable Integer filterTime){
        return daysService.getEveryOneSequence(filterTime);
    }

    @ApiOperation(value = "每个人某天走过的所有地方和时间，结果是一个矩阵")
    @GetMapping("/getEveryOneByDay/{day}")
    public Map<Integer, List<Integer>> getEveryOneByDay(@PathVariable Integer day){
        return daysService.getEveryoneMatrixByDay(day);
    }

    @ApiOperation(value = "某个地点某天的人流量，需要采样起始时间、间隔时间、结束时间")
    @GetMapping("/getConfereeCountsByLayoutByDay/{day}/{layout}/{startSecond}/{interval}/{endSecond}")
    public List<List<Integer>> getCountsOneLayout(@PathVariable Integer day, @PathVariable String layout, @PathVariable Integer startSecond, @PathVariable Integer interval, @PathVariable Integer endSecond){
        return daysService.getConfereeCountsByLayoutByDay(day, layout, startSecond, interval, endSecond);
    }

    @ApiOperation(value = "某天的人流量，需要采样起始时间、间隔时间、结束时间")
    @GetMapping("/getConfereeCountsByDay/{day}/{startSecond}/{interval}/{endSecond}")
    public Map<Integer, Map<String, Integer>> getCountsAllLayout(@PathVariable Integer day, @PathVariable Integer startSecond, @PathVariable Integer interval, @PathVariable Integer endSecond){
        return daysService.getConfereeCountsAllLayoutByDay(day, startSecond, interval, endSecond);
    }

    @ApiOperation(value = "一段时间内某地点的出走人员")
    @GetMapping("/getConfereesPath/{startTime}/{endTime}/{day}/{layout}/{type}")
    public List<Days> getConfereesPath(@PathVariable Integer startTime, @PathVariable Integer endTime, @PathVariable Integer day, @PathVariable String layout, @PathVariable String type) {
        return daysService.getConfereesPathByTimeAndDay(startTime, endTime, day, layout, type);
    }

    @ApiOperation(value = "每人每地三天停留时长")
    @GetMapping("/getConfereesLayoutTime/{layout}")
    public Map<Integer, Map<Integer, Integer>> getEveryOneLayoutTime(@PathVariable String layout) {
        return daysService.getEveryOneLayoutTime(layout);
    }

    @ApiOperation(value = "旭日图按层级，时长排序")
    @GetMapping("/getConfereesLayoutsSequence/{layers}")
    public Map<Integer, List<String>> getEveryOneSequenceByLayers(@PathVariable Integer layers) {
        return daysService.getEveryOneSequenceByLayers(layers);
    }

    @ApiOperation(value = "sid与人员信息")
    @GetMapping("/selectSensorConferee/{layout}")
    public List<Days> selectSensorConferee(@PathVariable String layout) {
        return daysService.selectSensorConferee(layout);
    }

}
