const { User } = require('../../models');

/**
 * Removes friends from user's friends array.
 * @param {object} params - The object containing the parameters
 * @param {ObjectIDs[]} userIDs - The ids of the users to update
 * @param {ObjectIDs[]} notFriends - The ids of users to remove from friend lists
 * @returns Array
 */
const removeFriends = ({userIDs,notFriends}) => 
  User
    .updateMany({
      _id:userIDs
    },
    {
      $pull:{
        friends:{
          $in:notFriends
        }
      }
    },
    {new:true});

module.exports = removeFriends;