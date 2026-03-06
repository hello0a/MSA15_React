package com.aloha.jwt.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.jwt.constants.SecurityConstants;
import com.aloha.jwt.domain.AuthenticationRequest;
import com.aloha.jwt.props.JwtProps;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;  // 추가: 새로운 방식으로 SecretKey 생성을 위한 클래스
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
public class LoginController {

    @Autowired
    private JwtProps jwtProps;

    /**
     * 👩‍💼➡🔐 JWT 을 생성하는 Login 요청
     * [POST] - /login
     * body : 
            {
                "username" : "joeun",
                "password" : "123456"
            }
     * @param authReq
     * @return
     */
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest authReq) {
        // 사용자로부터 전달받은 인증 정보
        String username = authReq.getUsername();
        String password = authReq.getPassword();

        log.info("username : " + username);
        log.info("password : " + password);

        // 사용자 역할 정보
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");
        roles.add("ROLE_ADMIN");

        // 서명에 사용할 키 생성 (새로운 방식)
        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = jwtProps.getSecretKey().getBytes();

        log.info("secretKey : " + secretKey);
        log.info("signingKey : " + signingKey);

        // JWT 토큰 생성
        String jwt = Jwts.builder()
                .signWith(Keys.hmacShaKeyFor(signingKey), Jwts.SIG.HS512)      // 서명에 사용할 키와 알고리즘 설정
                // .setHeaderParam("typ", SecurityConstants.TOKEN_TYPE)        // deprecated (version: before 1.0)
                .header()                                                      // update (version : after 1.0)
                    .add("typ", SecurityConstants.TOKEN_TYPE)              // 헤더 설정 : SecurityConstants.TOKEN_TYPE(=JWT)
                .and()
                .expiration(new Date(System.currentTimeMillis() + 864000000))  // 토큰 만료 시간 설정 (10일) 
                .claim("uid", username)                                   // 클레임 설정: 사용자 아이디 // payload (아래까지)
                .claim("rol", roles)                                      // 클레임 설정: 역할 정보
                .compact();                                                    // 최종적으로 토큰 생성

        log.info("jwt : " + jwt);

        // 생성된 토큰을 클라이언트에게 반환
        return new ResponseEntity<String>(jwt, HttpStatus.OK);
    }


    /**
     * 🔐➡👩‍💼 JWT 를 해석하는 요청
     * 
     * @param header
     * @return
     */
    @GetMapping("/user/info")   // 권한 정보 url로 보내기
    public ResponseEntity<String> userInfo(@RequestHeader(name="Authorization") String header) {

        log.info("===== header =====");
        log.info("Authorization : " + header);

        String jwt = header.substring(7);           // "Bearer " + jwt  ➡ jwt 추출

        log.info("jwt : " + jwt);

        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = jwtProps.getSecretKey().getBytes();

        log.info("secretKey : " + secretKey);
        log.info("signingKey : " + signingKey);

        // TODO : deprecated 업애기 (version: before 1.0)
        // Jws<Claims> parsedToken = Jwts.parser()
        //                                 .setSigningKey(signingKey)
        //                                 .build()
        //                                 .parseClaimsJws(jwt);

        // OK : deprecated 된 코드 업데이트 (version : after 1.0)
        // - setSigningKey(byte[]) ➡ verifyWith(SecretKey)
        // - parseClaimsJws(CharSequence) ➡ parseSignedClaims(CharSequence)
        Jws<Claims> parsedToken = Jwts.parser() // parser 메서드로 해석
                                        .verifyWith(Keys.hmacShaKeyFor(signingKey))
                                        .build()
                                        .parseSignedClaims(jwt);    // JWT 파싱(분리) + 서명 검증 후 Claims 객체 생성
        log.info("parsedToken : " + parsedToken);

        
        String username = parsedToken.getPayload().get("uid").toString(); // 객체의 payload "uid" 접근
        log.info("username : " + username);

        Claims claims = parsedToken.getPayload();
        Object roles = claims.get("rol");
        log.info("roles : " + roles);

        return new ResponseEntity<String>(parsedToken.toString(), HttpStatus.OK);   // payload(클레임 정보)를 문자열로 반환
    }
    
}