package com.syncboard.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.
        UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.
        SecurityContextHolder;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

public class JwtFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)

            throws IOException,
            ServletException {

        HttpServletRequest req =
                (HttpServletRequest) request;

        String authHeader =
                req.getHeader(
                        "Authorization");

        if (authHeader != null &&
                authHeader.startsWith(
                        "Bearer ")) {

            String token =
                    authHeader.substring(
                            7);

            if (JwtUtil.validateToken(
                    token)) {

                String email =
                        JwtUtil.extractEmail(
                                token);

                UsernamePasswordAuthenticationToken auth =

                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.emptyList()
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                auth);

            }
        }

        chain.doFilter(
                request,
                response);
    }
}