package com.zpj.chinavis.dao;

import com.zpj.chinavis.model.Sensor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorMapper {

    Sensor selectByPrimaryKey(Integer sid);

    List<Sensor> selectAll();

    List<Sensor> selectLayoutNotNull();

    List<String> selectAllLayouts();
}