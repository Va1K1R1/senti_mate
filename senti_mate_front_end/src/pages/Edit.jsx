import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../component/Header.jsx";
import Editor from "../component/Editor.jsx";
import DiaryService from "../services/DiaryService";

const EditEntry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        DiaryService.getEntryById(id)
            .then(data => setEntry(data))
            .catch(console.error);
    }, [id]);

    const handleSave = async (updated) => {
        try {
            // updateEntry 사용
            await DiaryService.updateEntry(id, updated);
            navigate(`/diary/${id}`);
        } catch (err) {
            alert(err.message);
        }
    };

    if (!entry) return <div>로딩 중…</div>;

    return (
        <>
            <Header
                title="일기 수정"
                leftChild={<div onClick={() => navigate(-1)}>← 뒤로가기</div>}
            />
            <Editor
                isEditMode
                initialData={entry}
                onSubmit={handleSave}
            />
        </>
    );
};

export default EditEntry;
