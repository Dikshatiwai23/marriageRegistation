package com.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.spring.models.CustomUserDetails;

///for admin

@Controller
@RequestMapping("/user")
public class AdminController {

	// display list of student
	
	@GetMapping("/")
	public String ViewPage(@AuthenticationPrincipal CustomUserDetails cs, Model m) {

		String st = cs.getUsername();
		m.addAttribute("user", st);

		String role = cs.getRole();
		m.addAttribute("role", role);

		
		return "table";
	}

	/*
	 * @GetMapping("/") public String Table() { return "table"; }
	 */

	@GetMapping("/chart")
	public String chart() {
		return "chart";
	}
	/*
	 * @GetMapping(value="/add_Student") public String add_Student( Model m) {
	 * Student student= new Student(); m.addAttribute("student", student); return
	 * "add_Student_form";
	 * 
	 * 
	 * }
	 * 
	 * @PostMapping("/saveStudent") public String
	 * saveStudent(@ModelAttribute("student") Student student) { //save student from
	 * the db; stuService.saveStudent(student);
	 * 
	 * return "redirect:/user/"; }
	 * 
	 * 
	 * 
	 * @GetMapping("/update_form/{id}") public String
	 * update_form(@PathVariable(value="id") long id, Model m) {
	 * 
	 * //get student from service Student student = stuService.getStudentById(id);
	 * 
	 * //set student as a model attribute to pe-populate the form
	 * 
	 * m.addAttribute("student", student);
	 * 
	 * return "update_form"; }
	 * 
	 * 
	 * @GetMapping("/delete_form/{id}")
	 * 
	 * public String deleteStudentById(@PathVariable(value="id") long id, Model m) {
	 * 
	 * //call delete student method; this.stuService.deleteStudentById(id);
	 * 
	 * return "redirect:/user/"; }
	 */

}
