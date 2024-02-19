package com.spring.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class UploadFiles {
	@Id

    private long id;
    private String panfileName;
    private String panfilePath;
    private String adharfileName;
    private String adharfilePath;
    private String tenfileName;
    private String tenfilePath;
    private String twelvefileName;
    private String twelvefilePath;
    private String imagefileName;
    private String imagefilePath;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getPanfileName() {
		return panfileName;
	}
	public void setPanfileName(String panfileName) {
		this.panfileName = panfileName;
	}
	public String getPanfilePath() {
		return panfilePath;
	}
	public void setPanfilePath(String panfilePath) {
		this.panfilePath = panfilePath;
	}
	public String getAdharfileName() {
		return adharfileName;
	}
	public void setAdharfileName(String adharfileName) {
		this.adharfileName = adharfileName;
	}
	public String getAdharfilePath() {
		return adharfilePath;
	}
	public void setAdharfilePath(String adharfilePath) {
		this.adharfilePath = adharfilePath;
	}
	public String getTenfileName() {
		return tenfileName;
	}
	public void setTenfileName(String tenfileName) {
		this.tenfileName = tenfileName;
	}
	public String getTenfilePath() {
		return tenfilePath;
	}
	public void setTenfilePath(String tenfilePath) {
		this.tenfilePath = tenfilePath;
	}
	public String getTwelvefileName() {
		return twelvefileName;
	}
	public void setTwelvefileName(String twelvefileName) {
		this.twelvefileName = twelvefileName;
	}
	public String getTwelvefilePath() {
		return twelvefilePath;
	}
	public void setTwelvefilePath(String twelvefilePath) {
		this.twelvefilePath = twelvefilePath;
	}
	public String getImagefileName() {
		return imagefileName;
	}
	public void setImagefileName(String imagefileName) {
		this.imagefileName = imagefileName;
	}
	public String getImagefilePath() {
		return imagefilePath;
	}
	public void setImagefilePath(String imagefilePath) {
		this.imagefilePath = imagefilePath;
	}
	public UploadFiles(long id, String panfileName, String panfilePath, String adharfileName, String adharfilePath,
			String tenfileName, String tenfilePath, String twelvefileName, String twelvefilePath, String imagefileName,
			String imagefilePath) {
		super();
		this.id = id;
		this.panfileName = panfileName;
		this.panfilePath = panfilePath;
		this.adharfileName = adharfileName;
		this.adharfilePath = adharfilePath;
		this.tenfileName = tenfileName;
		this.tenfilePath = tenfilePath;
		this.twelvefileName = twelvefileName;
		this.twelvefilePath = twelvefilePath;
		this.imagefileName = imagefileName;
		this.imagefilePath = imagefilePath;
	}
	public UploadFiles() {
		super();
		// TODO Auto-generated constructor stub
	}	

}
