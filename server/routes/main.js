const express = require('express');
const Professor = require('../models/Professor');
const router = express.Router();

router.get('', (req,res) =>{

    
    res.render('index', {title:"RMPL"});
    
});

router.post('/search', async (req,res) =>{
    try{
        let searchTerm = req.body.searchTerm;
        //Regex to remove special characters
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, "");
        //Find professor by name
        const data = await Professor.find({
            $or: [
                {name: {$regex: new RegExp(searchNoSpecialChar,'i')}}
            ]
        });
        console.log(data);
        res.render('search', {title: "Search", data});
    } catch(err){
        console.log(err);
    }
})

router.get('/addNew', (req,res) =>{
    addProfessor();
});

router.get('/about', (req,res) =>{
    res.render('about', {title:"About"});
});

router.get('/list', (req,res) => {
    res.render('list', {title:"Add new instructor"});
});

router.get('/search/:id', (req,res) => {
    const id = req.params.id;
    Professor.findById(id)
    .then((result) =>{
        res.render('instructor', {title: result.name, result});
    })
    .catch((err) => {
        console.log(err);
    });
});

function addProfessor(){
    Professor.insertMany([{
        name: "Chris Schmidt",
        department: "Physics",
        ratings: 0,
        overall:0,
        difficulty:0,
        workload:0,
    }]);
};

module.exports = router;