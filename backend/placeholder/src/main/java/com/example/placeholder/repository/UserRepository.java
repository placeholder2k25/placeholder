package com.example.placeholder.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.placeholder.models.UserModel;

public interface UserRepository extends MongoRepository<UserModel, String>{
    Optional<UserModel> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhoneNo(String phoneNo);
}
