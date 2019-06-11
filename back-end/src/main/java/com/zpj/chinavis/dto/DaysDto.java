package com.zpj.chinavis.dto;

import com.zpj.chinavis.model.Days;
import com.zpj.chinavis.model.Sensor;


public class DaysDto {

    private Integer id;

    private Sensor sensor;

    private Integer time;

    private Integer day;

    public static DaysDto toDto(Days days){
        DaysDto daysDto = new DaysDto();

        daysDto.setId(days.getId());
        daysDto.setTime(days.getTime());
        daysDto.setDay(days.getDay());

        return daysDto;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Sensor getSensor() {
        return sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public Integer getTime() {
        return time;
    }

    public void setTime(Integer time) {
        this.time = time;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }
}
