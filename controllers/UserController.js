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

exports.delete = async (req, res) => {
    console.log(req.session);
    console.log(req.body);
    if(!req.session || !req.session.user || !req.session.user.isAdmin) {
        return res.status(400).send({message: 'Only an admin can perform this action'});
    }

    if(!req.body.userId) res.status(422).send({message: 'You must include a user ID'});
    const userId = req.body.userId;
    try {
        const deletedUser = await UserModel.findByIdAndRemove(userId);
        res.status(200).send({message: "User removed."});
    } catch(error) {
        console.warn(error);
    }
};

exports.promote = async (req, res) => {
    console.log(req.session);
    console.log(req.body);
    if(!req.session || !req.session.user || !req.session.user.isAdmin) {
        return res.status(400).send({message: 'Only an admin can perform this action'});
    }

    if(!req.body.userId) res.status(422).send({message: 'You must include a user ID'});
    const userId = req.body.userId;
    try {
        const promotedUser = await UserModel.findByIdAndUpdate(userId, {$set: {isAdmin: true}});
        res.status(200).send({message: "User promoted."});
    } catch(error) {
        console.warn(error);
    }
};