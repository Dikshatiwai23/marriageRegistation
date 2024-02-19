package com.spring.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.models.Registration;
import com.spring.repo.MarriageRepo;



@Service
public class ChartServiceImp {

	long id=1;
	
	@Autowired
	private MarriageRepo RegistrationRepository;
	
	public List<Registration> getAllRegistrations() {
        return RegistrationRepository.getByFlag(1);
    }

    public void saveRegistration(Registration Registration) {
        RegistrationRepository.save(Registration);
    }

    public long countMaleRegistrations() {
    	
        return RegistrationRepository.countByGenderAndFlag("Male",id);
    }

    public long countFemaleRegistrations() {
        return RegistrationRepository.countByGenderAndFlag("Female",id);
    }
    public long countTransRegistrations() {
        return RegistrationRepository.countByGenderAndFlag("Other",id);
    }
    
    public long countD() {
        return RegistrationRepository.countBymaritalStatusAndFlag("Divorced",id);
    }

    public long countS() {
        return RegistrationRepository.countBymaritalStatusAndFlag("Single",id);
    }
    public long countM() {
        return RegistrationRepository.countBymaritalStatusAndFlag("Married",id);
    }

   
}
