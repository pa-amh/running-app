import React, {useEffect, useState} from "react";
import DataItem from "./data-item/data-item";

const Test = ({dbData}) => {
    const listData = () => {
        while (!dbData) {
            return <h1>Loading...</h1>
        }

        const toReturn = dbData.map(data =>
            <DataItem key={data.id} data={data} />
        );
        return <ul className={`data-list`}>{toReturn}</ul>
    }
    return (
        <div>
            {listData()}
        </div>
    );

}

export default Test;
