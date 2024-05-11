const express = require('express');
const router = express.Router();
const User = require('../Schemas/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')


const JWT_SECRET = process.env.JWT_SECRET;
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry , a user with this email already exists' });
        }

        //produce secure password(hashed)
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);


        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred")
    }
})

//autenticate a user during login(route no 2)Login isn't req
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Please try to Login with correct credentials' });
        }
        const passcompare = await bcrypt.compare(password, user.password);
        if (!passcompare) {
            return res.status(400).json({ error: 'Please try to Login with correct credentials' });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred")
    }
})

//route 3 to get the logged in user's details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error ...");
    }
})

router.get('/fetchall', (req, res) => {
    SVG.find()
        .then(svgData => {
            res.json(svgData);
        })
        .catch(error => {
            console.error('Error fetching SVG data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
router.post('/save', async(req,res) => {
    try{
    const {frames,userId} = req.body;
    const newAn = await SVG.create({
        frames,
        user:userId
    }) 
    const final = newAn.save;
    res.send("Successfully saved.");
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})
router.get("/fetchuseranimations", fetchuser, async (req, res) => {
    try {
      const notes = await SVG.find({ user: req.user.id });
      res.json(notes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });
  
module.exports = router;