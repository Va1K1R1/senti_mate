import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/Header.jsx";
import Button from "../component/Button.jsx";
import Editor from "../component/Editor.jsx";

const New = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    // 실제 저장 로직 대신 예시로 alert 처리
    const onSave = (data) => {
        console.log("저장된 일기 데이터:", data);
        alert("새 일기가 저장되었습니다!");
        navigate("/", { replace: true });
    };

    return (
        <div>
            <Header
                title="새로운 감정일기"
                leftChild={<Button text="< 뒤로가기" onClick={goBack} />}
                rightChild={<Button text="저장" onClick={() => onSave(/*임시 예시*/) } />}
            />
            <Editor />
        </div>
    );
};

export default New;
