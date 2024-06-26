const { Thoughts, User } = require("../models");

module.exports = {
    // get all thoughts
    getAllThoughts(req, res) {
            Thoughts.find()
                .populate({ path: 'reactions', select: '-__v' })
                .select('-__v')
                .then(dbThoughtData => {
                    res.json(dbThoughtData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        // get thought by id
        getThoughtById({ params }, res) {
            Thoughts.findOne({ _id: params.id })
                .populate({ path: 'reactions', select: '-__v' })
                .select('-__v')
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({ message: 'No thought found with this id!' });
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        // create thought
        createThought({ body }, res) {
            Thoughts.create(body)
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                        { _id: body.userId },
                        { $push: { thoughts: _id } },
                        { new: true }
                    );
                })
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found with this id!' });
                        return;
                    }
                    res.json(dbUserData);
                })
                .catch(err => res.json(err));
        },
        // update thought by id
        updateThought({ params, body }, res) {
            Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({ message: 'No thought found with this id!' });
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.status(400).json(err));
        },
        // delete thought
        deleteThought({ params }, res) {
            Thoughts.findOneAndDelete({ _id: params.id })
                .then(deletedThought => {
                    if (!deletedThought) {
                        return res.status(404).json({ message: 'No thought with this id!' });
                    }
                    return User.findOneAndUpdate(
                        { _id: deletedThought.userId },
                        { $pull: { thoughts: params.id } },
                        { new: true }
                    );
                })
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found with this id!' });
                        return;
                    }
                    res.json(dbUserData);
                })
                .catch(err => res.json(err));
        },
        // add reaction
        addReaction({ params, body }, res) {
            Thoughts.findOneAndUpdate(
                { _id: params.thoughtId },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            )
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({ message: 'No thought found with this id!' });
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.json(err));
        },
        // remove reaction
        removeReaction({ params }, res) {
            Thoughts.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { reactionId: params.reactionId } } },
                { new: true }
            )
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({ message: 'No thought found with this id!' });
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.json(err));
        },
    };
    