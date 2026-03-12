package com.aloha.login.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.aloha.login.domain.UserAuth;
import com.aloha.login.domain.Users;
import com.aloha.login.domain.auth.JwtToken;
import com.aloha.login.domain.auth.LoginResponse;
import com.aloha.login.domain.kakao.KakaoTokenResponse;
import com.aloha.login.domain.kakao.KakaoUserInfoResponse;
import com.aloha.login.mapper.UserMapper;
import com.aloha.login.security.provider.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KakaoLoginServiceImpl implements KakaoLoginService{
    
    private final JwtProvider jwtProvider;
    private final UserMapper userMapper;

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    // code: 카카오가 보내주는 인가 코드
	@Override
	public LoginResponse kakaoLogin(String code) throws Exception {
        
        // 1. access_token 요청 - POST
        KakaoTokenResponse tokenResponse = getKakaoToken(code);

        // 2. 사용자 정보 요청 - GET
        KakaoUserInfoResponse userInfo = getKakaoUserInfo(tokenResponse.getAccessToken());

        Long kakaoId = userInfo.getId();
        String email = userInfo.getKakaoAccount().getEmail();

        String username = "kakao_" + kakaoId;   // kakao_123456: 우리 서비스 내부 아이디 생성

        // 3. DB 조회
        Users user = userMapper.selectByProviderAndProviderId("kakao",String.valueOf(kakaoId)); // provider + provider_id 조회

        // 4. 회원 없으면 가입
        if ( user == null ) {
            user = Users.builder()
                        .username(username)
                        .email(email)
                        .provider("kakao")
                        .providerId(String.valueOf(kakaoId))
                        .enabled(true)
                        .build();
            userMapper.join(user);

            // 권한 생성
            UserAuth userAuth = UserAuth.builder()
                                        .username(username)
                                        .auth("ROLE_USER")
                                        .build();
            userMapper.insertAuth(userAuth);
            user.setAuthList(List.of(userAuth));
            /**
             * CustomUser.java
             * List<String> roles = user.getAuthList()
                                        .stream()
                                        .map(UserAuth::getAuth)
                                        .collect(Collectors.toList());
                -> 회원가입 직후에도 user.setAuthList 넣어주는 게 안전!
             */
        } else {
            List<UserAuth> authList = userMapper.selectAuthByUsername(username);
            user.setAuthList(authList);
        }

        // 5. JWT 발급
        List<String> roles = user.getAuthList()
                                .stream()
                                .map(UserAuth::getAuth)
                                .collect(Collectors.toList());
        String jwt = jwtProvider.createToken(user.getId(), username, roles);
        JwtToken jwtToken = new JwtToken(jwt, null);

        return new LoginResponse(username, user.getName(), user.getEmail(), jwtToken); // 로그인 응답 반환
	}

    // 카카오 access_token 요청
	private KakaoTokenResponse getKakaoToken(String code) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);   // 사용 설정 시 필수
        params.add("redirect_uri", redirectUri);
        params.add("code", code);   // 인가 코드

        HttpEntity<MultiValueMap<String, String>> request =
            new HttpEntity<>(params, headers);
        
        ResponseEntity<KakaoTokenResponse> response =
            restTemplate.postForEntity(
                "https://kauth.kakao.com/oauth/token", 
                request, 
                KakaoTokenResponse.class);
            
        return response.getBody();
	}

	private KakaoUserInfoResponse getKakaoUserInfo(String accessToken) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken); // Bearer 뒤에 공백 필요!

        HttpEntity<?> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserInfoResponse> response = 
            restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me", 
                HttpMethod.GET, request, 
                KakaoUserInfoResponse.class);
        
        return response.getBody();
	}
}
/**
 * JWT 발급 2번하는 이유
 * - 기존 JWT (일반 로그인)
 * POST /login
    ↓
    JwtAuthenticationFilter
    ↓
    username password 인증
    ↓
    successfulAuthentication()
    ↓
    JwtProvider.createToken()
    ↓
    JWT 발급
 * -> 아이디 / 비밀번호 로그인 -> JWT 발급
 * 
 * - 카카오 로그인
 * 카카오 로그인
    ↓
    인가코드
    ↓
    카카오 access_token
    ↓
    카카오 사용자 정보
    ↓
    DB 조회
    ↓
    JWT 발급
 * -> username / password 인증 과정X -> JwtAuthenticationFilter 과정X -> 서비스에서 JWT 발급!
 * 
 * String jwt = jwtProvider.createToken(user.getId(), username, roles);
 * : 카카오 인증 성공 -> 우리 서버 JWT 발급
 */
