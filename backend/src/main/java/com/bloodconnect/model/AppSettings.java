package com.bloodconnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_settings")
public class AppSettings {
    @Id public String id = "default";
    public String firstName = "Admin";
    public String lastName = "";
    public String email = "admin@bloodconnect.com";
    public String phone = "";
    public String bloodBankName = "BloodConnect Blood Bank";
    public String location = "";
    public String contactNumber = "";
    public String bloodBankCode = "";
    public boolean lowStockAlerts = true;
    public boolean expiryAlerts = true;
    public boolean requestAlerts = true;
    public String defaultComponent = "Whole Blood";
    public String defaultRequestStatus = "Pending";
    public int recordsPerPage = 10;
}
