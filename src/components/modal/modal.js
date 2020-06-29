import './modal.css';
import React, {useState, useEffect} from 'react';
import Divider from '../divider/divider';
import Button from "../button/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
            errorMsg: 'Enter a distance in kilometers'
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
    useEffect(x => {
        validateForm();
    }, [formData]);

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
        const names = ['date', 'distance', 'minutes', 'seconds'];
        names.forEach(name => validateInput(name));

        console.log(formData);
        console.log(formError);
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
        console.log('handling change');
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
                        <p>
                            <span className={`input-row`}>
                                <label>Date:</label>
                                <FontAwesomeIcon className="modal-icon" icon={['fa', 'calendar-day']} />
                                <input
                                    id="date" type="date" name="date" value={formData.date}
                                    onChange={handleChange} required placeholder="date"
                                    className={formError.date.error ? 'input-error error' : 'normal'} />
                            </span>
                            {formError.date.error
                                ? <span className={`error errorMsg`}>{formError.date.errorMsg}</span> : null}
                        </p>
                        <p>
                            <span className={`input-row`}>
                                <label>Distance:</label>
                                <FontAwesomeIcon className="modal-icon" icon={['fa', 'running']} />
                                <input
                                    type="number" step="0.01" name="distance" min="0.01"
                                    value={formData.distance} onChange={handleChange}
                                    required autoComplete="off" placeholder="distance"
                                    className={formError.distance.error ? 'input-error error' : 'normal'} />
                                <span className={`input-units`}>Km</span>
                            </span>
                            {formError.distance.error
                                ? <span className={`error errorMsg`}>{formError.distance.errorMsg}</span> : null}
                        </p>
                        <p>
                            <span className="input-row">
                                <label>Minutes:</label>
                                <FontAwesomeIcon className="modal-icon" icon={['fa', 'stopwatch']} />
                                <input type="number" name="hours" min="0" onChange={handleChange} value={formData.hours}
                                    required placeholder="hrs" className={formError.hours.error ? 'input-error error' : ''} />
                                <span className="input-units full-pad">hrs</span>
                                <input type="number" name="minutes" min="1" onChange={handleChange} value={formData.minutes}
                                    autoFocus required placeholder="mins"
                                    className={formError.minutes.error ? 'input-error error' : ''} />
                                <span className="input-units">mins</span>
                                <input type="number" name="seconds" min="0" onChange={handleChange} value={formData.seconds}
                                    required placeholder="secs"
                                    className={formError.seconds.error ? 'input-error error' : ''}/>
                                <span className="input-units">secs</span>
                            </span>
                            {formError.minutes.error
                                ? <span className={`error errorMsg`}>{formError.minutes.errorMsg}</span> : null}
                            {formError.seconds.error
                                ? <span className={`error errorMsg`}>{formError.seconds.errorMsg}</span> : null}
                        </p>
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

