function oneLineTrim(strings, ...values) {
    const combined = strings.reduce((result, str, index) => {
        const value = index < values.length ? values[index] : '';
        return result + str + value;
    }, '');

    return combined.replace(/(?:\n\s*)/g, '').trim();
}

module.exports = oneLineTrim;
