import mongoose from 'mongoose';

/**
 * Questions Schema
 */
const QuestionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  inputType: {
    type: String,
    required: true,
    enum: ['text', 'memo']
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
  value: {
    type: String,
    required: false,
    default: ''
  },
}, {
  _id: false,
  id: false
});


/**
 * Groups Schema
 */
const GroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [QuestionsSchema]
}, {
  _id: false,
  id: false
});


/**
 * Questionnaire Schema
 */
const QuestionnaireSchema = new mongoose.Schema({
  description: {
    type: String,
    required: false
  },
  groups: [GroupSchema]
}, {
  _id: false,
  id: false
});

export default QuestionnaireSchema;
