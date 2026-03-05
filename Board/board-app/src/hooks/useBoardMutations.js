import { useMutation, useQueryClient } from "@tanstack/react-query"
import { boardsApi } from "../apis/boards"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import { filesApi } from "../apis/files"

// 공통 알림
const sweetAlert = (title, text, icon) => 
    Swal.fire({
        title,
        text,
        icon: icon,      // success, error, warning, info, question
        confirmButtonText: '확인',
        confirmButtonColor: '#3b82f6'
    })

export const useBoardMutations = (id) => {
    // React Query 클라이언트 생성
    const queryClient = useQueryClient()
    // 리액트 라우터로 페이지 이동하기 위한 훅
    const navigate = useNavigate()

    // 글 등록
    // useMutation? 데이터를 변경하는 작업을 수행하는 React Query 훅
    const insertMutation = useMutation({
        // mutationFn : API 요청을 하는 함수 지정
        mutationFn: ({ data, headers }) => boardsApi.insert(data, headers),
        // onSuccess : 요청 성공 시 실행되는 콜백 함수
        onSuccess: async () => {
            // invalidateQueries: queryKey 지정하여, 캐시만료시키는 함수
            queryClient.invalidateQueries({ queryKey: ['boards']})
            // TODO: 등록 성공, 게시글 등록이 완료되었습니다.
            // alert('게시글 등록이 완료되었습니다.')
            // sweetalert 비동기 -> +await -> 동기
            // sweetalert -> 목록 이동
            await sweetAlert('등록 성공', '게시글 등록이 완료되었습니다', 'success')
            // 게시글 등록 후 목록 페이지로 이동
            navigate('/boards')
        }
    })

    // 글 수정
    const updateMutation = useMutation ({
        mutationFn: ({ data, headers }) => boardsApi.update(data, headers),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            queryClient.invalidateQueries({ queryKey: ['board', id] })
            await sweetAlert('수정 성공', '게시글 수정이 완료되었습니다', 'success')
            navigate('/boards')
        }
    })

    // 단일 파일 삭제
    const deleteFileMutation = useMutation ({
        mutationFn: (fileId) => filesApi.remove( fileId ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', id]})
        }
    })

    // 여러 파일 삭제
    const deleteFilesMutation = useMutation ({
        mutationFn: (idList) => filesApi.removefiles( idList ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', id]})
        }
    })

    return {
        insertBoard: (data, headers) => insertMutation.mutate({ data, headers }),
        updateBoard: (data, headers) => updateMutation.mutate({ data, headers }),
        deleteFile: (fileId) => deleteFileMutation.mutate(fileId),
        deleteFileList: (idList) => deleteFilesMutation.mutate(idList),
        isInserting: insertMutation.isPending,
        isUpdating: updateMutation.isPending,
        isFileDeleting: deleteFileMutation.isPending,
        isFileListDeleting: deleteFilesMutation.isPending,

    }
}