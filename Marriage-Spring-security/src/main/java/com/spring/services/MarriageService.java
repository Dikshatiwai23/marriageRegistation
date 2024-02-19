package com.spring.services;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.spring.ServiceInterface.RegiInterface;
import com.spring.models.Registration;
import com.spring.models.UploadFiles;
import com.spring.repo.MarriageRepo;

@Service
public class MarriageService implements RegiInterface{
	
	@Autowired
	private MarriageRepo RegistrationRepository;
	
	
	UploadFiles filee =new UploadFiles();
	public UploadFiles savefile1(UploadFiles file) {
		filee.setImagefileName(file.getImagefileName());
		filee.setImagefilePath(file.getImagefilePath());
		filee.setPanfileName(file.getPanfileName());
		filee.setPanfilePath(file.getPanfilePath());
		filee.setAdharfileName(file.getAdharfileName());
		filee.setAdharfilePath(file.getAdharfilePath());
		filee.setTenfileName(file.getTenfileName());
		filee.setTenfilePath(file.getTenfilePath());
		filee.setTwelvefileName(file.getTwelvefileName());
		filee.setTwelvefilePath(file.getTwelvefilePath());
		
		return null;
		
	}

	@Override
	public Registration saveDetail(Registration Registration, long id) {
		try {
            // Introduce a delay of 3000 milliseconds (3 seconds)
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            // Handle the exception
            e.printStackTrace();
        }
		//return RegistrationRepository.save(Registration);
		Registration Registration1=new Registration();
		Registration1=Registration;
		Registration1.setId(id);
		//Registration1.setImage(i2);
		Registration1.setFlag(1);
		filee.setId(id);
		Registration1.setUfile(filee);
		return this.RegistrationRepository.save(Registration1);
		
		
	}
	
	
   
	/*
	 * @Override public ImageEntity saveImage(MultipartFile file) throws IOException
	 * { ImageEntity image = new ImageEntity();
	 * image.setImageName(file.getOriginalFilename());
	 * image.setImageData(file.getBytes()); // this.i2=image; return image; //
	 * return IR.save(image); // return null;
	 * 
	 * 
	 * 
	 * }
	 */
	
	
	
	
	
	
	
	@Override
	public List<Registration> getAllStudent() {
		// TODO Auto-generated method stub
		
		return RegistrationRepository.getByFlag(1);
	}
	public Registration getDetailById(long id) {

		return RegistrationRepository.findById(id).get();
	}
}
