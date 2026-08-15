package com.slts.expensetracker.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    public final HttpStatus status;

    public ApiException(String m, HttpStatus s) {
        super(m);
        status = s;
    }
}