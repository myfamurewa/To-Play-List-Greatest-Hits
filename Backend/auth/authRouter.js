const router = require('express').Router();

const bcrypt = require('bcryptjs');

const Users = require('../users/user-model.js');
const {validateUser, validateCreateUser, validateCredentials, validateUserExists} = require('../users/user-middleware.js');

const jwt = require('jsonwebtoken'); // installed this library
const secrets = require('./config/secrets.js');

// actions
router.post('/register', validateCreateUser, (req, res) => {
    // create hash
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 2);

    credentials.password = hash;

    // console.log('credentials', credentials);
    
    // add the user to the database
    Users.insert(credentials)
    .then( id => {
        res.status(201).json({id: id[0], username: credentials.username, userType: credentials.userType})
    })
    .catch( err => {
        res.status(500).json({errorMessage: "The user could not be created."})
    })
})

router.post('/login', validateUser, validateCredentials, (req, res) => {
    let { id, username, password } = req.body;
    Users.findBy(username)
        .then(user => {
        // console.log(user);
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user); // new line
    
            // the server needs to return the token to the client
            // this doesn't happen automatically like it happens with cookies
            res.status(200).json({
                id: user.id,
                username: username,            
                userType: user.userType, // return userType
                token // attach the token as part of the response
            });
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
        })
        .catch(error => {
        res.status(500).json(error);
        });
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    userType: user.userType
    // ...otherData
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  console.log("this is secrets", secrets)
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}


router.put('/:id', validateCreateUser, validateUserExists, (req, res) => {
    const { id } = req.params;

    // create hash
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 2);

    credentials.password = hash;

    credentials.id = id;
    
    // add the user to the database
    Users.update(credentials)
    .then( id => {
        res.status(201).json({id: Number(credentials.id), username: credentials.username})
    })
    .catch( err => {
        res.status(500).json({errorMessage: "The user could not be updated."})
    })
})


router.delete('/:id', validateUserExists, (req, res) => {
    const { id } = req.params;

    Users.remove(id)
    .then( success => {
        if(success) {
            res.status(200).json({message: 'User was deleted.'})
        } else {
            res.status(404).json({message: 'User could not be found.'})
        }
    })
    .catch( err => {
        res.status(500).json({errorMessage: 'There was an error deleting the user.'})
    })
})

router.get('/users', (req, res) => {
    Users.find()
    .then( users => {
        res.status(200).json(users);
    })
    .catch( err => {
        res.status(500).json({errorMessage: "there was an error getting all the users"})
    })
})

module.exports = router;


