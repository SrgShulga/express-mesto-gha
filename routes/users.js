const userRouter = require('express').Router();

const {
  getUserList, getUserId, getUserProfile, updateUserData, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUserList);
userRouter.get('/me', getUserProfile);
userRouter.get('/:userId', getUserId);
userRouter.patch('/me', updateUserData);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
