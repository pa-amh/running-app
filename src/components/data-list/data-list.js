import './data-list.css';
import {sortData} from "../../utils/data.utils";
import DataRow from "../data-row/data-row";
import React from "react";

const DataList = ({data, handleEdit, handleDelete}) => {
    /**
     * Break down json data and return separate items
     */
    const getData = () => {
        while (!data) {
            return <h1>Loading...</h1>
        }

        sortData(data);

        const items = data.map(data =>
            <DataRow key={data.id} handleEdit={handleEdit}
                     handleDelete={handleDelete} data={data} />
        );
        return <ul className={`data-list`}>{items}</ul>
    };

    return (
        <div>
            {getData()}
        </div>
    );
}

export default DataList;
