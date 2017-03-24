import Joi from 'joi';
import config from './config';

// Definition of QuestionnaireSchema for Joi
const questionsSchema = {
  title: Joi.string().required(),
  description: Joi.string(),
  inputType: Joi.string().required(),
  placeholder: Joi.string(),
  value: Joi.string()
};

const groupsSchema = {
  title: Joi.string().required(),
  description: Joi.string().required(),
  questions: Joi.array().items(questionsSchema)
};

const questionnaireSchema = {
  description: Joi.string(),
  groups: Joi.array().items(groupsSchema)
};

// Definition of CondensedEntitySchema for Joi
const condensedEntitySchema = {
  name: Joi.string().required(),
  shortname: Joi.string(),
  type: Joi.string().required(),
  country: Joi.string().length(2).required()
};

export default {
  // POST /api/users
  createUser: {
    body: {
      eMail: Joi.string().regex(config.eMailRegExp).required(),
      password: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      roles: Joi.array().items(Joi.string())
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      eMail: Joi.string().regex(config.eMailRegExp).required(),
      password: Joi.string().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      roles: Joi.array().items(Joi.string())
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      eMail: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/entities
  createEntity: {
    body: {
      name: Joi.string().required(),
      shortname: Joi.string(),
      type: Joi.string().required(),
      country: Joi.string().regex(/^[A-Z]{2}$/).required(),
      questionnaire: Joi.object().keys(questionnaireSchema).required()
    }
  },

  // UPDATE /api/entities/:entityId
  updateEntity: {
    body: {
      name: Joi.string().required(),
      shortname: Joi.string(),
      type: Joi.string().required(),
      country: Joi.string().regex(/^[A-Z]{2}$/).required(),
      questionnaire: Joi.object().keys(questionnaireSchema).required()
    },
    params: {
      entityId: Joi.string().hex().required()
    }
  },

  // POST /api/transactions
  createTransaction: {
    body: {
      name: Joi.string().required(),
      type: Joi.string().required(),
      begin: Joi.date(),
      end: Joi.date(),
      entities: Joi.array().items(condensedEntitySchema),
      questionnaire: Joi.object().keys(questionnaireSchema).required()
    }
  },

  // UPDATE /api/transactions/:transactionId
  updateTransaction: {
    body: {
      name: Joi.string().required(),
      type: Joi.string().required(),
      begin: Joi.date(),
      end: Joi.date(),
      entities: Joi.array().items(condensedEntitySchema),
      questionnaire: Joi.object().keys(questionnaireSchema).required()
    },
    params: {
      transactionId: Joi.string().hex().required()
    }
  },

  // POST /api/uploads
  createUpload: {
    body: {
      belongsToId: Joi.string().hex().required(),
      files: Joi.any()
    }
  },

  // GET /api/transactions/:transactionId/attachments
  // GET /api/entities/:entityId/attachments
  listUpload: {
    params: {
      belongsToId: Joi.string().hex().required()
    }
  }

};
