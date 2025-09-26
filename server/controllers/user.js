//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const auth = require("../auth");

const { errorHandler } = require("../errorHandler");

//[SECTION] Check if the email already exists
/*
    Steps: 
    1. Use mongoose "find" method to find duplicate emails
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.checkEmailExists = (req, res) => {

    if (req.body.email.includes("@")) {
        return User.find({ email: req.body.email })
            .then(result => {

                if (result.length > 0) {
                    return res.status(409).send({ message: "Duplicate email found" });
                } else {
                    return res.status(200).send({ message: "No duplicate email found" });
                };
            })
            .catch(error => errorHandler(error, req, res));
    } else {
        res.status(400).send({ message: "Invalid email format" })
    }
};

//[SECTION] User registration
/*
    Steps:
    1. Create a new User object using the mongoose model and the information from the request body
    2. Make sure that the password is encrypted
    3. Save the new User to the database
*/
module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")) {
        // if the email is not in the right format, send a message 'Invalid email format'.
        return res.status(400).send({ message: 'Invalid email format' });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11) {
        // if the mobile number is not in the correct number of characters, send a message 'Mobile number is invalid'.
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        // If the password is not atleast 8 characters, send a message 'Password must be atleast 8 characters long'.
        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
        // If all needed requirements are achieved
    } else {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
            // if all needed requirements are achieved, send a success message 'User registered successfully' and return the newly created user.
            .then((result) => res.status(201).send({
                message: 'User registered successfully',
                user: result
            }))
            .catch(error => errorHandler(error, req, res));
    }
};

//[SECTION] User authentication
/*
    Steps:
    1. Check the database if the user email exists
    2. Compare the password provided in the login form with the password stored in the database
    3. Generate/return a JSON web token if the user is successfully logged in and return false if not
*/
module.exports.loginUser = (req, res) => {

    if (req.body.email.includes("@")) {
        return User.findOne({ email: req.body.email })
            .then(result => {
                if (result == null) {
                    // if the email is not found, send a message 'No email found'.
                    return res.status(404).send({ message: 'No email found' });
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                    if (isPasswordCorrect) {
                        // if all needed requirements are achieved, send a success message 'User logged in successfully' and return the access token.
                        return res.status(200).send({
                            message: 'User logged in successfully',
                            access: auth.createAccessToken(result)
                        })
                    } else {
                        // if the email and password is incorrect, send a message 'Incorrect email or password'.
                        return res.status(401).send({ message: 'Incorrect email or password' });
                    }
                }
            })
            .catch(error => errorHandler(error, req, res));
    } else {
        // if the email used in not in the right format, send a message 'Invalid email format'.
        return res.status(400).send({ message: 'Invalid email format' });
    }
};

//[Section] Activity: Retrieve user details
/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {

            if (!user) {
                // if the user has invalid token, send a message 'invalid signature'.
                return res.status(404).send({ message: 'invalid signature' })
            } else {
                // if the user is found, return the user.
                user.password = "";
                return res.status(200).send(user);
            }
        })
        .catch(error => errorHandler(error, req, res));
};


//[SECTION] Reset password
// Modify how we export our controllers
module.exports.resetPassword = async (req, res) => {

    try {

        // Add a console.log() to check if you can pass data properly from postman
        // console.log(req.body);

        // Add a console.log() to show req.user, our decoded token, does not contain userId property but instead id
        // console.log(req.user);

        const { newPassword } = req.body;

        // update userId to id because our version of req.user does not have userId property but id property instead.
        const { id } = req.user; // Extracting user ID from the authorization header

        // Hashing the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update userId update to id
        // Updating the user's password in the database
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        // Sending a success response
        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });

    }

};


//[SECTION] Update profile
// Update the function to arrow to unify our code formats
// Modify how we export our controllers
module.exports.updateProfile = async (req, res) => {
    try {

        // Add a console.log() to check if you can pass data properly from postman
        // console.log(req.body);

        // Add a console.log() to show req.user, our decoded token, does have id property
        // console.log(req.user);

        // Get the user ID from the authenticated token
        const userId = req.user.id;

        // Retrieve the updated profile information from the request body
        // Update the req.body to use mobileNo instead of mobileNumber to match our schema
        const { firstName, lastName, mobileNo } = req.body;

        // Update the user's profile in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, mobileNo },
            { new: true }
        );

        res.send(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to update profile' });
    }
}
