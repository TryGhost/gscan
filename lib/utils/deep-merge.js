function isPlainObject(value) {
    if (value === null || typeof value !== 'object') {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function deepMerge(target, ...sources) {
    const output = isPlainObject(target) ? target : {};

    sources.forEach((source) => {
        Object.entries(source || {}).forEach(([key, sourceValue]) => {
            const existingValue = output[key];

            if (isPlainObject(sourceValue)) {
                output[key] = deepMerge(isPlainObject(existingValue) ? existingValue : {}, sourceValue);
            } else {
                output[key] = sourceValue;
            }
        });
    });

    return output;
}

module.exports = deepMerge;
