package com.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.models.Registration;

public interface MarriageRepo extends JpaRepository<Registration, Long> {
	long countByGenderAndFlag(String string,long id);
	List<Registration> getByFlag(long flag);
	Registration findByEmail(String email);
	
	
	
	long countBymaritalStatusAndFlag(String string, long id);
	boolean existsByEmail(String email);
	
	@Query("SELECT p FROM Registration p " +
		       "WHERE (:gender IS NULL OR p.gender = :gender) " +
		       "AND (:marital IS NULL OR p.maritalStatus = :marital) " +
		       "AND(:district IS NULL OR p.district=:district)"+
		       "AND p.flag = 1")
		List<Registration> findByUserInput(
		    @Param("gender") String gender,
		    @Param("marital") String marital,
		    @Param("district") String district
		);
	List<Registration> getByGenderAndFlag(String gender,long f);
	@Query("SELECT p FROM Registration p " +
		       "WHERE( p.gender='Male' OR" +
		       " p.gender='Female' )" +
		      
		       "AND p.flag = 1")
	List<Registration> getBytrns(@Param ("flag")long f);
	}
