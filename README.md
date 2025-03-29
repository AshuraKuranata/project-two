# Project 2 - CRUD Application with additional functionality

# Day 1:

## Introduction

The expectations for this project is to implement a new CRUD application, but include additional functionality into it that was not covered in the standard lessons.
With this expectation in mind, this is the project application I will be developing:

### CRUD App: Bird Watching Application:

**MVP for application:**
* Birds models
* User models - basic user & admin user
* Index pages for birds, user's collection, & admin super user page
* User page to request bird addition to model
* User pages to add, update, delete their unique bird collection data
* Admin create, delete, & update bird in model; ability to delete users
* Landing Page that includes sign-up & sign-in routes
* Sign-up & sign-in Authentication pages and routes (utilizing regular expressions)
* Updated Landing Page based on user authentication

**Stretch:**
* Admin ability to access user's model data and make adjustments
* Comments, likes, and # of users that have seen bird that users can see in full bird index page
* Ability for users to see other user bird collections anonymously

---

My expectation is to cover the following applications that were not covered:
* Application of MVC in Express for CRUD application to better maintain and manage the code
* Utilization of regular expressions
* Utilizing Authentication and Authorization that will create unique user and admin sessions in application
* Utilizing Mongoose Relationships to embed and/or reference the models and sub-databases

Here is my anticipated work breakdown:

* Level ups on Authentication and Mongoose Relationships
* Build initial structure of application in VS code
* Build & test CRUD MVP: add, edits, & deletion of birds
* Build Authentication for User profiles
* Finalize MVP logic
* Stretch goals: customer orders models
* Start stretch goals: customer orders & error catching, randomization
* Finalize stretch with user score tracker & review code for project presentations
* Project Delivery and Presentation

## Initial Progress

I began with the completion of the content on Authentication and Mongoose embedding and referencing objective.  I then began with the initial file structure and build of the application, creating the basic file structure and the models to utilize in this application.  This will be the first push in GitHub to start the project off.

# Day 2:

## User Authentication

This process took some time to implement.  It was a headscratcher in trying to understand new modules to upload and add into the main code server.  My main take-aways in understanding the process:

* 

Functionally was having some initial troubles routing correctly between file paths, but after overviewing the material more and reviewing file structure, was able to properly implement user sign-ups, sign-ins, and log-outs.

## CRUD Application for Bird Entries

Built the CRUD application for any user to fulfill standard CRUD operations for the main bird index.  With this implementation complete, the next step will be engaging on the Mongoose relationships between User model and Bird model.

## Mongoose/MongoDB model relationships

In building this application, my focus for the user story that I'd like to fulfill is the following:

***As a user, I would like to be able to take a bird from the bird index and add that to my collection as a bird that I've viewed.***

***As a user, I would like to make edits to the birds that I've seen to track additional details about what I've spotted.***

To do this, I want to approach this by building a connection between my Birds model to my Users model so the unique bird object will appear within the user's collection.

I began building my code to create a view of the user's collection.  After initial build, I added in some extra logic into the HTML code so that I could have the page dynamically change based on whether the user has birds in their collection or not.  That would also change the edited text of the link for the changes to be added to the collection.

Additionally, I was originally going to create two different pages for adding and removing birds from the collection, but decided to build the two of them into the same page for now, as it would help me in understanding the routing processes and references of objects.

```HTML
<body>
    <%- include('../partials/userview.ejs') %>
    <h1><%= user.username%>'s Bird Viewing Collection</h1>
    <% if (birds.length > 0) { %>
        <a href="/birdapp/collection/editcollection">Click here to add or delete birds from your collection.</a>
        <% birds.forEach((bird) => { %>
            <h2><%= bird.name %></h2>
    <% }) } else { %>
        <h2>No birds in collection</h2>
        <a href="/birdapp/collection/editcollection">Click here to add birds from your collection.</a>
    <% } %>
</body>
```

### Adding and removing references to the User collection

At this point was when I started to have a lot of issues with figuring out and understanding the code and references to objects.  I was able to initially set up my two models to house references to one another:

```js
// Bird Model that can reference User model
const birdSchema = new mongoose.Schema({
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ]
})

// User Model that can reference Bird model
const userSchema = new mongoose.Schema({
    birdCollection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bird',
            required: true,
        },
    ],
})
```

One thing that I didn't realize I needed to do was make sure that when I was referencing the mongoose to each other was the nested relationships between objects and arrays, which made trying to call on the User object an extremely difficult task.

Another problem that I found myself running from a conceptual understanding was how to reference the user to make sure that the updates to the collection.  Since I set up the authentication code with unique usernames, I ended up using the username key:value to find the right user object in the model for each session.  Now that I reflect on this process, I'm sure I could instead do a proper reference to the user's ID instead of utilizing the username as the field to search by, which could have helped to reduce some extra code lines to validate a pull of the referenced bird model.

