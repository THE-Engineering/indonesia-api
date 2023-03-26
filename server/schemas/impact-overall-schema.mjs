/**
 * @module #server/schemas/impact-overall-schema
 */

import Joi from 'joi'

import {
  SCHEMA_INSTITUTION_ID as INSTITUTION_ID,
  SCHEMA_MIN_YEAR as MIN_YEAR,
  SCHEMA_MAX_YEAR as MAX_YEAR
} from '#config/schema'

export default Joi.object().keys({
  institution_id: (
    Joi.string()
      .regex(INSTITUTION_ID)
  ),
  year: (
    Joi.number()
      .integer()
      .min(MIN_YEAR)
      .max(MAX_YEAR)
      .strict(false) // permit strings
  )
})
