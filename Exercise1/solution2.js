const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo-exercises',{useNewUrlParser: true,useUnifiedTopology: true}) 
    .then(() => console.log('Connected to MongoDb ...'))
    .catch(error => console.log('Could not connect to MongoDb',error))

    const courseSchema = new mongoose.Schema({
        name:String,
        author:String,
        tags:[ String ],
        date:{type: Date},
        isPublished: Boolean,

    });

    const Course = mongoose.model('courses',courseSchema);

    async function getCourses(){

        const courses = await Course.find({isPublished:true, tags:{$in:['frontend','backend']}})
        .sort('-price')
        .select({name:1,author:1})
    
        console.log(courses);

    };

    getCourses();