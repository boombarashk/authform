import React from 'react';

export function ServerMsg(props){
    return (
        <div className={`App-serverMsg ${props.classNameModify ? props.classNameModify : ''}`}>
            { props.msg }
        </div>
    )
}
