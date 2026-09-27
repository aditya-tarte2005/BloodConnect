package com.bloodconnect.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors")
public class BloodDonor {
    @Id public String id;
    @NotBlank public String name;
    @NotBlank @Pattern(regexp = "A[+-]|B[+-]|AB[+-]|O[+-]") public String bloodGroup;
    @Min(18) @Max(65) public int age;
    @NotBlank public String gender;
    @NotBlank @Column(unique = true) public String phone;
    public LocalDate lastDonationDate;
    public String address;
    @NotBlank public String status = "Active";
    public LocalDateTime createdAt;

    @PrePersist void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
