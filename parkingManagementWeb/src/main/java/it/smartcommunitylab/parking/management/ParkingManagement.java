package it.smartcommunitylab.parking.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication//(exclude = {SecurityAutoConfiguration.class })
//@EnableAutoConfiguration//(exclude = WebMvcAutoConfiguration.class)//(exclude = { org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration.class})
public class ParkingManagement  {

	public static void main(String[] args) {	
		SpringApplication.run(ParkingManagement.class, args);
	}

}
