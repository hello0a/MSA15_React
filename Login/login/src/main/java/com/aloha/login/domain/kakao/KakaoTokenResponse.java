package com.aloha.login.domain.kakao;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

// 카카오 토큰 API 응답
@Data
@NoArgsConstructor // 기본생성자) JSON -> 객체 변환
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoTokenResponse {
    
    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("expires_in")
    private Integer expiresIn;

    @JsonProperty("refresh_token")
    private String refreshToken;

}
