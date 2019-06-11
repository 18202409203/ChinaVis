package com.zpj.chinavis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import tk.mybatis.spring.annotation.MapperScan;

@MapperScan("com.zpj.chinavis.dao")
@SpringBootApplication
public class ChinavisApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChinavisApplication.class, args);
	}

}
