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
export const integerToHhMmSs = data => {
    if (data) {
        const totalSecs = calcData(data, 'time');

        let hours   = Math.floor(totalSecs / 3600);
        let minutes = Math.floor((totalSecs - (hours * 3600)) / 60);
        let seconds = totalSecs - (hours * 3600) - (minutes * 60);

        return `${hours}hrs ${minutes}mins ${seconds}secs`;
    }
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
    if (data) {
        const totalSecs = calcData(data, 'average');
        const minutes = Math.floor(totalSecs / 60);
        const seconds = Math.round(totalSecs - (minutes * 60));

        return `${minutes}mins ${timePrefix(seconds)}${seconds}secs`;
    }
}
