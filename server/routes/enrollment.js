const express = require("express");
const enrollmentController = require("../controllers/enrollment");
const auth = require("../auth");

const {verify, verifyAdmin} = auth;

//[SECTION] Activity: Routing Component
const router = express.Router();

//[SECTION] Route to enroll user to a course
router.post('/enroll', verify, enrollmentController.enroll);

//[SECTION] Activity: Route to get the user's enrollements array
router.get('/getEnrollments', verify, enrollmentController.getEnrollments);

//[SECTION] Route for getting enrolled users by course
router.get('/:courseId/enrolled-users', enrollmentController.getEmailsOfEnrolledUsers);

//[SECTION] Activity: Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;