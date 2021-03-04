const express = require('express');
const multer = require('multer');
const router = express.Router();
var ffmpeg = require('fluent-ffmpeg');

const { Video } = require("../models/Video");

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
            console.log(err);
            return res.json({success : false, err});
        }
        return res.json({ success : true, url : res.req.file.path, fileName : res.req.file.fieldname})
    })
});

router.post("/uploadVideo", (req, res) => {

    const video = new Video(req.body);
    video.save((err,video)=>{
        if(err){
            return res.json( {success : false, err});
        }
        else{
            res.status(200).json({ success : true});
        }
    });
});

router.get("/getVideos", (req, res) => {

  Video.find()
      .populate('writer')
      .exec((err, videos)=> {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success : true, videos});
      })
});

router.post("/thumbnail", (req, res) => {
    //썸네일 생성 하고 비디오 러닝타임도 가져오는 api
  
    let fileDuration = "";
    let filePath = "";
    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
      //url을 받으면 해당 비디오에대한 정보가 metadata에담김
      console.log(metadata); //metadata안에담기는 모든정보들 체킹
      fileDuration = metadata.format.duration; //동영상길이대입
    });
    //썸네일 생성
    ffmpeg(req.body.url) //클라이언트에서보낸 비디오저장경로
      .on("filenames", function (filenames) {
        //해당 url에있는 동영상을 밑에 스크린샷옵션을 기반으로
        //캡처한후 filenames라는 이름에 파일이름들을 저장
        console.log("will generate " + filenames.join(","));
        console.log("filenames:", filenames);
  
        filePath = "uploads/thumbnails/" + filenames[0];
      })
      .on("end", function () {
        console.log("Screenshots taken");
        return res.json({
          success: true,
          url: filePath,
          fileDuration: fileDuration,
        });
        //fileDuration :비디오 러닝타임
      })
      .on("error", function (err) {
        console.log(err);
        return res.json({ success: false, err });
      })
      .screenshots({
        //Will take screenshots at 20% 40% 60% and 80% of the video
        count: 3,
        folder: "uploads/thumbnails",
        size: "320x240",
        //'%b':input basename(filename w/o extension) = 확장자제외파일명
        filename: "thumbnail-%b.png",
      });
  });
module.exports = router;
