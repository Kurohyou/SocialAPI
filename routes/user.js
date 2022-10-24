// routes for /api/users/
const router = require('express').Router();

const { User, Thought } = require('../models');
const friendRoutes = require('./subRoutes/friend');
const removeFriends = require('./utils/removeFriends');

router.use('/:userID/friends',(req,res,next) => {
  req.userParams = req.params;
  next();
});

router.use('/:userID/friends',friendRoutes);

router.get('/:userID', async (req,res) => {
  try{
    const user = await User.findById(req.params.userID)
    .populate('thoughts')
    .populate('friends');
    res.json(user);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/', async (req,res) => {
  try{
    const users = await User.find({});
    res.json(users);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

/**
 * Create a user
 * @param req - The request information
 * @param req.body.username - the user's username
 * @param req.body.email - The user's email
 */
router.post('/', async (req,res) => {
  try{
    const user = await User.create({
      username:req.body.username,
      email: req.body.email
    });
    res.json(user);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.put('/:userID', async (req,res) => {
  try{
    const updateObj = {};
    if(req.body.username){
      updateObj.username = req.body.username;
    }
    if(req.body.email){
      updateObj.email = req.body.email;
    }
    const user = await User.findByIdAndUpdate(req.params.userID,updateObj,{new:true});
    res.json(user);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:userID', async (req,res) => {
  try{
    const user = await User.findByIdAndDelete(req.params.userID);
    const [friends,thoughts] = await Promise.all(
      [
        removeFriends({userIDs:user.friends,notFriends:[req.params.userID]}),
        Thought.deleteMany({username:user.username})
    ]);
    const reactionRes = await Thought.updateMany({'reactions.username':user.username},{$pull:{reactions:{username:user.username}}});
    res.json(user);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;