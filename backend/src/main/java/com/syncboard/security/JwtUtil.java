package com.syncboard.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import java.util.Date;

public class JwtUtil {

    private static final String SECRET =
            "syncboardsupersecretkeysyncboardsupersecretkey";

    private static final SecretKey KEY =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes());

    public static String generateToken(
            String email) {

        return Jwts.builder()

                .subject(email)

                .issuedAt(
                        new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                + 86400000))

                .signWith(KEY)

                .compact();
    }
}