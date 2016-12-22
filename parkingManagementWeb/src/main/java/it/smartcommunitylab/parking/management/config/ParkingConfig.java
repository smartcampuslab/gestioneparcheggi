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
import org.springframework.web.servlet.config.annotation.CorsRegistry;
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
		"classpath:/static/", "classpath:/public/", "classpath:/templates/"  };		
	
//	public CommonsMultipartResolver getCommonsMultipartResolver() {
//		CommonsMultipartResolver resolver = new CommonsMultipartResolver();
//		resolver.setMaxUploadSize(10485760L);
//		return resolver;
//	}
	
	@Bean(name = "mongoTemplate")
	@Primary
	public MongoTemplate getDomainMongoTemplate() throws UnknownHostException {
		MongoTemplate template = new MongoTemplate(new Mongo(), mongoDB);
		return template;
	}	
	
//    @Bean
//    public ViewResolver viewResolver() {
//        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
//        
//        viewResolver.setViewClass(JstlView.class);
////        viewResolver.setPrefix("/WEB-INF/jsp/");
//        viewResolver.setPrefix("/jsp/");
//        viewResolver.setSuffix(".jsp");
// 
//        return viewResolver;
//    }	
	
	 @Override
	 public void addResourceHandlers(ResourceHandlerRegistry registry) {
//			registry.addResourceHandler("/imgs/**").addResourceLocations(
//					"classpath:/static/imgs/");
			registry.addResourceHandler("/**").addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);			
	 }
	

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedMethods("PUT", "DELETE", "GET", "POST").allowedOrigins("*");
	} 
	 
//	@Bean
//	public ErrorViewResolver getErrorViewResolver (){
//	    return new CustomErrorViewResolver();
//	}	
//	
//	@Bean(name = "error")
//    @ConditionalOnMissingBean(name = "error")
//    public ModelAndView defaultErrorView() {
//        return new ModelAndView("error");
//    }	
	
	
//	@Override 
//	@Bean 
//	public HandlerMapping resourceHandlerMapping() { 
//	AbstractHandlerMapping handlerMapping = (AbstractHandlerMapping) super.resourceHandlerMapping(); 
//	handlerMapping.setOrder(-1); 
//	return handlerMapping; 
//	}	
	 

//		registry.addResourceHandler("/templates/**").addResourceLocations(
//				"/resources/templates/");	 
	 
	 
//	<bean
//	class="org.springframework.web.servlet.view.InternalResourceViewResolver">
//	<property name="prefix" value="/WEB-INF/jsp/" />
//	<property name="suffix" value=".jsp" />
//</bean>	
	
//	private static class CustomErrorPageRegistrar implements ErrorPageRegistrar {
//
//	    @Override
//	    public void registerErrorPages(ErrorPageRegistry registry) {
//	        registry.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/error"));
//	    }
//
//	}	
	
//	public class CustomErrorViewResolver implements ErrorViewResolver {
//
//	    @Override
//	    public ModelAndView resolveErrorView(HttpServletRequest request,
//	            HttpStatus status, Map<String, Object> model) {
//	    	return new ModelAndView("error");
//	    }
//
//	}	
	
	
}
