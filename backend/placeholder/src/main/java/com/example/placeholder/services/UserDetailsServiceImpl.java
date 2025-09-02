package com.example.placeholder.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.placeholder.models.UserModel;
import com.example.placeholder.models.UserPrincipal;
import com.example.placeholder.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch user from DB
        Optional<UserModel> optionalUser = userRepository.findByUsername(username);

        // Throw exception if not found
        UserModel user = optionalUser.orElseThrow(() -> {
            System.out.println("[UserDetailsService] User not found: " + username);
            return new UsernameNotFoundException("User not found with username: " + username);
        });

        // Return UserPrincipal which handles role-based authorities
        return new UserPrincipal(user);
    }
}
