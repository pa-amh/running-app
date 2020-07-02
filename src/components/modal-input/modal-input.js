import './modal-input.css';
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ModalInput = ({name, data, error, handleChange}) => {
    let timeErrors = '';

    /**
     * Return error string for time, listing time components wrong.
     * @returns {string}
     */
    const listTimeErrors = () => {
        const timeProps = ['hours', 'minutes', 'seconds'].filter(prop => error[prop].error);
        const finalName = timeProps.pop();
        const list = timeProps.length
            ? timeProps.join(', ') + ' & ' + finalName
            : finalName;
        return `Enter valid time ${timeProps.length ? 'properties' : 'property'}: ${list}`;
    }

    /**
     * Return object of properties
     *
     * @returns {{autoComplete: *, onChange: *, max: *, className: *, units: *, type: *, required: *, min: *, name: *, step: *, placeholder: *, lastInput: *, value: *}}
     */
    const buildObj = (type, name, min, max, step, onChange, value, required, autoComplete, placeholder, units, className, lastInput) => {
        return {type, name, min, max, step, onChange, value, required, autoComplete, placeholder, units, className, lastInput};
    }

    /**
     * Generate input and span
     *
     * @param input
     * @returns {*}
     */
    const generateInput = input => {
        const {type, name, min, max, step, onChange, value, required, autoComplete, placeholder, units, className, lastInput} = input;
        return (
            <div className="modal-input-row">
                <input type={type} name={name} min={min} max={max} step={step} onChange={onChange} value={value} required={required}
                      autoComplete={autoComplete} placeholder={placeholder} className={`modal-input-row-input ${className}`} />
                {name !== 'date' ? <span className={`modal-input-units ${lastInput ? 'last-input' : ''}`}>{units}</span> : ''}
            </div>
        )
    };

    /**
     * Input properties
     *
     * @type {{date: {inputs: [{autoComplete: *, onChange: *, max: *, className: *, units: *, type: *, required: *, min: *, name: *, step: *, placeholder: *, lastInput: *, value: *}], icon: string, label: string, errorMsg: (string|*)}, distance: {inputs: [{autoComplete: *, onChange: *, max: *, className: *, units: *, type: *, required: *, min: *, name: *, step: *, placeholder: *, lastInput: *, value: *}], icon: string, label: string, errorMsg: (string|*)}, time: {inputs: [{autoComplete: *, onChange: *, max: *, className: *, units: *, type: *, required: *, min: *, name: *, step: *, placeholder: *, lastInput: *, value: *}, {autoComplete: *, onChange: *, max: *, className: *, units: *, type: *, required: *, min: *, name: *, step: *, placeholder: *, lastInput: *, value: *}, {autoComplete: *, onChange: *, max: *, className: *, units: *, type: *, required: *, min: *, name: *, step: *, placeholder: *, lastInput: *, value: *}], icon: string, label: string, errorMsg: string}}}
     */
    const input = {
        time: {
            label: 'time',
            icon: 'stopwatch',
            errorMsg: timeErrors,
            inputs: [
                buildObj('number', 'hours', '0', null, null, handleChange, data.hours, true, 'off', 'hrs', 'hrs', error.hours.error ? 'input-error error' : '', false),
                buildObj('number', 'minutes', '0', '59', null, handleChange, data.minutes, true, 'off', 'mins', 'mins', error.minutes.error ? 'input-error error' : '', false),
                buildObj('number', 'seconds', '0', '59', null, handleChange, data.seconds, true, 'off', 'secs', 'secs', error.seconds.error ? 'input-error error' : '', true)
            ]
        },
        date: {
            label: 'date',
            icon: 'calendar-day',
            errorMsg: error.date.errorMsg,
            inputs: [buildObj('date', 'date', null, null, null, handleChange, data.date, true, 'off', 'date', null,  error.date.error ? 'input-error error' : 'normal', true)]
        },
        distance: {
            label: 'date',
            icon: 'running',
            errorMsg: error.distance.errorMsg,
            inputs: [buildObj('number', 'distance', '0.01', null, '0.01', handleChange, data.distance, true, 'off', 'distance', 'Km',  error.distance.error ? 'input-error error' : 'normal', true)]
        }
    };

    /**
     * Generate input components
     * @param name
     * @returns {*[]}
     */
    const formInputs = name => {
        return input[name].inputs.map(item => generateInput(item));
    }

    /**
     * Determine if input has error
     * @param name
     * @returns {boolean|*}
     */
    const hasError = name => {
        if (name === 'time') return (error.hours.error || error.minutes.error || error.seconds.error);

        return error[name].error;
    }

    /**
     * Get error message for input
     *
     * @param name
     * @returns {string|*}
     */
    const getErrorMsg = name => {
        console.log(`getErrorMsg: ${name}`);
        if (name === 'time') return listTimeErrors();

        return input[name].errorMsg
    }

    return (
        <p>
            <span className="modal-input-group">
                <label>{name}</label>
                <FontAwesomeIcon className="modal-icon" icon={['fa', input[name].icon]} />
                <div className="modal-input-row">
                    {formInputs(name)}
                </div>
            </span>
            {hasError(name) ? <span className="error errorMsg">{getErrorMsg(name)}</span> : null}
        </p>
    );
};

export default ModalInput;
