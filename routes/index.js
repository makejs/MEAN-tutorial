var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/thelist', function(req, res){
    var mongoClient = mongodb.MongoClient;
    
    var url = 'mongodb://localhost:27017/samplesite'; //mongo server at port 27017
    
    mongoClient.connect(url, function(err, db){
        if(err){
            console.log('Unable to connect to server',err);
        }else{
            console.log('Connection Established!');
            var collection = db.collection('students'); //get the collection called students
            collection.find({}).toArray(function(err, result){
                if(err){
                    res.send(err); //print error to browser screen
                }else if(result.length){//true if information to show
                    console.log(result);
                    res.render('studentList', { //this will render the named file in views
                        studentlist: result,
                        title: 'the student list!'
                    });
                }else{
                    res.send('No documents found');
                }
                db.close();
            });
        }
    });
});

router.get('/newstudent', function(req, res){
    res.render('newstudent', {title: 'Add Student'});
});

router.post('/addstudent', function(req, res){
    var mongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/samplesite';
    mongoClient.connect(url, function(err, db){
        if(err){
            console.log('Unable to connect to server', err);
        }else{
            console.log('Connected to server');
            var collection = db.collection('students');
            var student1 = {student: req.body.student, street: req.body.street, city: req.body.city, state: req.body.state, sex: req.body.sex, gpa: req.body.gpa};
            collection.insert([student1], function(err, result){//each entry is within an array element.
                if(err){
                    console.log('Did not insert new student ',err);
                }else{
                    res.redirect('thelist');
                }
                db.close();
            });
        }
    });
});

module.exports = router;
