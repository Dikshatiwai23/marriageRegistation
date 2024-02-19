package com.spring.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.spring.models.CustomUserDetails;

@Controller
public class TestController {

	
	@GetMapping("/signin")
	public String sigin() {
		return "login";	}
	
	@GetMapping("/abc")
	public String abc(@AuthenticationPrincipal CustomUserDetails cs ) {
		String st=cs.getRole();
		
		if(st.equals("ROLE_NORMAL")) {
			
			return "redirect:/normal/";
		}
		else if(st.equals("ROLE_ADMIN") ){
		return "redirect:/user/";
	}
		else {
			return "redirect:/signin";
		}
	}

	@GetMapping("/newuser")
	public String newuser() {
		return "index";
	}
	
	/*
	 * @GetMapping("/home") public String base() { return "about.html"; }
	 */
	

	
}
