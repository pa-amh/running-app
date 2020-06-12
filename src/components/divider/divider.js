import React from "react";
import './divider.css';

const Divider = ({height = 'small', colour = 'grey'}) => {
    return <div className={`divider height-${height} colour-${colour}`} />
}

export default Divider
