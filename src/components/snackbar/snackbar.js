import React, {useState} from "react";
import './snackbar.css';
import Button from "../button/button";
import {ddmmmmyyyy, getFormattedDate} from "../../utils/datetime.utils";

const Snackbar = ({show, alert, handleAnimationEnd, handleUndo, data}) => {
    const [undoClicked, setUndoClicked] = useState(false);

    // Don't render snackbar until it is active
    if (!show) return null;

    const date = getFormattedDate(data.date, ddmmmmyyyy);

    const undo = () => {
        setUndoClicked(true);
        handleUndo(data);
    };

    const resetDataAfterAnimation = event => {
        setUndoClicked(false);
        handleAnimationEnd(event);
    }

    const snackContent = () => {
        return undoClicked ? 'Removal undone' : `Running data for <b>${date}</b> removed`
    }

    const showUndoClass = () => {
        let toReturn = '';

        if (show) {
            toReturn = 'show';
        }

        if (show && undoClicked) {
            toReturn = 'undo';
        }

        return toReturn;
    }

    showUndoClass();

    return (
        <div
            className={`snackbar snackbar-${alert} ${showUndoClass()}`}
            onAnimationEnd={resetDataAfterAnimation}
        >
            <div dangerouslySetInnerHTML={{__html: snackContent()}} />
            {handleUndo && !undoClicked
                ? <Button role="snack" btnStyle="toast" handleClick={() => undo()}>Undo</Button>
                : ''}
        </div>
    );
}

export default Snackbar;
