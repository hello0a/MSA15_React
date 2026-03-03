import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { boardsApi } from '../apis/boards'

const useBoard = (id) => {
    
    const {data, isLoading, isError, error, refetch } = useQuery ({
        queryKey: ['board', id],
        queryFn: () => boardsApi.select(id).then((res) => res.data),
        // !! : id가 falsy(null, undefined 등) 일 때, 실행하지 않도록 지정
        // id: null, !id = !(false) = true, !(!id) = !(true) = false
        enabled: !!id, 
    })

  return {
    //   board: data ?? null,
      board: data?.board ?? null,
      fileList: data?.fileList ?? [],
    isLoading,
    isError,
    error,
    refetch
  }
}

export default useBoard