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
public class SecurityConfig {

	@Autowired
	private YamlUserDetailsService yamlUserDetailsService;

	@Autowired
	public void configAuthBuilder(AuthenticationManagerBuilder builder) throws Exception {
		builder.userDetailsService(yamlUserDetailsService);
	}

//	@Configuration
//	@Order(10)
//	public static class NoWebSecurityConfig extends WebSecurityConfigurerAdapter {
//
//		@Override
//		public void configure(WebSecurity web) throws Exception {
//			web.ignoring().antMatchers("/tmp/**");
//		}
//	}	
	
	
	@Configuration
	@Order(30)
	public static class BasicAuthSecurityConfig extends WebSecurityConfigurerAdapter {

		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable();
			http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

			http.antMatcher("/data-mgt/**").authorizeRequests().anyRequest().fullyAuthenticated().and().httpBasic();

		}
	}

	@Configuration
	@Order(50)
	public static class ConsoleSecurityConfig extends WebSecurityConfigurerAdapter {

		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable();
			http.authorizeRequests().antMatchers("/home", "/rest/**", "/auxiliary/rest/**", "/dashboard/rest/**").fullyAuthenticated().and().formLogin().loginPage("/login").permitAll().and().logout()
					.deleteCookies("JSESSIONID").clearAuthentication(true).logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/home");
		}
	}

	@Configuration
	@Order(60)
	public static class NoSecurityConfig extends WebSecurityConfigurerAdapter {

		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable();
			http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

			http.authorizeRequests().antMatchers("/api/**").anonymous().anyRequest().permitAll();
		}
	}
	
	

}
