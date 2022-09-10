const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema =  new mongoose.Schema({
    name: String,
    bio: String,
    website: String
}); 

const Author = mongoose.model('Author',authorSchema );
  
const courseSchema = new mongoose.Schema({
    name: String,
    authors: {
        type:[authorSchema],
        required:true,
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    .select('name authors');
  console.log(courses);
}

// Sub-documents can only be saved in context of the parent document
// and not alone as individual documents.
async function updateCourse(courseId){
    /* let 
    course = await Course.findById({_id: courseId})
    course.author.name = 'Shubham Pandey';
    try {
        course = await course.save()
        console.log(course);
    } catch (error) {
        for(field in error.errors){
            console.log(error.errors[field].message);
        }
    } */

    const course = await Course.updateOne({_id: courseId},{
        // For setting some properties
        $set:{
            'author.name' : 'Morgan Pandey',
        }

        /* // We can also unset certain properties
        $unset:{
            author : ''
        } */
    })
}

async function addSubDocument(courseId,author) {
    let course = await Course.findById({_id:courseId})
    course.authors.push(author);

    try {
        course = await course.save()
        console.log(course);
    } catch (error) {
        for(field in error.errors){
            console.log(error.errors[field].message);
        }
    }    
}

async function removeSubDocument(courseId,authorId) {
    let course = await Course.findById({_id:courseId})
    const author = course.authors.id(authorId);

    author.remove();
    console.log(author);
    course = await course.save()

}
//createAuthor('Shubham', 'My bio', 'My Website');

//createCourse('React Course', new Author({name:'Zap'}))
// createCourse('JavaScript Course', [
//     new Author({name:'Zap'}),
//     new Author({name:'Shubham Pandey'}),
//     new Author({name:'Morgan'}),
// ]);
//updateCourse('614495085559a61efc009572')
//addSubDocument('6144f7dd0aef402440ea18bb',new Author({name:'Shivi'}))
//removeSubDocument('6144f7dd0aef402440ea18bb','614502eadf102b19681905ac')
listCourses();
