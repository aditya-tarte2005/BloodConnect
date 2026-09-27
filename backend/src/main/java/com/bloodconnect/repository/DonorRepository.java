package com.bloodconnect.repository;

import com.bloodconnect.model.BloodDonor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonorRepository extends JpaRepository<BloodDonor, String> { }
