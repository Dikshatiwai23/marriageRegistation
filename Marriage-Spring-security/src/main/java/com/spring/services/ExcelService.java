package com.spring.services;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.security.GeneralSecurityException;
import java.util.List;

import org.apache.poi.poifs.crypt.EncryptionInfo;
import org.apache.poi.poifs.crypt.EncryptionMode;
import org.apache.poi.poifs.crypt.Encryptor;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.spring.models.Registration;


@Service
public class ExcelService {

    public byte[] generateExcel(List<Registration> people, String password) throws IOException, GeneralSecurityException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("People");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Email");
            headerRow.createCell(3).setCellValue("DOB");
            headerRow.createCell(4).setCellValue("Age");
            headerRow.createCell(5).setCellValue("Role");
            headerRow.createCell(6).setCellValue("Gender");
            headerRow.createCell(7).setCellValue("MaritalStatus");
            headerRow.createCell(8).setCellValue("Mobile Number");
            headerRow.createCell(9).setCellValue("Area");
            headerRow.createCell(10).setCellValue("District");
            headerRow.createCell(11).setCellValue("Block");
            headerRow.createCell(12).setCellValue("City");
            headerRow.createCell(13).setCellValue("Village");
          
            

            // Populate data rows
            int rowNum = 1;
            for (Registration person : people) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(person.getId());
                row.createCell(1).setCellValue(person.getName());
                row.createCell(2).setCellValue(person.getEmail());
                row.createCell(3).setCellValue(person.getDob());
                row.createCell(4).setCellValue(person.getAge());
                row.createCell(5).setCellValue(person.getRole());
                row.createCell(6).setCellValue(person.getGender());
                row.createCell(7).setCellValue(person.getMaritalStatus());
                row.createCell(8).setCellValue(person.getMobile());
                row.createCell(9).setCellValue(person.getArea());
                row.createCell(10).setCellValue(person.getDistrict());
                
                row.createCell(11).setCellValue(person.getBlock());
                row.createCell(12).setCellValue(person.getCity());
                row.createCell(13).setCellValue(person.getGram());
               
               
              
            }

            // Write the workbook content to a ByteArrayOutputStream
			/*
			 * ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			 * workbook.write(outputStream); return outputStream.toByteArray();
			 */
            
            EncryptionInfo info = new EncryptionInfo(EncryptionMode.agile);

            // Set a password for encryption
            if (password != null && !password.isEmpty()) {
                Encryptor enc = info.getEncryptor();
                enc.confirmPassword(password);
            }

            // Write the workbook content to a ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Encrypt the workbook content
            try (POIFSFileSystem fs = new POIFSFileSystem()) {
                OutputStream os = info.getEncryptor().getDataStream(fs);
                os.write(outputStream.toByteArray());
                os.close();

                // Write the encrypted workbook content to a ByteArrayOutputStream
                ByteArrayOutputStream encryptedStream = new ByteArrayOutputStream();
                fs.writeFilesystem(encryptedStream);

                return encryptedStream.toByteArray();
            }
        }
    }
}
