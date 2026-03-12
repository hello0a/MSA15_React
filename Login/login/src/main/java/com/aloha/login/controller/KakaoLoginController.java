package com.aloha.login.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.login.domain.auth.LoginResponse;
import com.aloha.login.service.KakaoLoginService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class KakaoLoginController {
    
    private final KakaoLoginService kakaoLoginService;

    // callback 역할
    // Redirect URI 경로와 일치!
    @GetMapping("/kakao/callback")
    public LoginResponse kakaoLogin(@RequestParam("code") String code) throws Exception {
        log.info("인가코드: {}", code);
        return kakaoLoginService.kakaoLogin(code);
    }
}
/**
 * 전체 흐름
 * 
 * 1 로그인 버튼 클릭
    ↓
    2 https://kauth.kakao.com/oauth/authorize
    ↓
    3 카카오 로그인
    ↓
    4 redirect
    http://localhost:8080/login/kakao?code=xxxx
    ↓
    5 Controller 실행
    ↓
    6 kakaoLoginService 실행
    ↓
    7 access token 요청
    ↓
    8 사용자 정보 조회
    ↓
    9 DB 회원 조회/가입
    ↓
    10 JWT 발급
    ↓
    11 LoginResponse 반환
 */
