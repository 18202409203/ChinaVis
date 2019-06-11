package com.zpj.chinavis.model;

import lombok.Data;

@Data
public class Days_Layout implements Comparable<Days_Layout> {
    private Integer id;

    private String layout;

    private Integer inTime;

    private Integer outTime;

    private Integer day;

    @Override
    public int compareTo(Days_Layout days_layout) {
        return days_layout.getOutTime() - days_layout.getInTime() - (outTime - inTime);
    }
}
