import React from "react";
import './button.css';

const iconCodes = {
    cancel: "&#10006;",
    edit: "&#9998;"
}

const Button = ({numBtns, handleClick = null, role = 'button', icon = 'cancel', children}) => {
    if (role === 'icon') {
        return <button
            className={`btn btn-button btn-icon-button`}
            role={role}
            onClick={handleClick}
            dangerouslySetInnerHTML={{__html: iconCodes[icon]}}
        />
    }

    return <button
        className={`btn btn-${role} ${numBtns ? `button-${numBtns}` : ''}`}
        type={role}
        onClick={handleClick}
    >{children}</button>
}

export default Button;
