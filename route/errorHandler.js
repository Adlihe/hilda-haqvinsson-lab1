    
    
    export function validateInput (value, paramName) {
        if (value === undefined) {
        return `${paramName} is required`
        }
        return null
    } 

    export function validateNumber (value, paramName) {
        const number = Number(value)
        if (!Number.isFinite(number) || !Number.isInteger(number)){
            return `${paramName} must be an integer`
        }
        return null
    }

    export function validatePositiveNumber (value, paramName) {
          if (value < 0) {
        return `${paramName} must be more than 0`
        } 
        return null
    }