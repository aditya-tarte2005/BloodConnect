package com.bloodconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
public class BloodRequest {
    @Id public String id;
    public String hospitalId;
    @NotBlank public String hospitalName;
    @NotBlank public String bloodGroup;
    @NotBlank public String component;
    @Min(1) public int quantity;
    public LocalDate requiredDate;
    @NotBlank public String priority = "Medium";
    @NotBlank public String status = "Pending";
    public String notes;
    public LocalDateTime createdAt;

    @PrePersist void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
