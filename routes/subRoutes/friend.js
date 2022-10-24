const router = require('express').Router();
const { User } = require('../../models');
const removeFriends = require('../utils/removeFriends');

// add a friend
router.post('/:friendID/', async (req,res) => {
  try{
    const [user,friend] = await Promise.allSettled([
      User.findByIdAndUpdate(req.userParams.userID,{$addToSet:{friends:req.params.friendID}},{new:true}),
      User.findByIdAndUpdate(req.params.friendID,{$addToSet:{friends:req.userParams.userID}},{new:true})
    ]);
    res.json([user,friend]);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:friendID', async (req,res) => {
  try{
    const modified = await Promise.all([
      removeFriends({
        userIDs:[req.userParams.userID],
        notFriends:[req.params.friendID]
      }),
      removeFriends({
        userIDs:[req.params.friendID],
        notFriends:[req.userParams.userID]
      })
    ]);
    res.json(modified);
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
})

module.exports = router;