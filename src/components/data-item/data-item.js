import './data-item.css';
import React from "react";
import Button from "../button/button";
import {ddmmmmyyyy, getFormattedDate} from "../../utils/datetime.utils";

const DataItem = ({handleDelete, handleEdit, data}) => {
    return (
        <li className={`data-list-entry`}>
            <div className="data-list-entry-data">
                {getFormattedDate(data.date, ddmmmmyyyy)} - {data.distance}km - {data.minutes}mins {data.seconds}secs
            </div>
            <div className="data-list-entry-buttons">
                <Button role="icon" icon="edit" handleClick={() => handleEdit(data)} />
                <Button role="icon" icon="cancel" handleClick={() => handleDelete(data)} />
            </div>
        </li>
    );
}

export default DataItem;
