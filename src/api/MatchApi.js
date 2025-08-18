import axiosInstance from './axiosInstance';

export const getMatches = async (year, month, league) => {
    try {
        // API 요청 시 월은 1부터 시작하는 반면, JS Date 객체는 0부터 시작하므로 +1 해줍니다.
        const response = await axiosInstance.get('/matches', {
            params: {
                year: year,
                month: month + 1,
                league: league.toLowerCase() === 'all' ? null : league // 'all'일 경우 파라미터 생략
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
    }
};
