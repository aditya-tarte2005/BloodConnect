package com.bloodconnect.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
public class Hospital {
    @Id public String id;
    @NotBlank public String name;
    @Column(unique = true) public String registrationNumber;
    @NotBlank public String city;
    @NotBlank public String contactPerson;
    @NotBlank public String phone;
    @Email public String email;
    public String address;
    @NotBlank public String status = "Active";
    public LocalDateTime createdAt;

    @PrePersist void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
