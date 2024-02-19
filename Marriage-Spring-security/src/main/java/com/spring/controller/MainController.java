package com.spring.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spring.models.CustomUserDetails;
import com.spring.models.Registration;
import com.spring.models.UploadFiles;
import com.spring.repo.MarriageRepo;
import com.spring.repo.UploadFileRepo;
import com.spring.services.ExcelService;
import com.spring.services.MarriageService;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@RestController

public class MainController {

	/*
	 * @Autowired private MarriageService service;
	 * 
	 * @Autowired private UploadFileRepo up;
	 * 
	 * 
	 * 
	 * @Autowired private MarriageRepo mrepo;
	 */@Autowired
	private MarriageRepo r;
	List<Registration> result;
	@Autowired
	private MarriageService service;
	@Autowired
	private ExcelService excelService;
	@Autowired
	private BCryptPasswordEncoder b;
	@Autowired
	private UploadFileRepo up;
	@Autowired
	private MarriageRepo mrepo;
	long id1;
	// private static final String UPLOAD_DIR = "src/main/resources/uploads";

	private static final String UPLOAD_DIR = "C:/uploads/";

	// all Registration for table
	@GetMapping("/getAllUsers")
	public List<Registration> table() {
		long f = 1;

		return r.getByFlag(f);

	}

	long id = 0;

