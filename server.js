//Install express server
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Server listening on port ', port);
});

// Heroku setup
// Serve only static files from dist directory
app.use(express.static(__dirname+'/dist/angular-real-estate'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname +'/dist/angular-real-estate/index.html'));
});


// const multer = require("multer");
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "src/assets/")
//     }
// });


app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            });
        }
        else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: No File Selected!'
                });
            }else{
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});






