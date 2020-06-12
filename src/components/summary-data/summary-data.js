import './summary-data.css'
import React from "react";

const SummaryData = ({title, data}) => {
    return (
        <span className="summary-item">
            <span className="summary-title">{title}</span>
            <span className="summary-data">{data}</span>
        </span>
    );
};

export default SummaryData;
