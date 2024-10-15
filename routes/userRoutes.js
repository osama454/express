// Example: ./routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { createUserSchema, loginUserSchema } = require('../validation/userSchema'); // Import Joi schemas
const validate = require('../middleware/validationMiddleware');




router.post('/', validate(createUserSchema), registerUser);
router.post('/login', validate(loginUserSchema) , loginUser);
router.get('/me', protect, getMe);


module.exports = router;