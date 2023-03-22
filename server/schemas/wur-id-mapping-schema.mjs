import Joi from 'joi'

import {
  SCHEMA_INSTITUTION_ID as INSTITUTION_ID
} from '#config/schema'

export default Joi.object().keys({
  institution_id: (
    Joi.string()
      .regex(INSTITUTION_ID)
  )
})
