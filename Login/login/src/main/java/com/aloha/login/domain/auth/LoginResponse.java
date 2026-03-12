package com.aloha.login.domain.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

// 로그인 응답 DTO
@Data
@AllArgsConstructor
public class LoginResponse {
    
    private String username;
    private String name;
    private String email;

    private JwtToken token;
}
