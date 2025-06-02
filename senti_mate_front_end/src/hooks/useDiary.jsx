import { useState, useEffect } from "react";

// 예시: 로컬 스토리지나 상태관리에서 특정 id 일기를 찾아오는 로직
// 여기서는 예시용 dummy 데이터를 반환하는 형태로 작성
const dummyDiaries = [
    {
        id: 1,
        date: new Date().getTime(),
        emotionId: 2,
        content: "오늘은 기분이 좋았다. React 공부도 열심히 했음.",
    },
    {
        id: 2,
        date: new Date().getTime() - 86400000,
        emotionId: 4,
        content: "어제는 좀 우울했지만 친구와 이야기해서 나아졌다.",
    },
    // 실제로는 DB/API 호출 또는 Context 등으로 교체하면 됨
];

const useDiary = (id) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const diary = dummyDiaries.find((it) => String(it.id) === String(id));
        if (diary) {
            setData(diary);
        }
    }, [id]);

    return data;
};

export default useDiary;
