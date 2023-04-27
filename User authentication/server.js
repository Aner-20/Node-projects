const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');

 app.use(express.json()) // is foundational put it before users

const users = []


app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users',  async (req,res) => {
    try{
        const salt =  await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);  // append the salt variable
        console.log(salt);
        console.log(hashedPassword)
        const user = {name: req.body.name, password: hashedPassword};
        users.push(user);
        res.status(201).send()

    }
    catch{
        res.status(500).send()
    }
    /*
    hash(salt + "3403290");  // hhhhhh
    hash(salt2 + "3403290")   // eeeeee
    */
})

app.post('/users/login',  async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if(user == null){
        return res.status(400).send('Cannot find user')
    }
    try{
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } 
        else{
            res.send('Not allowed')
        } // user.password: the hashed password
    }
    catch{
        res.status(500).send()
    }
})


app.listen(3000);