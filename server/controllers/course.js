//[SECTION] Activity: Dependencies and Modules
const Course = require("../models/Course");
const { errorHandler } = require('../errorHandler');

//[SECTION] Activity: Create a course
/*
    Steps: 
    1. Instantiate a new object using the Course model and the request body data
    2. Save the record in the database using the mongoose method "save"
    3. Use the "then" method to send a response back to the client appliction based on the result of the "save" method
*/
module.exports.addCourse = (req, res) => {

    let newCourse = new Course({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    console.log(req.body)
    //[SECTION] Activity: Validate if course already exists
    Course.findOne({ name: req.body.name })
        .then(existingCourse => {
            if (existingCourse) {
                // Sent { message: 'Course already exists' }

                // Notice that we didn't response directly in string, instead we added an object with a value of a string. This is a proper response from API to Client. Direct string will only cause an error when connecting it to your frontend.

                // using res.send({ key: value }) is a common and appropriate way to structure a response from an API to the client. This approach allows you to send structured data back to the client in the form of a JSON object, where "key" represents a specific piece of data or a property, and "value" is the corresponding value associated with that key.
                return res.status(409).send({ message: 'Course already exists' });
            } else {
                return newCourse.save()
                    /*
                    Response Body: The response body is a JSON object containing key-value pairs. It can be:
        
                        - success: true - sending a boolean value of true indicates that the course was added successfully.
                        
                        - message: A descriptive message indicating that the course was added successfully. This provides clear feedback to the client about the outcome of their request.
        
                        - result: Additional details about the newly created course. Including the result of the creation operation in the response allows the client to immediately access information about the newly created resource without needing to make an additional request.
                    */
                    .then(result => res.status(201).send({
                        success: true,
                        message: 'Course added successfully',
                        result: result
                    }))
                    .catch(error => errorHandler(error, req, res));
            }
        }).catch(error => errorHandler(error, req, res));
};

//[SECTION] Activity: Retrieve all courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllCourses = (req, res) => {
    return Course.find({})
        .then(result => {
            if (result.length > 0) {
                return res.status(200).send(result);
            }
            else {
                return res.status(404).send({ message: 'No courses found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve all active courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method with the "isActive" field values equal to "true"
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllActive = (req, res) => {

    Course.find({ isActive: true }).then(result => {
        if (result.length > 0) {
            //if the course is active, return the course.
            return res.status(200).send(result);
        }
        else {
            //if there is no active courses, return 'No active courses found'.
            return res.status(200).send({ message: 'No active courses found' });
        }
    }).catch(err => res.status(500).send(err));

};

//[SECTION] Retrieve a specific course
/*
    Steps: 
    1. Retrieve a course using the mongoose "findById" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getCourse = (req, res) => {
    Course.findById(req.params.courseId)
        .then(course => {
            if (course) {
                //if the course is found, return the course.
                return res.status(200).send(course);
            } else {
                //if the course is not found, return 'Course not found'.
                return res.status(404).send({ message: 'Course not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


//[SECTION] Update a course
/*
    Steps: 
    1. Create an object containing the data from the request body
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.updateCourse = (req, res) => {

    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }
    return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
        .then(course => {
            if (course) {
                //if the course is found, return the course and send a message 'Course updated successfully'.
                res.status(200).send({ success: true, message: 'Course updated successfully' });
            } else {
                //if the course is not found, return 'Course not found'.
                res.status(404).send({ message: 'Course not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


//[SECTION] Archive a course
/*
    Steps: 
    1. Create an object and with the keys to be updated in the record
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. If a course is updated send a response of "true" else send "false"
    4. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method
*/
module.exports.archiveCourse = (req, res) => {

    let updateActiveField = {
        isActive: false
    };

    Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(course => {
            if (course) {
                if (!course.isActive) {
                    //if the course isActive is already false, send a message 'Course already archived' and return the course.
                    return res.status(200).send({
                        message: 'Course already archived',
                        course: course
                    });
                }
                //if the course is successfully archived, return true and send a message 'Course archived successfully'.
                return res.status(200).send({
                    success: true,
                    message: 'Course archived successfully'
                });
            } else {
                //if the course is not found, return 'Course not found'
                return res.status(404).send({ message: 'Course not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};



//[SECTION] Activate a course
/*
    Steps: 
    1. Create an object and with the keys to be updated in the record
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. If the user is an admin, update a course else send a response of "false"
    4. If a course is updated send a response of "true" else send "false"
    5. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method
*/
module.exports.activateCourse = (req, res) => {

    let updateActiveField = {
        isActive: true
    }

    Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(course => {
            if (course) {
                if (course.isActive) {
                    // if the course isActive is already true, send a message 'Course already activated', and return the course.
                    return res.status(200).send({
                        message: 'Course already activated',
                        course: course
                    });
                }
                //if the course is successfully activated, return true and send a message 'Course activated successfully'.
                return res.status(200).send({
                    success: true,
                    message: 'Course activated successfully'
                });
            } else {
                // if the course is not found, return 'Course not found'
                return res.status(404).send({ message: 'Course not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};



//[SECTION] Search course by name
// Update the function to arrow to unify our code formats
// Modify how we export our controllers
module.exports.searchCoursesByName = async (req, res) => {
    try {
        const { courseName } = req.body;

        // Use a regular expression to perform a case-insensitive search
        const courses = await Course.find({
            name: { $regex: courseName, $options: 'i' }
        });

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.searchCoursesByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        // Find courses within the price range
        const courses = await Course.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for courses' });
    }
};


