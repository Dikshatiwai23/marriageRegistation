package com.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.spring.models.CustomUserDetails;

@Controller

@RequestMapping("/normal")
public class normalcontroller {
	
	@GetMapping("/")
	public String regi() {
		return "regi";
	}
	
}
