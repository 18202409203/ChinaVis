package com.zpj.chinavis.controller;

import com.zpj.chinavis.model.Sensor;
import com.zpj.chinavis.service.SensorService;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/sensor")
public class SensorController {
    @Resource
    private SensorService sensorService;

    @GetMapping("/getById/{sid}")
    public ResponseEntity<Sensor> getById(@PathVariable int sid) {
        Sensor sensor = sensorService.selectByPrimaryKey(sid);
        if(sensor == null){
            return new ResponseEntity<Sensor>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<Sensor>(sensor, HttpStatus.OK);
    }

    @ApiOperation(value = "所有传感器对象，原生信息")
    @GetMapping("/getAll")
    public List<Sensor> getAll(){
        return sensorService.selectAll();
    }

    @ApiOperation(value = "所有的传感器对象，带有地点信息")
    @GetMapping("/layout")
    public List<Sensor> getLayout(){
        return sensorService.selectLayoutNotNull();
    }

    @ApiOperation(value = "所有地点，字符串信息")
    @GetMapping("/allLayout")
    public List<String> getAllLayout(){return sensorService.selectAllLayoutName();}
}
