package it.smartcommunitylab.parking.management.config;

import it.smartcommunitylab.parking.management.web.security.YamlUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
//@EnableWebSecurity
//@Order(value = 0)
public class SecurityConfig {

	@Autowired
	private YamlUserDetailsService yamlUserDetailsService;	
	
//	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//		auth.userDetailsService(yamlUserDetailsService);
//		auth.authenticationProvider(getYamlAuthenticationProvider());
	}

	 @Autowired
	    public void configAuthBuilder(AuthenticationManagerBuilder builder) throws Exception {
	        builder.userDetailsService(yamlUserDetailsService); 
	    }	
	
	
//	@Override
//	public void configure(WebSecurity web) throws Exception {
//		web.ignoring().antMatchers("/css/**","/fonts/**","/js/**","/lib/**", "/imgs/**");
//	}	
	
	
//	@Override
//	protected void configure(HttpSecurity http) throws Exception {
//		http.csrf().disable();
//		http.rememberMe();	
//		
//		http.authorizeRequests().antMatchers("/**").fullyAuthenticated().and().formLogin().loginPage("/login").permitAll().and().logout().permitAll();	
//	}	
	
//	@Bean
//	public AbstractUserDetailsAuthenticationProvider getYamlAuthenticationProvider() {
////		DaoAuthenticationProvider daoAP = new DaoAuthenticationProvider();
//		YamlAuthenticationProvider yamlAP = new YamlAuthenticationProvider();
//		yamlAP.setUserDetailsService(yamlUserDetailsService);
//		return yamlAP;
//	}	
	
    @Configuration
    @Order(30)                                                        
    public static class BasicAuthSecurityConfig extends WebSecurityConfigurerAdapter {
    
    	@Override
    	protected void configure(HttpSecurity http) throws Exception {
    		http.csrf().disable();
//    		http.rememberMe();	
    		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    		
//    		http.antMatcher("/data-mgt/**").authorizeRequests().antMatchers("/data-mgt/**").fullyAuthenticated().and().httpBasic();
    		http.antMatcher("/data-mgt/**").authorizeRequests().anyRequest().fullyAuthenticated().and().httpBasic();
    		
    	}    	
    }		 
	
    

	

//	OK    
@Configuration
@Order(50)                                                        
public static class ConsoleSecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
//		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//		http.rememberMe();	
//		http.sessionManagement().invalidSessionUrl("/error.html").sessionFixation().newSession();
		
		http.authorizeRequests().antMatchers("/home", "/rest/**", "/auxiliary/rest/**", "/dashboard/rest/**").fullyAuthenticated()
		.and().formLogin().loginPage("/login").permitAll()
//		.and().logout().logoutUrl("/logout").permitAll();
		.and().logout().deleteCookies("JSESSIONID").clearAuthentication(true).logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/home");
	}    	
}	    
    
//@Configuration
//@Order(52)                                                        
//public static class NoSecurityConfig extends WebSecurityConfigurerAdapter {
//
//	@Override
//	protected void configure(HttpSecurity http) throws Exception {
//		http.csrf().disable();
////		http.rememberMe();	
//		http.sessionManagement().invalidSessionUrl("/error.html").sessionFixation().newSession();
//		
//		http.authorizeRequests().antMatchers("/logout").fullyAuthenticated().anyRequest().permitAll();
//	}    	
//}	 


//@Configuration
//@Order(51)                                                        
//public static class EverythingSecurityConfig extends WebSecurityConfigurerAdapter {
//
//	@Override
//	protected void configure(HttpSecurity http) throws Exception {
//		http.csrf().disable();
//		http.rememberMe();	
//		http.sessionManagement().invalidSessionUrl("/error.html").sessionFixation().newSession();
//		
//		http.authorizeRequests().antMatchers("/home", "/rest/**", "/auxiliary/rest/**", "/dashboard/rest/**").fullyAuthenticated().and().formLogin().loginPage("/login").defaultSuccessUrl("/home").failureUrl("/login?error=true").permitAll().and().logout().deleteCookies("JSESSIONID").clearAuthentication(true).permitAll();
//	}    	
//}

    
//    @Configuration
//    @Order(40)                                                        
//    public static class RestSecurityConfig extends WebSecurityConfigurerAdapter {
//    
//    	@Override
//    	protected void configure(HttpSecurity http) throws Exception {
//    		http.csrf().disable();
//    		http.rememberMe();	
//    		
//    		http.authorizeRequests().antMatchers("/home", "/rest/**", "/auxiliary/rest/**", "/dashboard/rest/**").fullyAuthenticated(); //.and().formLogin().loginPage("/login").permitAll().and().logout().permitAll();
//    	}    	
//    }    
//    
//    @Configuration
//    @Order(50)                                                        
//    public static class ConsoleSecurityConfig extends WebSecurityConfigurerAdapter {
//    
//    	@Override
//    	protected void configure(HttpSecurity http) throws Exception {
//    		http.csrf().disable();
//    		http.rememberMe();	
//    		
//    		http.authorizeRequests().antMatchers("/**").fullyAuthenticated().and().formLogin().loginPage("/login").permitAll().and().logout().permitAll();
//    	}    	
//    }  

    
//  @Configuration
//  @Order(40)                                                        
//  public static class LoginSecurityConfig extends WebSecurityConfigurerAdapter {
//  
//  	@Override
//  	protected void configure(HttpSecurity http) throws Exception {
//  		http.csrf().disable();
//  		http.rememberMe();	
//  		
//  		http.antMatcher("/login").authorizeRequests().anyRequest().permitAll();
//  	}    	
//  }    
//  
//  
////		OK    
//  @Configuration
//  @Order(50)                                                        
//  public static class ConsoleSecurityConfig extends WebSecurityConfigurerAdapter {
//  
//  	@Override
//  	protected void configure(HttpSecurity http) throws Exception {
//  		http.csrf().disable();
//  		http.rememberMe();	
//  		
//  		http.authorizeRequests().antMatchers("/home").fullyAuthenticated().and().formLogin().loginPage("/login").defaultSuccessUrl("/home").permitAll().and().logout().permitAll();
//  	}    	
//  }	    
    
    
}
