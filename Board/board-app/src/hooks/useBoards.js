import { useQuery } from '@tanstack/react-query'
import { boardsApi } from '../apis/boards'

/**
 * 게시글 목록 조회 커스텀 훅
 * @param {*} page 
 * @param {*} size 
 */
export const useBoards = (page = 1, size = 10) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['boards', page, size],
        queryFn:() => boardsApi.list(page, size).then((res) => res.data),
        placeholderData: (prev) => prev,
    })

    return {
        list: data?.list ?? [], // data null 이라면 [], null 아니면 list (ECMAScript: ?. 옵셔널 체인지 / ?? 널병합)
        pagination: data?.pagination ?? {},
        isLoading,
        isError,
        error
    }
}