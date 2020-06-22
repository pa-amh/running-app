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

    switch(type) {
        case 'average':
            const time = calcData(data, 'time');
            const distance = calcData(data, 'distance');
            const average = time / distance;

            value = decimalPlaces ? average.toFixed(decimalPlaces) : average;
            break;
        case 'time':
            data.forEach(item => {
                value += ((parseInt(item.minutes) * 60) + parseInt(item.seconds));
            });

            break;
        case 'distance':
            data.forEach(item => {
                value += parseFloat(item.distance);
            });

            break;
        default:
            throw Error('No type entered to calculate');
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
