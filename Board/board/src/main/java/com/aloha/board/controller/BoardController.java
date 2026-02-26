package com.aloha.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.board.domain.Boards;
import com.aloha.board.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// @CrossOrigin (
//     origins = {
//         "http://localhost:3000",
//         "http://localhost:5173"
//     }
// ) -> 실무
@CrossOrigin("*")
@Slf4j
@RestController 
@RequiredArgsConstructor
@RequestMapping ("/boards")
public class BoardController {
    
    private final BoardService boardService;

    // 리스트 조회
    @GetMapping()
    public ResponseEntity<?> getAll() {
        try {
            List<Boards> list = boardService.list();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            log.error("****error", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") String id) {
        try {
            Boards board = boardService.selectById(id);
            return new ResponseEntity<>(board, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 게시글 등록
    @PostMapping()
    public ResponseEntity<?> create(@RequestBody Boards board) {
        try {
            boolean result = boardService.insert(board);
            if (result) {
                return new ResponseEntity<>("SUCCESS", HttpStatus.CREATED);
            }
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 게시글 수정
    @PutMapping()
    public ResponseEntity<?> update(@RequestBody Boards board) {
        try {
            boolean result = boardService.updateById(board);
            if (result) {
                return new ResponseEntity<>(board, HttpStatus.OK);
            }
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable("id") String id) {
        try {
            boolean result = boardService.deleteById(id);
            if (result) {
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            }
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
