import './data-row.css';
import React from "react";
import Button from "../button/button";
import {ddmmmmyyyy, getFormattedDate} from "../../utils/datetime.utils";
import DataItem from "../data-item/data-item";

const DataRow = ({handleDelete, handleEdit, data}) => {
    return (
        <li className={`data-list-entry`}>
            <div className="data-list-entry-data">
                <DataItem className="one" icon="calendar-day" data={getFormattedDate(data.date, ddmmmmyyyy)} />
                <DataItem className="one" icon="running" data={`${data.distance}km`} />
                <DataItem className="one" icon="stopwatch" data={`${data.minutes}mins ${data.seconds}secs`} />
            </div>
            <div className="data-list-entry-buttons">
                <Button role="icon" icon="pen" handleClick={() => handleEdit(data)} />
                <Button role="icon" icon="trash" handleClick={() => handleDelete(data)} />
            </div>
        </li>
    );
}

export default DataRow;
