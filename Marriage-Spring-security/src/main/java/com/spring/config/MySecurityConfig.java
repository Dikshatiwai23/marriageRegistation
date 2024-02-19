
package com.spring.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.spring.services.CustomUserDetailService;

@Configuration
@EnableWebSecurity
public class MySecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private CustomUserDetailService customUserDetailService;

	@Override
	
	/*
	 * Configures security settings for HTTP requests.
Specifies which URLs are allowed to be accessed without authentication (/signin, /newuser, /saveUser).
Defines access rules based on roles (hasRole("NORMAL") and hasRole("ADMIN")).
Configures form-based authentication, specifying the login page (/signin), the processing URL (/dologin), and the default success URL (/user/).
configure(AuthenticationManagerBuilder auth):

Configures authentication manager.
It uses a custom user details service (customUserDetailService) and sets the password encoder.*/
	
	
	//antMatchers is a method used to define URL patterns and specify access control rules based on those patterns
		protected void configure(HttpSecurity http) throws Exception {
		// TODO Auto-generated method stub
		http
		        .csrf().disable()
	        	.authorizeRequests()
	        	.antMatchers("/signin","/home","/newuser","/saveUser","/delete/{id}","/viewpdf/{id}","/newmain.js","/abc","/about.css","/wedding.jpg","/api/persons","/api/persons/{id}","/getAllRegistrations/{id}","/getAllUsers","/api/persons/{personId},","/upload","/register",
	        			"/trans","/getone2","/male","/female","/data3/{user}","/data2/{user}","/api/users/count-trans","/data/{user}","/api/excel/download","api/users/count-male","api/users/count-female","api/users/count-M","api/users/count-S","api/users/count-D","/validate-captcha","/captcha","/wedding3.jpg","/weadding2.avif","/groom-putting-ring-bride-s-finger.jpg","/new.js").permitAll()
				.antMatchers("/normal/","/newmain.js").hasRole("NORMAL") 
				.antMatchers("/user/**","/newmain.js").hasRole("ADMIN")
				.anyRequest()
				.authenticated()
				.and()
				.formLogin()
				.loginPage("/signin")
				.loginProcessingUrl("/dologin")
				.defaultSuccessUrl("/abc");
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder());

	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

}
