package com.example.senti_mate_back_end.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service for handling file storage operations
 */
@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    /**
     * Constructor to initialize the file storage location
     * @param uploadDir the directory where files will be stored
     */
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir)
                .toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Store a file in the file system
     * @param file the file to store
     * @return the filename of the stored file
     * @throws IOException if an I/O error occurs
     */
    public String storeFile(MultipartFile file) throws IOException {
        // Normalize file name
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        // Generate a unique file name to prevent conflicts
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        // Copy file to the target location
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return fileName;
    }

    /**
     * Delete a file from the file system
     * @param fileName the name of the file to delete
     * @return true if the file was deleted successfully, false otherwise
     */
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            return false;
        }
    }

    /**
     * Get the path to a file
     * @param fileName the name of the file
     * @return the path to the file
     */
    public Path getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
}