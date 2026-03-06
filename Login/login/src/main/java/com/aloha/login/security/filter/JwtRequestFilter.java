package com.aloha.login.security.filter;

import java.io.IOException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aloha.login.security.constants.SecurityConstants;
import com.aloha.login.security.provider.JwtProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
// @RequiredArgsConstructor -> JwtRequestFilter 생성자 정의X
// 반대로, 없으면 생성자 정의 필요!
public class JwtRequestFilter extends OncePerRequestFilter {    // AuthenticationFilter 와 달리 경로(/login) 지정 안했으므로, 모든 경로 Filtering

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public JwtRequestFilter( AuthenticationManager authenticationManager, JwtProvider jwtProvider ) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request, HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {
        String authorization = request.getHeader( SecurityConstants.TOKEN_HEADER ); // 토큰 없다
        log.info("authorization : " + authorization);
        if( authorization == null || authorization.length() == 0 || !authorization.startsWith( SecurityConstants.TOKEN_PREFIX ) ) {
            filterChain.doFilter(request, response);
            return;
        }
        // 헤더에서 토큰 추출 -> 토큰 검증 -> 인증 객체 저장
        String jwt = authorization.replace( SecurityConstants.TOKEN_PREFIX, "");    // 토큰 있다
        Authentication authentication = jwtProvider.getAuthenticationToken(jwt);
            if( authentication != null && authentication.isAuthenticated() ) {
            log.info("JWT authentication complete");
        }
        boolean result = jwtProvider.validateToken(jwt); // 토큰 유효 확인
        if( result ) {
            log.info("Valid JWT token");
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
