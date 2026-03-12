package com.aloha.login.domain.kakao;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoUserInfoResponse {

    private Long id;
    
    @JsonProperty("kakao_account")
    //Spring에서 JSON ↔ Java 객체 변환할 때 이름을 맞춰주는 어노테이션
    private KakaoAccount kakaoAccount;
}
/**
 * 카카오 API JSON 구조
 * {
    "id": 12345678,
    "kakao_account": {
            "email": "test@test.com"
        }
    } -> KakaoAccount 객체
 */