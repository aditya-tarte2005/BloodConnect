package com.bloodconnect.repository;

import com.bloodconnect.model.AppSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppSettingsRepository extends JpaRepository<AppSettings, String> { }
