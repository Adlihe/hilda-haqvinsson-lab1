export function validateNumber(value, name) {
  const number = Number(value)

  if (!Number.isInteger(number)) {
    return `${name} must be an integer`
  }

  return null
}

export function validatePositiveNumber(value, name) {
  const number = Number(value)

  if (number <= 0) {
    return `${name} must be greater than 0`
  }

  return null
}

export function validateInput(value, name) {
  if (!value) {
    return `${name} is required`
  }

  return null
}