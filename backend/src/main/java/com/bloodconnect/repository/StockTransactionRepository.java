package com.bloodconnect.repository;

import com.bloodconnect.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, String> { }