	@GetMapping("/getone")
	public ResponseEntity<Registration> getPerson(@AuthenticationPrincipal CustomUserDetails cs) {
		id = cs.getId();

		Optional<Registration> person = mrepo.findById(id);
		return person.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	/*
	 * @GetMapping("/getone2") public ResponseEntity<Registration>
	 * loginlogout(@AuthenticationPrincipal CustomUserDetails cs) { long id2 = 0;
	 * id2 = id;
	 * 
	 * Registration p = new Registration();
	 * 
	 * if (id2 != 0) { p.setName("pp"); id = 0; return ResponseEntity.ok().body(p);
	 * } else { p.setName("aa"); id = 0; return ResponseEntity.ok().body(p); } }
	 */
	// final submit
	@PostMapping("/register")
	public ResponseEntity<String> registerRegistration(@RequestBody Registration Registration) {
		// Save Registration to the database
		Registration.setPass(this.b.encode(Registration.getPass()));
		service.saveDetail(Registration, id1);
		return ResponseEntity.ok("Registration successful!");
	}

	// for image in table

	@GetMapping("/getAllRegistrations/{id}")
	public ResponseEntity<byte[]> getPhoto(@PathVariable long id) throws IOException {
		UploadFiles ie = up.findById(id).orElse(null);
		// Resource resource = new ClassPathResource("uploads/" +
		// ie.getImagefileName());
		Path filePath = Paths.get(UPLOAD_DIR, ie.getImagefileName());
		Resource resource = new FileSystemResource(filePath);
		if (ie != null) {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_JPEG);
			byte[] imageBytes = Files.readAllBytes(resource.getFile().toPath());

			return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
		} else {

			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

	}

	// single Registration for review
	@GetMapping("/api/persons/{id}")
	public ResponseEntity<Registration> getPersonById(@PathVariable long id) {
		id1 = id;
		Optional<Registration> person = mrepo.findById(id);
		return person.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	// 1st time saving data

	@PostMapping("/api/persons")
	public ResponseEntity<Registration> savePerson(@RequestBody Registration person) {
		Registration savedPerson = new Registration();
		savedPerson.setFlag(0);

		savedPerson = person;

		Registration savedPerson2 = mrepo.save(savedPerson);
		return ResponseEntity.ok(savedPerson);
	}

	@GetMapping("/delete/{id}")
	public ResponseEntity<String> delete(@PathVariable long id) {
		mrepo.deleteById(id);
		return ResponseEntity.ok().body("delete" + id);
	}

	@GetMapping("/viewpdf/{id}")
	public ResponseEntity<InputStreamResource> viewPdf(@PathVariable Long id) throws IOException {
		UploadFiles fileEntity = up.findById(id)

				.orElseThrow(() -> new RuntimeException("File not found with ID: " + id));

		String[] fileNames = { fileEntity.getPanfileName(), fileEntity.getAdharfileName(), fileEntity.getTenfileName(),
				fileEntity.getTwelvefileName() };

		File zipFile = new File(UPLOAD_DIR + "downloadedFiles.zip");

		try (FileOutputStream fos = new FileOutputStream(zipFile); ZipOutputStream zos = new ZipOutputStream(fos)) {

			for (String fileName : fileNames) {
				File file = new File(UPLOAD_DIR + fileName);

				if (!file.exists()) {
					throw new IOException("File not found: " + fileName);
				}

				ZipEntry zipEntry = new ZipEntry(fileName);
				zos.putNextEntry(zipEntry);

				try (InputStream inputStream = new FileInputStream(file)) {
					byte[] bytes = new byte[1024];
					int length;
					while ((length = inputStream.read(bytes)) >= 0) {
						zos.write(bytes, 0, length);
					}
				}

				zos.closeEntry();
			}
		} catch (IOException e) {
			// Handle the exception appropriately
			e.printStackTrace();
			throw e;
		}

		InputStream zipInputStream = new FileInputStream(zipFile);
		InputStreamResource resource = new InputStreamResource(zipInputStream);

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_TYPE, "application/zip");
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=downloadedFiles.zip");

		return ResponseEntity.ok().headers(headers).body(resource);

	}

	// for update
	@PutMapping("/api/persons/{personId}")
	public ResponseEntity<Registration> updatePerson(@PathVariable long personId,
			@RequestBody Registration updatedPerson) {
		// id1=personId;
		Optional<Registration> personOptional = mrepo.findById(personId);
		return personOptional.map(person -> {
			person.setName(updatedPerson.getName());
			person.setMobile(updatedPerson.getMobile());
			person.setDob(updatedPerson.getDob());
			person.setAge(updatedPerson.getAge());
			// person.setRole(updatedPerson.getRole());
			person.setMaritalStatus(updatedPerson.getMaritalStatus());

			person.setArea(updatedPerson.getArea());
			person.setDistrict(updatedPerson.getDistrict());
			person.setCity(updatedPerson.getCity());
			person.setGender(updatedPerson.getGender());
			person.setGram(updatedPerson.getGram());
			person.setBlock(updatedPerson.getBlock());
			person.setEmail(updatedPerson.getEmail());
			person.setUfile(updatedPerson.getUfile());
			mrepo.save(person);
			return new ResponseEntity<>(person, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/upload")
	public String uploadPdf(@RequestParam("file") MultipartFile file, @RequestParam("pan") MultipartFile filep,
			@RequestParam("adhar") MultipartFile file2, @RequestParam("ten") MultipartFile file3,
			@RequestParam("twelve") MultipartFile file4) throws IOException {

		if (!file.isEmpty()) {

			// Generate a unique file name using UUID
			String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
			String fileName1 = UUID.randomUUID().toString() + "_" + filep.getOriginalFilename();
			String fileName2 = UUID.randomUUID().toString() + "_" + file2.getOriginalFilename();
			String fileName3 = UUID.randomUUID().toString() + "_" + file3.getOriginalFilename();
			String fileName4 = UUID.randomUUID().toString() + "_" + file4.getOriginalFilename();

			// Save the file to the specified directory
			saveFile(file, fileName);
			UploadFiles file1 = new UploadFiles();
			file1.setImagefileName(fileName);
			file1.setImagefilePath("C:/uploads/" + file.getOriginalFilename());
			saveFile(filep, fileName1);
			file1.setPanfileName(fileName1);
			file1.setPanfilePath("C:/uploads/" + filep.getOriginalFilename());
			saveFile(file2, fileName2);

			file1.setAdharfileName(fileName2);
			file1.setAdharfilePath("C:/uploads/" + file2.getOriginalFilename());
			saveFile(file3, fileName3);
			file1.setTenfileName(fileName3);
			file1.setTenfilePath("C:/uploads/" + file3.getOriginalFilename());
			saveFile(file4, fileName4);
			file1.setTwelvefileName(fileName4);
			file1.setTwelvefilePath("C:/uploads/" + file4.getOriginalFilename());
			// repo.save(file1);
			service.savefile1(file1);

			// You can save the file information to a database or perform other logic here
			return "File uploaded successfully!";
		} else {
			return "Failed to upload file. File is empty.";
		}

	}

	private void saveFile(MultipartFile file, String fileName) throws IOException {
		// Create the upload directory if it doesn't exist
		File uploadDir = new File(UPLOAD_DIR);
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}

		// Save the file to the upload directory
		File destFile = new File(uploadDir, fileName);
		try (FileOutputStream outputStream = new FileOutputStream(destFile)) {
			outputStream.write(file.getBytes());
		}
	}

	/*
	 * @GetMapping("/api/excel/download") public ResponseEntity<byte[]>
	 * downloadExcel(@RequestParam(required = false) String password) throws
	 * IOException, GeneralSecurityException { List<Registration> people =
	 * mrepo.getByFlag(1); List<Registration> all; result =
	 * mrepo.findByUserInput(gender,marital,district); if(result!=null) {
	 * all=result; }else { all=people; } result=null; byte[] excelBytes =
	 * excelService.generateExcel(all,password);
	 * 
	 * HttpHeaders headers = new HttpHeaders();
	 * headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
	 * headers.setContentDispositionFormData("attachment", "people.xlsx");
	 * 
	 * return ResponseEntity.ok() .headers(headers) .body(excelBytes); }
	 */
	@GetMapping("/api/excel/download")
	public ResponseEntity<byte[]> downloadExcel(@RequestParam(required = false) long id)
			throws IOException, GeneralSecurityException {
		List<Registration> people = mrepo.getByFlag(1);
		List<Registration> all;
		result = mrepo.findByUserInput(gender, marital, district);

		if (result != null) {

			all = result;
		} else {
			all = people;
		}
		result = null;

		Registration details = mrepo.getById(id);

		String user = details.getName();
		long number = details.getMobile();
		String Registration = details.getEmail();
		Date dateOfBirth = details.getDob(); // Replace with the actual date of birth

		// Generate password
		String password = generatePassword(Registration, dateOfBirth);

		// Print or use the generated password
		System.out.println("Generated Password: " + password);

//		Twilio.init("ACbfbdba32625ebc97883d49dfa2a8a6a7", "9f4769f07d7240ed983b27c266df0d57");
//
		String mesage = "Hey " + user + " (Admin) Your excel password is \"" + password + "\"";
		System.out.println(mesage);
//		// Specify the Twilio number (SID) and recipient number
//		String fromNumber = "+18587077492";
//		String toNumber = "+91" + number;
//		System.out.println("Mobile Number: " + toNumber);
//
//		// Create and send the message
//		Message.creator(new PhoneNumber(toNumber), new PhoneNumber(fromNumber), mesage
//
//		).create();
//
//		System.out.println("Message sent successfully!");
		// Generate the Excel file with the provided password
		try {
			// Introduce a delay of 3000 milliseconds (3 seconds)
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			// Handle the exception
			e.printStackTrace();
		}
		byte[] excelBytes = excelService.generateExcel(all, password);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.setContentDispositionFormData("attachment", "people.xlsx");

		return ResponseEntity.ok().headers(headers).body(excelBytes);
	}

	public static String generatePassword(String username, Date dateOfBirth) {
		// Get the first 3 letters of the username
		String usernamePrefix = username.substring(0, Math.min(username.length(), 5));

		// Format date of birth as ddMMyy
		SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMyy");
		String birthDateSuffix = dateFormat.format(dateOfBirth);

		// Combine username prefix and birth date suffix to form the password
		return usernamePrefix + birthDateSuffix;
	}

	private String gender = null;
	private String marital = null;
	private String district = null;

	@GetMapping("/data/{user}")
	public ResponseEntity<List<Registration>> getByUserInput(@PathVariable String user) {
		// Perform input validation if necessary
		String a = "g";
		if (user.equals(a)) {

			gender = null;
		} else {

			gender = user;
		}

		return new ResponseEntity<>(HttpStatus.NOT_FOUND);

	}

	@GetMapping("/data2/{user}")
	public ResponseEntity<List<Registration>> getByUserInput2(@PathVariable String user) {
		// Perform input validation if necessary
		String a = "h";
		if (user.equals(a)) {

			marital = null;
		} else {

			marital = user;

		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);

	}

	@GetMapping("/data3/{user}")
	public ResponseEntity<List<Registration>> getByUserInput3(@PathVariable String user) {
		// Perform input validation if necessary
		String a = "d";
		if (user.equals(a)) {

			district = null;
		} else {

			district = user;
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);

	}

	@GetMapping("/male")
	public List<Registration> getAllmale() {
		long f = 1;
		return mrepo.getByGenderAndFlag("Male", f);
	}

	@GetMapping("/female")
	public List<Registration> getAllFemale() {
		long f = 1;
		return mrepo.getByGenderAndFlag("Female", f);
	}

	@GetMapping("/trans")
	public List<Registration> getAlltrans() {
		long f = 1;
		return mrepo.getBytrns(f);
	}
}
/*
 * @GetMapping("/api/excel/download") public ResponseEntity<byte[]>
 * downloadExcel() throws IOException { List<Registration> people =
 * mrepo.getByFlag(1); byte[] excelBytes = excelService.generateExcel(people);
 * 
 * HttpHeaders headers = new HttpHeaders();
 * headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
 * headers.setContentDispositionFormData("attachment", "UsersData.xlsx");
 * 
 * return ResponseEntity.ok() .headers(headers) .body(excelBytes); }
 */

/*
 * @GetMapping("/images/{id}") public ResponseEntity<byte[]>
 * getImage2(@PathVariable long id) throws IOException { UploadFiles fileEntity
 * = up.findById(id) .orElseThrow(() -> new
 * RuntimeException("File not found with ID: " + id));
 * 
 * // Load the image from the classpath (replace "sample-image.jpg" with your
 * actual image file) Resource resource = new ClassPathResource("uploads/"+
 * fileEntity.getImagefileName());
 * 
 * // Create a Path object for the file
 * 
 * Path filePath = Paths.get(UPLOAD_DIR, fileEntity.getImagefileName());
 * 
 * // Create a FileSystemResource Resource resource = new
 * FileSystemResource(filePath);
 * 
 * 
 * // Read the image bytes byte[] imageBytes =
 * Files.readAllBytes(resource.getFile().toPath());
 * 
 * // Set the response headers HttpHeaders headers = new HttpHeaders();
 * headers.setContentType(MediaType.IMAGE_JPEG);
 * 
 * // Return the image bytes with appropriate headers return
 * ResponseEntity.ok().headers(headers).body(imageBytes);     }
 */
/*
 * @GetMapping("/distribution") public Map<String, Integer>
 * getGenderDistribution() { return service.getGenderDistribution(); } }
 */
