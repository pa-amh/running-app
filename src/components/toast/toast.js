import './toast.css';
import React from "react";
import Button from "../button/button";

const Toast = ({show = 'false', colour = 'blue', position = 'bottom', data = null}) => {
    if (!show) return null;

    return (
        <div className={show ? 'show-toast' : 'hide-toast'}>
            <div className={`toast toast-${colour} toast-${position}`}>
                <div className="toast-data">Workout for {data ? data : ''} removed</div>
                <Button role="toast" btnStyle="toast">Undo</Button>
            </div>
        </div>
    );
}

export default Toast;
