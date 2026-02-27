export const  validators = {
    required: (value) =>
        value === undefined || value === null || value === "" ? "Required!" : "",

    name: (value) =>
        validators.required(value) || validators.minLen(2)(value) || validators.trim(value),

    dob: (value) =>
        value && new Date(value) < new Date() ? "" : "Date cannot be in the future!",

    email: (value) => 
        validators.minLen(6)(value) || (/\S+@\S+\.\S+/.test(value) ? "" : "Invalid email!"),

    countryCode: (value) => (/\p{Regional_Indicator}{2}\s?\+\d{1,4}/u.test(value) ? "" : "Must be in the format +123!"),

    maxLen: (len) => (value) =>
        value && value.length <= len ? "" : `Must be at most ${len} characters!`,

    minLen: (len) => (value) =>
        value && value.length >= len ? "" : `Must be at least ${len} characters!`,

    trim: (value) =>
        value && value.trim() === value ? "" : "Must not have leading or trailing spaces",

    street: (value) =>
        validators.required(value) || validators.minLen(3)(value) || validators.trim(value),

    phone: (value) =>
        validators.required(value) || validators.minLen(7)(value) || validators.maxLen(15)(value) || validators.trim(value),

    membershipNumber: (value) =>
        validators.required(value) || validators.minLen(14)(value) || validators.maxLen(20)(value) || validators.trim(value),

    string: (value) =>
        validators.minLen(2)(value) || validators.trim(value),

    optionalString: (len) => (value) =>
        value === undefined || value === null || value === "" ? "" : validators.minLen(len)(value)
};