Here is the route to the user collection page:
```js
const userCollection = async (req, res) => {
    const user = await User.find({ username: req.session.user.username }).populate('birdCollection').exec()
    const userCollection = user[0].birdCollection
    // console.log(user[0].birdCollection) // NEED TO CHANGE LOGGED DATA FROM AN ARRAY INTO SINGLE OBJECT
    res.render(`birdapp/usercollection.ejs`, { birds: userCollection })
}
```

The next major issue I ran into was how to code the adding a bird to the page.  I started off with the view code and the server.js that would call on the controller route  

```html
<!--- View to the add collection of bird --->
<h1>Select a bird to add to collection</h1>
    <div class="birdsBox">
        <form action="/birdapp/collection/addbird" method="POST">
            <div class="birdCard">
                <select name="birdCollection" id="birdSelect">
                    <% for (let bird of birds) { %>
                        <option value="<%=bird._id%>"><%=bird.name%></option>
                        <% } %>
                </select>
            </div>
            <button type="submit">Add Birds to Collection</button>
        </form>
    </div>
```

```js
app.get('/birdapp/collection', isSignedIn, birdCtrl.userCollection) // Views user's collection
app.get('/birdapp/collection/editcollection', isSignedIn, birdCtrl.selectBirdCollection) // Form to select bird to add to collection
app.post('/birdapp/collection/addbird', isSignedIn, birdCtrl.addCollection) // Add Bird to User's collection
```

At this point my next challenge was in how exactly I reference the bird model's object ID that I want to add to the user's model in the collection array to store the references in.  What I initially built was able to update a listing if it were already being referenced:

```js
const editCollection = async (req, res) => {
    const birdId = await Bird.findById(req.body.birdCollection);
    const userId = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { birdCollection: birdId },
        { new: true },
    );
    console.log('Updated Document:', addCollection);
    res.redirect(`/birdapp/collection`)
}
```

With this code, I knew I was able to make an adjustment to the referenced bird object ID and change it, but what I wanted to do was add a model reference so there'd be multiple referenced objects instead of a single object.

I did some research into this and found that there are two commands in Mongoose and MongoDB code to accomplish this:
* $push - this command will add the referenced model object ID at the end of the array, which will add new entries as references.  The issue here is that this will allow for duplicate references unless more code is built.
* $addToSet - this command also adds the referenced model object ID, but is also hardcoded to check for duplicate IDs and NOT add if there is a duplicated item.

I used the $addToSet command and made updates to my code, which now looks like this:

```js
const addCollection = async (req, res) => {
    const birdId = await Bird.findById(req.body.birdCollection);
    const userName = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { $addToSet: {birdCollection: birdId} },
        { new: true},
    )
    res.redirect('/birdapp/collection')    
}
```

From this win, I went ahead to move into the reverse process: deleting an entry from the collection:

I tried to use the same workflow but in a reverse engineered way:

```html
<% if (collection.length > 0) { %>
    <h1>Select a bird to remove from your collection</h1>
    <div class="birdsBox">
        <form action="/birdapp/collection/removebird" method="POST">
            <div class="birdCard">
                <select name="birdCollectionRemove" id="birdRemove">
                    <% for (let bird of collection) { %>
                        <option value="<%=bird._id%>"><%=bird.name%></option>
                        <% } %>
                </select>
            </div>
            <button type="submit">Remove Birds from Collection</button>
        </form>
    </div>
    <% } %>
```

```js
const deleteCollectionBird = async (req, res) => {
    const birdId = await Bird.findById(req.body.birdCollectionRemove);
    const userId = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { $pull: { birdCollection: birdId._id } },
        { new: true },
    );
    console.log("Updated User Collection:", userId.birdCollection);
    res.redirect('/birdapp/collection')
}
```

I started to run into errors here, where the function was not removing anything as I intended it.  After walking through the process, researching, and thinking it through, I found that the issue with my code was in two places:

* For the birdId, I actually was already able to call upon the bird's ID from my previous code as it was already being called through the form I created.  Rather than calling on the whole object, I just needed the 'req.body.birdCollectionRemove' to have the ID of the bird that would be removed from the user model collection array.
* The $pull function was working correctly, but with the above fix, all I needed to do was change the 'birdId._id' to 'birdId' since the variable would store the correct ID to remove.

const birdId = ~~await Bird.findById(~~req.body.birdCollectionRemove~~)~~
{ $pull: { birdCollection: birdId~~._id~~ } }

These two fixed made the code look like:

```js
const deleteCollectionBird = async (req, res) => {
    const birdId = req.body.birdCollectionRemove;
    const userId = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { $pull: { birdCollection: birdId } },
        { new: true },
    );
    console.log("Updated User Collection:", userId.birdCollection);
    res.redirect('/birdapp/collection')
}
```

Through these changes, the app now properly allows for a user to successfully add and remove references to any of the birds in the index and now add and remove them from the collection.
