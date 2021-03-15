const express = require('express');
const router = express.Router();


const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             like,dislike
//=================================





router.post("/getLikes", (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = {videoId  :req.body.videoId}
    }
    else {
        variable = {commentId : req.body.commentId}
    }
    Like.find(variable)

        .exec((err, likes) => {
            if(err) return  res.status(400).send(err)
            console.log(likes);
            res.status(200).json({ success : true, likes })
        })
});

router.post("/uplike", (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = {videoId  :req.body.videoId, userId : req.body.userId}
    }
    else {
        variable = {commentId : req.body.commentId, userId : req.body.userId}
    }
    const like = new Like(variable);

    like.save((err, likeResult) => {
        if(err) return res.json({success : false, err });

        Dislike.findOneAndDelete(variable)
        .exec((err , dislikeresult) => {
            if(err) return res.status(400).json({success : false , err});
            res.status(200).json({ success : true})
        })
    })
});
router.post("/unlike", (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = {videoId  :req.body.videoId, userId : req.body.userId}
    }
    else {
        variable = {commentId : req.body.commentId, userId : req.body.userId}
    }

    Like.findOneAndDelete(variable)
    .exec((err, result)=> {
        if(err) return res.status(400).json({success : false , err});
        res.status(200).json({ success : true})
    })
});


router.post("/getDislikes", (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = {videoId  :req.body.videoId}
    }
    else {
        variable = {commentId : req.body.commentId}
    }
    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return  res.status(400).send(err)
            res.status(200).json({ success : true, dislikes })
        })
});

router.post("/upDislike", (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = {videoId  :req.body.videoId, userId : req.body.userId}
    }
    else {
        variable = {commentId : req.body.commentId, userId : req.body.userId}
    }
    const dislike = new Dislike(variable);

    dislike.save((err, dislikeResult) => {
        if(err) return res.json({success : false, err });

        Like.findOneAndDelete(variable)
        .exec((err , likeresult) => {
            if(err) return res.status(400).json({success : false , err});
            res.status(200).json({ success : true})
        })
    })
});
router.post("/unDislike", (req, res) => {
    let variable = {}
    if(req.body.videoId) {
        variable = {videoId  :req.body.videoId, userId : req.body.userId}
    }
    else {
        variable = {commentId : req.body.commentId, userId : req.body.userId}
    }

    Dislike.findOneAndDelete(variable)
    .exec((err, result)=> {
        if(err) return res.status(400).json({success : false , err});
        res.status(200).json({ success : true})
    })
});

module.exports = router;