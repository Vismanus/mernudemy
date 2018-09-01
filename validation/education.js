const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateExperienceInput(data) {
  const errors = {}

  /* eslint-disable no-param-reassign */
  data.school = !isEmpty(data.school) ? data.school : ''
  data.degree = !isEmpty(data.degree) ? data.degree : ''
  data.from = !isEmpty(data.from) ? data.from : ''
  data.to = !isEmpty(data.to) ? data.to : ''
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ''

  /* eslint-enable no-param-reassign */

  if (validator.isEmpty(data.school)) {
    errors.school = 'School field is required'
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required'
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study field is required'
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
