// 날짜를 "YYYY-MM-DD" 형태로 포맷팅해주는 헬퍼 함수
export const getFormattedDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};
