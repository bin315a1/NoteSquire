const express = require('express')
//import {PythonShell} from 'python-shell';
let {PythonShell} = require('python-shell')
const app = express()

var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var fileSystem = require('fs')

var formidable = require('formidable');

app.use(bodyParser.urlencoded({
    extended: false
 }));
 
 app.use(bodyParser.json());

const port = 5000

var exec = require('child_process').exec


//When the user loads the home we run pythonScript
//app.get('/', pythonScript)

//image-location
app.post('/', sendFilePath)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function sendFilePath(req, res,next)  {
    //validate
    /*
    if(ok input) 
    {
        //do something
        //maybe redirect
    }
    else
    {
        //throw error
        //maybe redirect
    }
    */
    var name="halp";
   var form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
       name = files.imageLocation.name;
     var oldpath = files.imageLocation.path;
     console.log("OldPath:" + oldpath)
     //newpath = './images/' + files.imageLocation.name;
     var newpath = '../readerModule/temp/' + files.imageLocation.name;
     console.log("NewPath:" + newpath)
     fileSystem.rename(oldpath, newpath, function (err) {
       if (err) throw err;
       res.write('File uploaded and moved!');
       res.end();
     });
     console.log("path being sent: " + "./temp/" + name)
     pythonScript("./temp/"+name)
   });

//    console.log("path being sent: " + "./images/" + name)
//     pythonScript("./images/"+name)
   //C:\Users\Ashkan\PythonProjects\NoteSquire\readerModule
//    var child = exec('python C:/Users/Ashkan/PythonProjects/recog.py',location)
//    //var child = exec('C:/Users/Ashkan/PythonProjects/NoteSquire/readerModule/tester_main.py',location)
//     child.stdout.on('data', function(data) {
//         console.log('stdout: ' + data)
//         res.send(location)
//     })
}
function pythonScript(path) {
    console.log('Running function GET...')
    //....../backend
    dir = '..' + __dirname 
    var child = exec('python ../readerModule/a_imageReader.py ../readerModule/temp/70184-class-notes-jan-9-5.jpg',{
        cwd: 'C:/Users/Ashkan/LAHacks/NoteSquire/backend'
      },)
    //var child = exec('python ./test_1.py ' + "fuck")
  //   child.stdout.on('data', function(data) {
  //     console.log('stdin: ' + data)
  // })
    child.stderr.on('data', function(data) {
        console.log('stderr: ' + data)
    })
    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
    //var child = exec('python ../readerModule/a_imageReader.py \\$path')   
}

 
