package com.pjdereva.minto.membership.advice;

import com.pjdereva.minto.membership.exception.UserEmailNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class UserEmailNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(UserEmailNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> exceptionHandler(UserEmailNotFoundException exception) {

        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", exception.getMessage());

        return errorMap;
    }
}
