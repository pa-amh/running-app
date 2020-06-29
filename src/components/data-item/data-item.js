import './data-item.css';
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const DataItem = ({icon = null, data}) => {
    return (
        <div className="data-item">
            <FontAwesomeIcon className="icon" icon={['fa', icon]} />
            <span>{data}</span>
        </div>
    );
}

export default DataItem;
