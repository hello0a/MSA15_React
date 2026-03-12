package com.aloha.login.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.aloha.login.domain.KakaoTokenResponse;
import com.aloha.login.domain.KakaoUserResponse;
import com.aloha.login.security.provider.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KakaoService {

    @Value("${kakao.client_id}")
    private String clientId;

    @Value("${kakao.redirect_uri}")
    private String redirectUri;

    private final JwtProvider jwtProvider;
    private final UserService userService;

    public String login(String code) {

        String accessToken = getAccessToken(code);

        KakaoUserResponse userInfo = getUserInfo(accessToken);

        Long kakaoId = userInfo.getId();

        User user = userService.findByKakaoId(kakaoId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setKakaoId(kakaoId);
                    newUser.setEmail(userInfo.getKakao_account().getEmail());
                    return userRepository.save(newUser);
                });

        return jwtProvider.createToken(user.getUsername(), accessToken, null);
    }

    private String getAccessToken(String code) {

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        ResponseEntity<KakaoTokenResponse> response =
                restTemplate.postForEntity(
                        "https://kauth.kakao.com/oauth/token",
                        request,
                        KakaoTokenResponse.class
                );

        return response.getBody().getAccess_token();
    }

    private KakaoUserResponse getUserInfo(String accessToken) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<?> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserResponse> response =
                restTemplate.exchange(
                        "https://kapi.kakao.com/v2/user/me",
                        HttpMethod.GET,
                        request,
                        KakaoUserResponse.class
                );

        return response.getBody();
    }

}
