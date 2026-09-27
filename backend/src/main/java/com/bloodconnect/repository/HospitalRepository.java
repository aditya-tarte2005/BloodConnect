package com.bloodconnect.repository;

import com.bloodconnect.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, String> { }
