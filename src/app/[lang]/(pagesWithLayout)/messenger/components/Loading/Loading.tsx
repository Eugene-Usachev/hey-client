"use client";
import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import {RightColumn} from "@/app/[lang]/(pagesWithLayout)/messenger/components/Loading/RightColumn";

export const Loading: FC = observer(() => {

    return (
        <div style={{height: '100%', display: 'flex'}}>
            <div style={{width: '66%'}}></div>
            <RightColumn/>
        </div>
    );
});