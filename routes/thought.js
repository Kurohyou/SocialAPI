// Routes for /api/thoughts/
const router = require('express').Router();

const { User, Thought } = require('../models');
const reactionRoutes = require('./subRoutes/reaction');

router.use('/:thoughtID/reactions',(req,res,next) => {
  req.reactionParams = req.params;
  next();
});
router.use('/:thoughtID/reactions',reactionRoutes);

router.get('/:thoughtID/', async (req,res) => {
  try{
    const thought = await Thought.findById(req.params.thoughtID)
    .populate('reactions');
    res.json(thought);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/', async (req,res) => {
  try{
    const thoughts = await Thought.find({});
    res.json(thoughts);
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
    const thought = await Thought.create({
      username:req.body.username,
      thoughtText: req.body.thoughtText
    });
    const user = await User.findOneAndUpdate({username:req.body.username},{$addToSet:{thoughts:thought._id}});
    res.json(thought);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.put('/:thoughtID', async (req,res) => {
  try{
    const updateObj = {};
    if(req.body.thoughtText){
      updateObj.thoughtText = req.body.thoughtText;
    }
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtID,updateObj,{new:true});
    res.json(thought);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:thoughtID', async (req,res) => {
  try{
    console.log('req.params.thoughtID',req.params.thoughtID);
    const thought = await Thought.findByIdAndDelete(req.params.thoughtID);
    const user = await User.findOneAndUpdate({username:thought.username},{$pull:{thoughts:req.params.thoughtID}},{new:true})
    res.json(thought);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;