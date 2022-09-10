const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));


// In referencing there is difference between the stored document and the desired document (which is that we want after referencing and querying for it for whole data integrate experience).
// i.e there is no real linking in mongo or proper relationship established in terms of referencing or linking or integrating data
// That is why Mongoose says this quite frankly: There are no joins in MongoDB 
// But we have done referencing in a view of linking or relating or integrating data or considering that it will link or integrate properly
//  because we want the course to be tied to the respective author, and we want to be able to easily access those author or authors without having to create more queries.
// and for that purpose we have populate() method in mongoose for overcoming the nature of linking or referencing in mongo.

// populate() function in mongoose is used for populating the data inside the reference. 
// Population is way of automatically replacing a path in document with actual documents from other collections. E.g. Replace the user id in a document with the data of that user. 
// We define refs in ours schema and mongoose uses those refs to look for documents in other collection.
// You can see Populate as a way for joining documents(theoretically not practically).

// Some points about populate:
// If no document is found to populate, then field will be null.
// In case of array of documents, if documents are not found, it will be an empty array.
// You can chain populate method for populating multiple fields.
// If two populate methods, populate same field, second populate overrides the first one.

const authorSchema =  new mongoose.Schema({
    name: String,
    bio: String,
    website: String
}); 

const Author = mongoose.model('Author',authorSchema );
  
const courseSchema = new mongoose.Schema({
    name: String,
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Author'
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

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    .populate('author','name -_id')
    .select('name author');
  console.log(courses);
}

//createAuthor('Shubham', 'My bio', 'My Website');

//createCourse('React Course', '61445e2959bbc32828054c86')

listCourses();
