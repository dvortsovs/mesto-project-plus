import { celebrate, Joi } from 'celebrate';

const emailRegexp = /\w+@\w+\.\w+/;
const linkRegexp = /https?:\/\/(www\.)?\S{2,}\.(\S{2,})?/;

const registrationValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegexp),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(linkRegexp),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegexp),
    password: Joi.string().required(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegexp),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkRegexp),
  }),
});

export {
  userIdValidation,
  updateUserValidation,
  cardIdValidation,
  loginValidation,
  registrationValidation,
  updateAvatarValidation,
  createCardValidation,
  emailRegexp,
  linkRegexp,
};
