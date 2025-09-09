package com.example.placeholder.models;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {

    private UserModel user;

    public UserPrincipal(UserModel user) {
        this.user = user;
    }

    public static UserPrincipal from(Optional<UserModel> optionalUser) {
        return optionalUser.map(UserPrincipal::new)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Dynamically set authority based on user role
        // Spring Security requires ROLE_ prefix
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    public String getUserId() {
        return user.getUserId();
    }

    public UserModel getUser() {
        return user;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
