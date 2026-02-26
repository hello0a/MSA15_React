package com.aloha.board.domain;

import java.util.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class Boards {
    private Long no;    // pk
    private String id;  //uk
    private String title;   // 제목
    private String writer;  // 작성자
    private String content; // 내용
    private Date createdAt; // 등록일자
    private Date updatedAt; // 수정일자

    private Boards() {
        this.id = UUID.randomUUID().toString();
    }
}
