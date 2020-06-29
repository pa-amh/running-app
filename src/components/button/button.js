import React from "react";
import './button.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Button = ({isDisabled, className, numBtns, handleClick = null, role = 'button', icon = 'trash', children}) => {
    if (role === 'icon') {
        return <button className={`btn btn-button btn-icon-button`} role={role}
                   onClick={handleClick}>
            <FontAwesomeIcon icon={['fa', icon]} />
        </button>
    }

    return <button
        className={`btn ${isDisabled ? 'btn-disabled' : `btn-${role}`} ${numBtns ? `button-${numBtns}` : ''} ${className}`}
        type={role}
        onClick={handleClick}
        disabled={isDisabled}
    >{children}</button>
}

export default Button;
