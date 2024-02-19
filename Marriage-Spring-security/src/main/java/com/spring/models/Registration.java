package com.spring.models;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;



@Entity
public class Registration {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private String name;
	private Date dob;
	private long mobile;
	private String email;
	private long age;
	private String maritalStatus;
	private String area;
	private String district;
	private String block;
	private String gender;
	private String gram;
	private String city;
	private String pass;
	private String role;
	private long flag;

	/*
	 * @OneToOne(cascade = CascadeType.ALL)
	 * 
	 * @JoinColumn(name = "image_id", referencedColumnName = "id") private
	 * ImageEntity image;
	 */
	 
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "file_id", referencedColumnName = "id")
	private UploadFiles ufile;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public long getMobile() {
		return mobile;
	}

	public void setMobile(long mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public long getAge() {
		return age;
	}

	public void setAge(long age) {
		this.age = age;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public String getBlock() {
		return block;
	}

	public void setBlock(String block) {
		this.block = block;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getGram() {
		return gram;
	}

	public void setGram(String gram) {
		this.gram = gram;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public long getFlag() {
		return flag;
	}

	public void setFlag(long flag) {
		this.flag = flag;
	}

	public UploadFiles getUfile() {
		return ufile;
	}

	public void setUfile(UploadFiles ufile) {
		this.ufile = ufile;
	}

	public Registration(long id, String name, Date dob, long mobile, String email, long age, String maritalStatus,
			String area, String district, String block, String gender, String gram, String city, String pass,
			String role, long flag, UploadFiles ufile) {
		super();
		this.id = id;
		this.name = name;
		this.dob = dob;
		this.mobile = mobile;
		this.email = email;
		this.age = age;
		this.maritalStatus = maritalStatus;
		this.area = area;
		this.district = district;
		this.block = block;
		this.gender = gender;
		this.gram = gram;
		this.city = city;
		this.pass = pass;
		this.role = role;
		this.flag = flag;
		this.ufile = ufile;
	}

	public Registration() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
	
	
}
