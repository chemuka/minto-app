package com.pjdereva.minto.membership.exception;

public class MemberIdNotFoundException extends RuntimeException {

  public MemberIdNotFoundException(Long id) {
    super("Could not find member with member_id: " + id);
  }
}
