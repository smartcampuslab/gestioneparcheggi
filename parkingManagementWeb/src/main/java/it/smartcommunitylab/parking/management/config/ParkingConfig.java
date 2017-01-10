package it.smartcommunitylab.parking.management.config;

import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.mongodb.Mongo;

@Configuration
@EnableAutoConfiguration//(exclude = WebMvcAutoConfiguration.class)
@PropertySource("classpath:tm.properties")
@Order(value = 1)
public class ParkingConfig extends WebMvcConfigurerAdapter {

	@Value("${mongo.db}")
	private String mongoDB;	
	
	private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
		"classpath:/" , "classpath:/META-INF/resources/", "classpath:/resources/",
		"classpath:/static/", "classpath:/public/", "classpath:/templates/" };		
	
	@Bean(name = "mongoTemplate")
	@Primary
	public MongoTemplate getDomainMongoTemplate() throws UnknownHostException {
		MongoTemplate template = new MongoTemplate(new Mongo(), mongoDB);
		return template;
	}	
	
	 @Override
	 public void addResourceHandlers(ResourceHandlerRegistry registry) {
		 	registry.addResourceHandler("/tmp/**").addResourceLocations("file:./tmp/");
			registry.addResourceHandler("/**").addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);		
	 }

	
	
}
