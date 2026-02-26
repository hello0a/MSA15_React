package com.aloha.board.domain;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

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

    // 파일 
    private MultipartFile mainFile;
    private List<MultipartFile> files;
    
    // 파일정보
    private Files file;     // 메인 파일 1:1
    private List<Files> fileList;   // 첨부 파일 1:N

    private Boards() {
        this.id = UUID.randomUUID().toString();
    }
}
