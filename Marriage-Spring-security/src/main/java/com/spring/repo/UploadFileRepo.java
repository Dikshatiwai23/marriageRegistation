package com.spring.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.models.UploadFiles;


public interface UploadFileRepo extends JpaRepository<UploadFiles, Long>{

}
