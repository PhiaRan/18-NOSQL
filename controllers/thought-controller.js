const { User, Thought} = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({}) 
        .populate({ path: 'reactions', select: '-__v',})
        .select('-__v')
        .sort({_id: -1})
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
    },

    getThoughtById({params}, res){
Thought.findOne({_id: params.id})
.populate({
    path: 'reactions',
    select: '-__v'
})

.select('-__v')
.then((dbThoughtData) => {
    if (!dbThoughtData){
        return res.status(404).json({message: 'No thought with current id'})
    }
    res.json(dbThoughtData)
})
.catch((err) => {
    console.log(err)
    res.sendStatus(400)
})
    },

    createThought({body}, res) {
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: body.userId},
                {$push: { thoughts:_id}},
                {new: true}
            )
        })

        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res
                .status(404) .json({ message:'No user found'});
            }
            res.json(dbThoughtData)

        })
        .catch(err => res.json(err))
    },

    updateThought({params, body}, res){
        Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators:true })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message:'No thought found'})
                return;
            }
            res.json(dbThoughtData)
        })
        .catch((err => res.json(err)))
    },

    deleteThought({ params}, res){
        Thought.findOneAndDelete({_id:params.id})
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({message:'No thoughts found'})
                return
            }
            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id } },
                { new: true }
              )

        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({message:'No user found'})
                return
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err));
    },

    addReaction({params,body}, res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtID},
            {$addToSet: {reactions:body}},
            {new: true, runValidators:true}
        )
        .then((dbThoughtData) =>{
            if (!dbThoughtData){
                res.status(404).json({message: ' No thought found'})
                return;
            }
            res.json(dbThoughtData)
        })
        .catch((err) => res.json(err))
    },

deleteReaction({params},res){
    Thought.findOneAndUpdate(
        {_id: params.thoughtID},
        {$pull: {reactions: {reactionId: params.reactionId}}},
        {new:true}
    )
    then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
}
};

module.exports = thoughtController