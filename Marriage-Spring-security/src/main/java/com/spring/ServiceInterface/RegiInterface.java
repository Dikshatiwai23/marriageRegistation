package com.spring.ServiceInterface;

import java.util.List;

import com.spring.models.Registration;

public interface RegiInterface {
Registration saveDetail(Registration user , long id);
	
	
	List<Registration> getAllStudent() ;
}