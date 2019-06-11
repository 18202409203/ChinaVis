package com.zpj.chinavis.service;

import com.zpj.chinavis.model.Sensor;

import java.util.List;

public interface SensorService {
    Sensor selectByPrimaryKey(Integer sid);
    List<Sensor> selectAll();
    List<Sensor> selectLayoutNotNull();
    List<String> selectAllLayoutName();
}
