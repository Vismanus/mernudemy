const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateExperienceInput(data) {
  const errors = {}

  /* eslint-disable no-param-reassign */
  data.title = !isEmpty(data.title) ? data.title : ''
  data.company = !isEmpty(data.company) ? data.company : ''
  data.from = !isEmpty(data.from) ? data.from : ''
  data.to = !isEmpty(data.to) ? data.to : ''
  /* eslint-enable no-param-reassign */

  if (validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required'
  }
  if (validator.isEmpty(data.company)) {
    errors.company = 'Company field is required'
  }
  if (!validator.isISO8601(data.from)) {
    if (validator.isEmpty(data.from)) {
      errors.from = 'From date field is required'
    } else {
      errors.from = 'Please format to YYYY-MM-DD'
    }
  }
  if (!validator.isEmpty(data.to)) {
    if (!validator.isISO8601(data.to)) {
      errors.to = 'Please format to YYYY-MM-DD'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
