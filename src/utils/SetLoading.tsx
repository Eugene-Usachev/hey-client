import React, {memo, FC} from 'react';

interface Props {
    styles?: React.CSSProperties;
}

export const SetLoading: FC = memo<Props>(({styles = {}}) => {

    return (
        <div style={{height:"100%"}}>
            <div style={styles} className={"loading"}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );

});