package com.aloha.login.domain.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 서버에서 발급하는 JWT
@Data
@NoArgsConstructor
@AllArgsConstructor // 전체 필드 생성자) 객체 생성 편의용
public class JwtToken {
    
    private String accessToken;
    private String refreshToken;

}
