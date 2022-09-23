const {Schema, model, Types} = require('mongoose')
const moment = require('moment')
const { Thought } = require('.')

const reactionSchema = new Schema({
    reactionId: {
        type:Schema.Types.ObjectId,
        default:() => new Types.ObjectId(),
    },
    reactionBody:{
        type:String,
        required: true,
        maxlength:280
    },
    username:{
        type:String,
        required:true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },

    },
    {
        toJSON:{
            virtuals:true,
            getters:true
        },
        id:false
    }
)

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length
})
const Thought =model('Thought', ThoughtSchema)

module.exports = Thought;