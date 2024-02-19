package com.spring.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.spring.models.CustomUserDetails;
import com.spring.models.Registration;
import com.spring.repo.MarriageRepo;

@Service
public class CustomUserDetailService implements UserDetailsService {

	@Autowired
	private MarriageRepo userRepo;
	//private UserRepository userRepo;

	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub

		
		Registration user=this.userRepo.findByEmail(username);
	
		if(user==null) {
			throw new UsernameNotFoundException("No User");
		}
		return new CustomUserDetails(user);
	}
	

}
