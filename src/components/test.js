import React, {useState} from "react";

const Test = () => {
    const PORT = process.env.PORT || 8080;
    const BASE_PATH = `http://localhost:${PORT}`

    const [data, setData] = useState([]);

    // const getData = () => {
        fetch(`${BASE_PATH}/data`)
            .then(res => {
                console.log(res);
                res.json();
            })
            .then(items => {
                console.log(items);
                setData(items);
            })
            .catch(err => console.error(err));
    // }

    return(
        <div>
            <div>Get data</div>
            <div>{data}</div>
        </div>
    )
}

export default Test;
