const express = require('express');
const multer = require('multer');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
//const { Video } = require("../models/Video");

//=================================
//             video
//=================================
let storage = multer.diskStorage({
    destination:  (req, file, cb) =>{
      cb(null, "uploads/");
    },
    filename:  (req, file, cb)=> {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req,file, cb) =>{
        const ext = path.extname(file.originalname);
        if(ext != '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true);
    }
  });
  const upload = multer({ storage: storage}).single("file");

 
router.post("/uploadfiles", (req, res) => {
    upload(req,res, err =>{
        if(err){
            return res.json({success : false, err});
        }
        return res.json({ success : true, url : res.req.file.path, fileName : res.req.file.fieldname})
    })
});


router.post("/thumbnail", (req, res) => {

    let filePath = "";
    let fileDuration = "";

    ffmpeg.ffprobe(req.body.url, function (err, metadata){
        fileDuration = metadata.format.duration;
    });


    ffmpeg(req.body.url)
    .on('filenames', function (filename) {
        filePath = "uploads/thumbnail/" + filename[0];
    })
    .on('end', function () {
        return res.json({ success : true, url : filePath, fileDuration: fileDuration});

    })
    .on('error', function(err){
        return res.json({success: false , err});
    })
    .screenshot({
        count  :3,
        folder : 'uploads/thumbnail',
        size: '320x240',
        filename: 'thumbnail-%b.png'
    })


});

module.exports = router;
