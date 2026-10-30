

const Validate = (rules, value, type = 'generic') => {
    let valid = true;
    if (!rules) {
        return true;
    }
    if (rules.required) {
        // valid = value.length !== 0 && valid;
        // valid = (value !== undefined && value !== null) ? (value.trim() !== "" && valid) : false;
        valid = (value !== undefined && value !== null) ? (value.length !== 0 && valid) : false;
    }
    if (rules.max) {
        if (type === 'date')
            valid = new Date(value) <= new Date(rules.max) && valid;
        else 
            valid = value <= rules.max && valid;
    }
    if (rules.min) {
        if (type === 'date')
            valid = new Date(value) >= new Date(rules.min) && valid;
        else 
            valid = value >= rules.min && valid;
    }
    return valid;
}

export default Validate;