package com.aloha.todo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.todo.domain.Todo;
import com.aloha.todo.mapper.TodoMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{

    final private TodoMapper todoMapper;

    @Override
    public List<Todo> list() {
        return todoMapper.list();
    }

    @Override
    public PageInfo<Todo> list(int page, int size) {
        // ⭐ PageHelper.startPage( 현재 페이지, 페이지당 데이터 수 )
        PageHelper.startPage(page, size);
        List<Todo> list = todoMapper.list();
        PageInfo<Todo> pageInfo = new PageInfo<>(list);
        // 정렬
        // 1. status 오름차순
        // 2. seq 오름차순
        pageInfo.getList().sort((t1, t2) -> {
            int statusCompare = t1.getStatus().compareTo(t2.getStatus());
            if (statusCompare != 0) {
                return statusCompare;
            }
            return t1.getSeq().compareTo(t2.getSeq());
        });
        return pageInfo;
    }

    @Override
    public Todo select(Long no) {
        return todoMapper.select(no);
    }

    @Override
    public Todo selectById(String id) {
        return todoMapper.selectById(id);
    }

    @Override
    public boolean insert(Todo entity) {
        return todoMapper.insert(entity) > 0;
    }

    @Override
    public boolean update(Todo entity) {
        return todoMapper.update(entity) > 0;
    }

    @Override
    public boolean updateById(Todo entity) {
        return todoMapper.updateById(entity) > 0;
    }

    @Override
    public boolean delete(Todo entity) {
        return todoMapper.delete(entity) > 0;
    }

    @Override
    public boolean deleteById(Todo entity) {
        return todoMapper.deleteById(entity) > 0;
    }

    @Override
    public boolean completeAll() throws Exception {
        
    }

    @Override
    public boolean deleteAll() throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteAll'");
    }

    
}
