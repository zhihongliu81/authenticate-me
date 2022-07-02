const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Get the Current User
router.get('/current',restoreUser, requireAuth, (req, res) => {
  res.json(req.user);
});

//Login a User
const validateLogin = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage(JSON.stringify({"email":"Email is required"})),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage(JSON.stringify({"password":"Password is required"})),
  handleValidationErrors
];

router.post('/login', validateLogin, async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.login({ email, password });

  if (user) {
    const token = await setTokenCookie(res, user);

      return res.json({
        "id": user.id,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
         token});
  } else {
    res.statusCode = 401;
    res.json({
      "message": "Invalid credentials",
      "statusCode": 401
    });
  }
});

//Logout :

router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);



// Sign up : POST /api/users
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage(JSON.stringify({"email":"Invalid email"})),
  check('firstName')
    .exists({ checkFalsy: true })
    // .isLength({ min: 4 })
    .withMessage(JSON.stringify({"firstName":"First Name is required"})),
    check('lastName')
    .exists({ checkFalsy: true })
    .withMessage(JSON.stringify({"LastName":"Last Name is required"})),
  // check('username')
  //   .not()
  //   .isEmail()
  //   .withMessage('Username cannot be an email.'),
  // check('password')
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 })
  //   .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post(
    '/signup',
    validateSignup,
    async (req, res) => {
      const { email, password, firstName, lastName } = req.body;
      console.log(typeof email);
      let user = await User.findOne({where:{email: email}});
      console.log(user);

      if (user) {
        return res.json({
          "message": "User already exists",
          "statusCode": 403,
          "errors": {
            "email": "User with that email already exists"
          }
        })
      } else {
        user = await User.signup({ email, firstName, lastName, password });
        const { id } = user;

       const token = await setTokenCookie(res, user);

        return res.json({
          id,
          firstName,
          lastName,
          email,
          token
        });
      }

    }
  );




module.exports = router;
