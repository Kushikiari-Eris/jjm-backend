const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


const Register = async (req, res) =>{
    try {
        const {username, email, password, passwordVerify} = req.body
        //validation
        if(!username || !email || !password || !passwordVerify)
            return res.status(400).json({errorMessage: "Please enter all required fields"})

        if(password.length < 6)
            return res.status(400).json({errorMessage: "Please enter a password at least 6 characters"})

        if(password !== passwordVerify)
            return res.status(400).json({errorMessage: "Please enter the same password"})

        const existingUser = await User.findOne({email: email})
        if(existingUser)
            return res.status(400).json({errorMessage: "Email already exist."})

        //hashPassword
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        //create a new user
        const newUser = new User({username, email, password: passwordHash})
        const savedUser = await newUser.save()
        


        //sign the token
        const token = jwt.sign({user:savedUser._id, role: savedUser.role,}, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
        
        //send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        }).status(200).json({
            message: "User created successfully",
            user: {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
            },
        });


    } catch (error) {
        console.log(error)
        res.status(401).json({ user: {
            _id: existingUser._id, // Access user._id here
            email: existingUser.email,
            role: existingUser.role,
        },
        token, Message: "Internal Error"})
    }
}

const Login = async (req, res) =>{
    try {
        const {email, password} = req.body

        //validation
        if(!email || !password)
            return res.status(400).json({errorMessage: "Please enter all required fields"})

        const existingUser = await User.findOne({email})
        if(!existingUser)
            return res.status(401).json({errorMessage: "Wrong Email Address"})

        const passwordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!passwordCorrect)
            return res.status(401).json({errorMessage: "Wrong Password"})

        //sign the token
        const token = jwt.sign({user:existingUser._id, role: existingUser.role,}, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
        //send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        })
        
        res.status(200).json({
            user: {
                _id: existingUser._id, // Access user._id here
                email: existingUser.email,
                role: existingUser.role,
            },
            token,
        });

    }  catch (error) {
        console.log(error)
        res.status(401).json({ Message: "Internal Error"})
    }
}



const Logout = (req, res) =>{
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })

     // Clear the userId cookie as well
     res.cookie("userId", "", {
        expires: new Date(0) // Set expiration date to the past
    });

    res.status(200).json({ message: "Logout successful" });
}


const LoggedIn = (req,res) =>{
    try {
        const token = req.cookies.token
        if(!token)
            return res.json({ loggedIn: false, role: null })

        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
        

        res.json({ loggedIn: true, role: verified.role })
    } catch (error) {
        console.log(error)
        res.json({loggedIn: false, role: null})
    }
}

const showAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Return users as JSON response
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from request parameters
        const { username, email, role } = req.body; // Get updated user data from request body

        // Validate the incoming data
        if (!username || !email || !role) {
            return res.status(400).json({ errorMessage: "Please provide all required fields." });
        }

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, role }, { new: true });
        
        // If the user does not exist
        if (!updatedUser) {
            return res.status(404).json({ errorMessage: "User not found." });
        }

        res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    Register,
    Login,
    Logout,
    LoggedIn,
    showAllUsers,
    editUser
}