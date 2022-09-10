const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground',{useNewUrlParser: true,useUnifiedTopology: true}) 
    .then(() => console.log('Connected to MongoDb ...'))
    .catch(error => console.log('Could not connect to MongoDb',error))

const courseSchema = new mongoose.Schema({
    // When defining schema for defining or establishing structure of documrnt objects
    // the properties can be directly set to--
    // 1. a type or
    // 2. schemaType object, just like we represent the document object structure via schema a complex object
    //    similrly to represent complexity with the individual property we assign them with schemaType objects
    //    with its on set of options or properties.
    //    There are a lot of options or properties available for schema type objects

    // required validator in mongoose can be set to-
    // 1. a boolean(true/false) or
    // 2. a function, when we require to conditionally set the requiredness of a property
    
    // There are a lot of validators specific to string
    // 1. minlength
    // 2. maxlength
    // 3. match
    // 4. enum
    name:{
        type:String, 
        required :true,
        minlength:3,
        maxlength:255,
        //match: /pattern/
    },
    category:{
        type:String,
        enum:['web','mobile','blockchain'], // it is used to define a set of predefined valid strings
        required:true,
        lowercase:true,
        //uppercase:true,
        trim:true, // when there will be padding around our string it will be automatically removed by mongoose


    },
    author:String,
    tags:{
        // when we want to have a kind of validation which is more complex and not rigid as the built-in validators then we use custom validator in order to impose validation at our wish and will
        type: Array,   
        // If we want to validate on something which is not present at momemt and will be coming after a delay or take some time, then we use async validator to valiate something coming agter a asynchronous operation
        // isAsync:true,
        // validate:{
        //     validator: function (value,callback) {
        //         setTimeout(()=>{
        //             const result = value && value.length;
        //             callback(result);
        //         },2000)
                
        //     },
        //     message:"A course should have atleast one tag"
        // }
        validate:{
            validator: function (value) {
                return value && value.length;
            },
            message:"A course should have atleast one tag"
        }

    },
    date:{type: Date,default:Date.now},
    isPublished: Boolean,
    price:{
        type:Number,
        min:4,
        max:200,
        get: value => Math.round(value),
        set: value => Math.round(value),
        required: function(){return this.isPublished}}
});    
const Course = mongoose.model('Course',courseSchema)

async function createCourseDocument() {
    // A Document can be considered as an object based on a model/blueprint which is based on a predefined schema 
    // In order to create a document we need to instantiate its model defined by a schema
    const course = new Course({
        name:'JavaScript Course',
        category:' Web ',
        author:'Shubham Pandey',
        tags:'Frontend',
        isPublished : true,
        price:3.99,
    })
    
    try {
        const courseDocument = await course.save() // validation is done by moongoose itself in the backend
        console.log(courseDocument);
        // But we can do it manually on our end and not rely on mongoose to start and do validation 
        //course.validate();
    } catch (error) {
        console.log(error.message);
        for(field in error.errors){
            console.log(error.errors[field].message);
        }
    }
}

//createCourseDocument()

async function getCourses() {

    // Comparision operators in MongoDb
    // eq
    // ne
    // gt
    // gte
    // lt
    // lte
    // in
    // nin
    
    // Mongo has 2 logical operators
    // or
    // and
    const courses = await Course
        //.find({author:'Zap',isPublished:true})
        //.find({price:10}) // since this is a json object & not a conditional to express greater than relation so we need to have a way to have condtional in json object but the object is a collection of key-value pair and here this simple value can't express conditionals in a json object way and an object can have have a key and a value,
        //key is there so we need a way to define value as a conditional,since conditional can be complex than just this simple value,
        //so in json object world inorder to define something complex we use objects...again and also mongo provides us with some conditional operator to facilitate that process of making value as a conditional
        //.find({price:{$gte:10,$lt:20}}) //i.e conditionals will also be in key value format,different conditionals in different key value pairs
        //.find({$in:[10,12,15,25]}) // as we know if we want to choose from a limited no of things we hold them in a array or collection  
        
        //.or([{author:'Zap'},{isPublished:true}])// we will apply either of the limited no of filters in the given collection or another
        //.and([{author:'Zap'},{isPublished:true}]) // an array of filter objects

        // Regular Expressions
        // 1.Starts with a particular String
        //.find({author:/^Zap/,isPublished:true})
        
        // // 2.Contains a particular string anywhere
        // .find({author:/.*Zap.*/i,isPublished:true})

        // // 3. Ends with a particular string
        // .find({author:/Pandey$/i,isPublished:true})
        
        .find({_id:'61391964ee946634c8c09a0b'})
        //.limit(3)
        .sort({name:1})
        .select({name:1,tags:1,price:1})
        //.count()
    console.log(courses[0].price);

} 
getCourses()

async function updateCourse(id) {

    //Approach :1 Query First
    // First Query by findById
    // Set the required properties
    // Save the change made to the document

    // const course = await Course.findById(id)
    // if(!course) return
    // course.set({
    //     name:'Angular course',
    //     author:'Shubham Pandey',
    //     tags:['angular','frontend','framework'],

    // })
    // const courseDocument = await course.save()
    // console.log(courseDocument);

    // Approach: 2. Update First
    // Update directly
    // Optionally get the updated data or updated document
    // const result = await Course.update({_id:id},{
    //     $set:{
    //         isPublished:false
    //     }
    // })
    // console.log(result);

    // If you want to get the updated document
    const courseDocument = await Course.findByIdAndUpdate({_id:id},{
        $set:{
            author:'Shubham'
        }
    },{new: true})

    console.log(courseDocument);
}
//updateCourse('61105444d2208039d4fd24fd')

async function deleteCourse(id) {
    // For deleting multiple documents
    //const result = await Course.deleteMany({name:'React Course'})

    // For Deleting Single document
    const result = await Course.deleteOne({_id:id})

    // For getting the document that was deleted
    //const courseDocument = await Course.findByIdAndRemove(id)


    console.log((result));
}

//deleteCourse('610f5374bf376a34aca2394f')