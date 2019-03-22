var socket = require('socket.io');
var multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

var slistener = require('./index');
exports.videoUploader = async function(req,res){
    try{

        let fileName = '';
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './videos')
            },
            filename: function (req, file, cb) {
                let csvName = '___'+ Date.now() + file.originalname;
                fileName = csvName;
                cb(null, csvName)
            }
        })
        let upload = multer({
            storage: storage,
            fileFilter: function fileFilter(req, file, cb) {
                let extension = file.originalname.split('.')[1]
                //console.log('........', extension)
                if (extension) {
                    //console.log('........inside')
                    cb(null, true)
                } else {
                    cb(null, false)
                }
            }
        }).any('file');
        
        upload(req, res, function (err) {
            if (err) {
                console.log(err)
            }
            else if (req.files[0]) {
                res.json({
                    success: true,
                    fileName:fileName
                })
                let csvFileName = req.files[0].filename;
                
                let fName = [];
                ffmpeg('videos/'+csvFileName)
                    .on('filenames', function(filenames) {
                        // console.log('Will generate ' + filenames.join(', '));
                        fName = filenames;
                    })
                    .on('end', function() {
                        slistener.socketListener.emit('File generated',{fNames:fName,file:csvFileName});
                        console.log('Screenshots taken',fName);
                    })
                    .screenshots({
                        // Will take screens at 20%, 40%, 60% and 80% of the video
                        count: 4,
                        filename:'%b-at-%s-seconds.png',
                        folder: 'screenshots'
                    });
            }
    
            else {
                res.json({
                    success: false,
                    message: "Upload file please"
                })
            }
        })



    }
    catch(e){
       console.log(e);
    }
} 