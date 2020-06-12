import {calcData} from "./data.utils";

export const ddmmmmyyyy = {
    year: "numeric",
    month: "short",
    day: "2-digit"
};

/**
 * Format date
 *
 * @param date - date to be formatted
 * @param options - options for formatting
 * @returns {string}
 */
export const getFormattedDate = (date, options) => {
    if (!options) throw Error('No options');
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
}

/**
 * Convert integer amount of minutes into hours and mins
 *
 * @returns {string} converted time in format `hh hours mm mins`
 */
export const integerToHhMm = data => {
    const time = calcData(data, 'time');
    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    return `${hours}hrs ${minutes}mins`;
};

/**
 * Determine if time requires a '0' prefix
 *
 * @param time
 * @returns {string} either '0' or ''
 */
export const timePrefix = time => {
    return time < 10 ? '0' : '';
};

/**
 * Convert a decimal time (in mins) into minutes and seconds
 *
 * @returns {string} converted time in format `mm mins ss secs`
 */
export const decimalToMmSs = data => {
    const time = calcData(data,'average');
    const min = Math.floor(time);
    const sec = Math.floor((time * 60) % 60);

    return `${min}mins ${timePrefix(sec)}${sec}secs`;
}
