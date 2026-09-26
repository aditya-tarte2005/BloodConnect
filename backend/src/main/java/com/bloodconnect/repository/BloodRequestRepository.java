package com.bloodconnect.repository;

import com.bloodconnect.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, String> { }
