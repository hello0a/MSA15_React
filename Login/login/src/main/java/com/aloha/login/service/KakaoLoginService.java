package com.aloha.login.service;

import com.aloha.login.domain.auth.LoginResponse;

public interface KakaoLoginService {
    LoginResponse kakaoLogin(String code) throws Exception;
}
