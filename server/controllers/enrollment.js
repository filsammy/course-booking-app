//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const auth = require("../auth");

const { errorHandler } = auth;


module.exports.enroll = (req, res) => {

    console.log(req.user.id);
    console.log(req.body.enrolledCourses) ;

    if(req.user.isAdmin){
        // if the user is an admin, send a message 'Admin is forbidden'.
        return res.status(403).send({ message: 'Admin is forbidden' });
    }

    let newEnrollment = new Enrollment ({
        userId : req.user.id,
        enrolledCourses: req.body.enrolledCourses,
        totalPrice: req.body.totalPrice
    })

    return newEnrollment.save()
    .then(enrolled => {
        // if the user successfully enrolled,return true and send a message 'Enrolled successfully'.
        return res.status(201).send({
            success: true,
            message: 'Enrolled successfully'
        });
    })
    .catch(error => errorHandler(error, req, res));
    
}

//[SECTION] Activity: Get enrollments
/*
    Steps:
    1. Use the mongoose method "find" to retrieve all enrollments for the logged in user
    2. If no enrollments are found, return a 404 error. Else return a 200 status and the enrollment record
*/

module.exports.getEnrollments = (req, res) => {
    return Enrollment.find({userId : req.user.id})
        .then(enrollments => {
            if (enrollments.length > 0) {
                // if there are enrolled courses, return the enrollments.
                return res.status(200).send(enrollments);
            }
            // if there is no enrolled courses, send a message 'No enrolled courses'.
            return res.status(404).send({
                message: 'No enrolled courses'
            });
        })
        .catch(error => errorHandler(error, req, res));
};

//[SECTION] Get enrolled users via course ID
// Contextualize it to use our module export approach.

module.exports.getEmailsOfEnrolledUsers = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        // Find the course by courseId
        const course = await Course.findById(courseId);
    
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
    
        // Check if the course has any enrollees
        if (!course.enrollees || course.enrollees.length === 0) {
            return res.status(404).json({ message: 'No enrolled users found for this course' });
        }

        // Get the userIds of enrolled users from the course
        const userIds = course.enrollees.map(enrollee => enrollee.userId);
    
        // Find the users with matching userIds
        const enrolledUsers = await User.find({ _id: { $in: userIds } });
    
        // Extract the emails from the enrolled users
        const userEmails = enrolledUsers.map(user => user.email);

        res.status(200).json({ userEmails: userEmails });
    } catch (error) {
        console.error('Error retrieving enrolled users:', error);
        res.status(500).json({ message: 'An error occurred while retrieving enrolled users' });
    }
};