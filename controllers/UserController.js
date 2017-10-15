const UserModel = require('../models/UserModel');

exports.profile = async (req, res) => {
    console.log(req.session);
    console.log(req.query);
  if(!req.session.user) res.status(500).send({error: 'Unauthorized'});
  if(!req.query.userId) res.status(422).send({error: 'Request must include a user ID'});

  const userId = req.query.userId;

  try {
      const user = await UserModel.findById(userId);
      console.log(user);
      res.status(200).send({user});
  } catch(err) {
      res.status(500).send({error: 'Bad request'});
  }
};