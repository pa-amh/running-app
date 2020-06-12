import './data-item.css';
import React from "react";
import Button from "../button/button";
import {ddmmmmyyyy, getFormattedDate} from "../../utils/datetime.utils";

const DataItem = ({handleDelete, handleEdit, data}) => {
    return (
        <li className={`data-list-entry`}>
            <div className="data-list-entry-data">
                {getFormattedDate(data.date, ddmmmmyyyy)} - {data.distance}km - {data.time}mins
            </div>
            <div className="data-list-entry-buttons">
                <Button role="icon" icon="cancel" handleClick={() => handleDelete(data)} />
                <Button role="icon" icon="edit" handleClick={() => handleEdit(data)} />
            </div>
        </li>
    );
}

export default DataItem;
