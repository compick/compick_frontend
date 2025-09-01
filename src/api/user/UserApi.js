import api from '../FetchInstance';

/**
 * 사용자의 게시글과 댓글 목록을 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<object>} - { posts: [], comments: [] }
 */
export const getUserContent = async (userId) => {
    try {
        // 실제 API 엔드포인트로 수정해야 합니다.
        // 예시: const response = await axiosInstance.get(`/users/${userId}/content`);
        // 지금은 임시 데이터를 반환합니다.
        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 딜레이
        const mockData = {
            posts: [
                { id: 'p1', title: '리액트 너무 재미있어요' },
                { id: 'p2', title: '자바스크립트 질문 있습니다.' },
            ],
            comments: [
                { id: 'c1', content: '좋은 글 감사합니다.' },
                { id: 'c2', content: '저도 그렇게 생각해요!' },
                { id: 'c3', content: '이 부분은 좀 다른 것 같아요.' },
            ],
        };
        return mockData;
    } catch (error) {
        console.error("사용자 컨텐츠 조회 실패:", error);
        throw error;
    }
};

/**
 * 회원탈퇴를 처리합니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<object>} - 성공 메시지
 */
export const withdrawUser = async (userId) => {
    try {
        // 실제 API 엔드포인트로 수정해야 합니다.
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("회원탈퇴 처리 실패:", error);
        throw error;
    }
};

/**
 * 비밀번호를 확인합니다.
 * @param {string} userId - 사용자 ID
 * @param {string} password - 확인할 비밀번호
 * @returns {Promise<object>} - { success: boolean }
 */
export const checkPassword = async (userId, password) => {
    try {
        // 실제 API 엔드포인트로 수정해야 합니다.
        const response = await axiosInstance.post(`/users/${userId}/check-password`, { password });
        return response.data;
    } catch (error) {
        console.error("비밀번호 확인 실패:", error);
        throw error;
    }
};
