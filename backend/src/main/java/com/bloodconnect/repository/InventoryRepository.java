package com.bloodconnect.repository;

import com.bloodconnect.model.InventoryUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryUnit, String> {
    List<InventoryUnit> findByBloodGroupAndComponentAndStatusOrderByExpiryDateAsc(String bloodGroup, String component, String status);
}
