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
@Table(name = "inventory_units")
public class InventoryUnit {
    @Id public String id;
    public String donorId;
    @NotBlank public String bloodGroup;
    @NotBlank public String component;
    public LocalDate collectionDate;
    public LocalDate expiryDate;
    @Min(1) public int quantity;
    public String storageLocation;
    @NotBlank public String status = "Available";
    public LocalDateTime createdAt;

    @PrePersist void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
