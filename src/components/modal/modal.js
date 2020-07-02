import './modal.css';
import React, {useState, useEffect} from 'react';
import Divider from '../divider/divider';
import Button from "../button/button";
import ModalInput from "../modal-input/modal-input";

const Modal = ({handleClose, handleAdd, handleEdit, mainData, editData}) => {
    let obj;
    // Date as string in format yyyy-mm-dd
    const today = new Date().toISOString().substr(0, 10);
    const initialFormState = {id: null, date: today, distance: 5.23, hours: 0, minutes: '', seconds: 0};
    const initialErrorState = {
        date: {
            error: false,
            errorMsg: 'Enter a date of format dd/mm/yyyy'
        },
        distance: {
            error: false,
            errorMsg: 'Enter a valid distance'
        },
        hours: {
            error: false,
            errorMsg: 'Enter a valid number of hours'
        },
        minutes: {
            error: false,
            errorMsg: 'Enter a valid number of minutes'
        },
        seconds: {
            error: false,
            errorMsg: 'Enter a valid number of seconds'
        }
    };

    // Set initial states (functional over traditional classes)
    const [formData, setFormData] = useState(editData ? editData : initialFormState);
    const [formError, setFormError] = useState(initialErrorState);

    /**
     * Run on component mount
     */
    useEffect(() => {
        validateForm();

        const keyListener = e => {
            const listener = keyListenersMap.get(e.keyCode);
            return listener && listener(e);
        }
        document.addEventListener("keydown", keyListener);
        return () => document.removeEventListener("keydown", keyListener);
    }, [formData]);
    // TODO: Integrate full deps with useCallback and useRef usage

    const keyListenersMap = new Map([[27, handleClose]]);

    /**
     * Determine if form has any sort of error
     * @returns {boolean}
     */
    const formHasError = () => {
        const {distance, seconds, minutes, date} = formError;
        return (distance.error || minutes.error || date.error || seconds.error);
    }

    /**
     * Submit data from form on submit button click
     * @param event
     */
    const submitData = event => {
        event.preventDefault();

        if(formHasError()) return;

        editData ? handleEdit(formData) : handleAdd(formData);
        resetForm();
        handleClose();
    }

    /**
     * Validate full input form
     */
    const validateForm = () => {
        obj = JSON.parse(JSON.stringify(formError));
        const names = ['date', 'distance', 'hours', 'minutes', 'seconds'];
        names.forEach(name => validateInput(name));
    }

    /**
     * Validate form input fields
     *
     * @param name - Name of input
     */
    const validateInput = name => {
        let isDateMatch = false;
        const isEmpty = formData[name] === '';

        if (name === 'date') {
            isDateMatch = mainData.filter(item => {
                const dateMatch = (item.date === formData.date);
                const editDateMatch = editData && (item.date === editData.date);

                if (dateMatch) {
                    if (editDateMatch) {
                        return null;
                    }
                    return dateMatch
                }
                return null;
            })[0];

            obj.date.errorMsg = isDateMatch ? 'Date is already in use, please pick another' : 'Enter a date of format dd/mm/yyyy';
        }

        obj[name].error = isEmpty || !!isDateMatch;
        setFormError(obj);
    };

    /**
     * Handle change to form input field
     * Add event data to overall state data
     *
     * @param event
     */
    const handleChange = event => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: (name !== 'date') ? (parseFloat(value) || '') : value});
    }

    /**
     * Reset form back to initial state
     */
    const resetForm = () => {
        setFormData(initialFormState);
        setFormError(initialErrorState);
    }

    /**
     * Reset modal values to initial state when cancelling
     *
     * @param event - Click event
     */
    const resetAndCloseModal = (event = null) => {
        event.preventDefault();

        handleClose();
        resetForm();
    }

    return (
        <div className={`modal-container`}>
            <div className={`modal-overlay`} />
                <div className={`modal`}>
                    <div className={`modal-content`}>
                        <div className={`title`}>{editData ? 'Edit workout' : 'New workout'}</div>
                        <Divider />
                        <form onSubmit={submitData}>
                            <ModalInput name="date" error={formError} data={formData} handleChange={handleChange} />
                            <ModalInput name="distance" error={formError} data={formData} handleChange={handleChange} />
                            <ModalInput name="time" error={formError} data={formData} handleChange={handleChange} />
                            <Divider />
                            <div className={`footer`}>
                                <Button numBtns="2" handleClick={resetAndCloseModal}>Cancel</Button>
                                <Button isDisabled={formHasError()} numBtns="2" role="submit">{editData ? 'Update' : 'Add'}</Button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
};

export default Modal;

