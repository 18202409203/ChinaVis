package com.zpj.chinavis.service.serviceImpl;

import com.zpj.chinavis.dao.SensorMapper;
import com.zpj.chinavis.model.Sensor;
import com.zpj.chinavis.service.SensorService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class SensorImpl implements SensorService{

    @Resource
    private SensorMapper sensorMapper;

    @Override
    public Sensor selectByPrimaryKey(Integer sid) {
        return sensorMapper.selectByPrimaryKey(sid);
    }

    @Override
    public List<Sensor> selectAll() {
        return sensorMapper.selectAll();
    }

    @Override
    public List<Sensor> selectLayoutNotNull() {
        return sensorMapper.selectLayoutNotNull();
    }

    @Override
    public List<String> selectAllLayoutName() {
        return sensorMapper.selectAllLayouts();
    }
}
