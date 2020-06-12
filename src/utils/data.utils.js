/**
 * Calculate average or total values
 *
 * @param data - Full data
 * @param type - average, time, distance
 * @param decimalPlaces - Number of decimal places to round to
 * @returns {number}
 */
export const calcData = (data, type, decimalPlaces) => {
    let value = 0;

    if (type === 'average') {
        value = (calcData(data, 'time') / calcData(data, 'distance'));
    } else {
        data.forEach(data => {
            value += data[type];
        });
    }

    return decimalPlaces ? value.toFixed(decimalPlaces) : value;
}

/**
 * Sort data in ascending/descending order by date
 *
 * @input sort - sort direction
 */
export const sortData = (data, sort = 'descending') => {
    data.sort((a, b) => {
        switch(sort) {
            case 'ascending':
                return new Date(a.date) - new Date(b.date)
            default:
            case 'descending':
                return new Date(b.date) - new Date(a.date)
        }
    });
}
