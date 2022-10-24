const router = require('express').Router();

const { Thought } = require('../../models');

router.post('/', async (req,res)=>{
  try{
    console.log('reactionParams',req.reactionParams);
    const thought = await Thought.findByIdAndUpdate(req.reactionParams.thoughtID,{
      $addToSet:{
        reactions:{
          reactionBody:req.body.reactionBody,
          username:req.body.username,
        }
      }
    },
    { runValidators: true, new: true });
    res.json(thought);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:reactionID', async (req,res) => {
  try{
    console.log('reactionID',req.params.reactionID);
    const thought = await Thought.findByIdAndUpdate(req.reactionParams.thoughtID,{
      $pull:{
        reactions:{
          reactionId:req.params.reactionID
        }
      }
    },{new:true});
    res.json(thought);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;