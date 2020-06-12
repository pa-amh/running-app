import './modal.css';
import React, {useState, useEffect} from 'react';
import Divider from '../divider/divider';
import Button from "../button/button";

const Modal = ({handleClose, handleAdd, mainData, editData}) => {

    // Date as string in format yyyy-mm-dd
    const today = new Date().toISOString().substr(0, 10);
    const initialFormState = {id: null, date: today, distance: 5.23, time: true};
    const initialErrorState = {
        date: {
            error: false,
            errorMsg: 'Enter a date of format dd/mm/yyyy'
        },
        distance: {
            error: false,
            errorMsg: 'Enter a distance in kilometers'
        },
        time: {
            error: false,
            errorMsg: 'Enter a time in minutes'
        }
    };

    // Set initial states (functional over traditional classes)
    const [formData, setFormData] = useState(initialFormState);
    const [formError, setFormError] = useState(initialErrorState);

    useEffect(() => {
        if (editData) setFormData(editData);
    }, [editData]);

    /**
     * Submit data from form on submit button click
     * @param event
     */
    const submitData = event => {
        event.preventDefault();

        const {distance, time, date} = formError;
        if (distance.error || time.error || date.error) return;

        handleAdd(formData);
        resetForm();
        handleClose();
    }

    /**
     * Validate form input fields
     *
     * @param name - Name of input
     * @param value - Value of input
     */
    const validateForm = (name, value) => {
        let obj = JSON.parse(JSON.stringify(formError));

        if (editData && (name === 'date') && (value === editData.date)) return;

        obj[name].error = (value === '') || !isValidDate(value);
        if (name === 'date') {
            obj[name].errorMsg = isValidDate(value)
                ? 'Enter a date of format dd/mm/yyyy' : 'Date is already in use, please pick another';
        }
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
        validateForm(name, value);
        setFormData({...formData, [name]: (name !== 'date') ? parseFloat(value) : value});
    }

    /**
     * Check whether date passed in is currently within data array
     *
     * @param checkDate - Date to check
     * @returns {boolean}
     */
    const isValidDate = checkDate => {
        let valid = true;

        mainData.forEach(item => {
            if (item.date === checkDate) valid = false;
        });

        return valid;
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
                                <input
                                    id="date" type="date" name="date" value={formData.date}
                                    onChange={handleChange} required placeholder="Date"
                                    className={formError.date.error ? 'input-error error' : 'normal'} />
                            </span>
                            {formError.date.error
                                ? <span className={`error`}>{formError.date.errorMsg}</span> : null}
                        </p>
                        <p>
                            <span className={`input-row`}>
                                <label>Distance:</label>
                                <input
                                    type="number" step="0.01" name="distance" min="0.01"
                                    value={formData.distance} onChange={handleChange}
                                    required autoComplete="off" placeholder="Distance (km)"
                                    className={formError.distance.error ? 'input-error error' : 'normal'} />
                                <span className={`input-units`}>Km</span>
                            </span>
                            {formError.distance.error
                                ? <span className={`error`}>{formError.distance.errorMsg}</span> : null}
                        </p>
                        <p>
                            <span className={`input-row`}>
                                <label>Time:</label>
                                <input
                                    type="number" name="time" min="1"
                                    onChange={handleChange}
                                    value={formData.time}
                                    autoFocus required placeholder="Time"
                                    className={formError.time.error ? 'input-error error' : ''} />
                                <span className={`input-units`}>mins</span>
                            </span>
                            {formError.time.error
                                ? <span className={`error`}>{formError.time.errorMsg}</span> : null}
                        </p>
                        <Divider />
                        <div className={`footer`}>
                            <Button numBtns="2" handleClick={resetAndCloseModal}>Cancel</Button>
                            <Button numBtns="2" role="submit">Add</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Modal;

