package com.bloodconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transactions")
public class StockTransaction {
    @Id public String id;
    public LocalDateTime transactionDate;
    @NotBlank public String type;
    @NotBlank public String bloodGroup;
    @NotBlank public String component;
    @Min(1) public int quantity;
    public String reference;
    @NotBlank public String status = "Completed";

    @PrePersist void onCreate() { if (transactionDate == null) transactionDate = LocalDateTime.now(); }
}
