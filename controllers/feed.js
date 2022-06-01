const fs = require('fs');
const path = require('path');
const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

// Retrieve all posts
exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Retrieve single post
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post fetched.",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Create a post
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  //   if(!req.file) {
  //       const error = new Error("No image provided.");
  //       error.statusCode = 422;
  //       throw error;
  //   }

  //   const imageUrl = req.file.path;

  const title = req.body.title;
  const city = req.body.address.city;
  const state = req.body.address.state || "";
  const neighborhood = req.body.address.neighborhood;
  const street = req.body.address.street;
  const number = req.body.address.number || 0;
  const livingRoom = req.body.rooms.livingRoom || 0;
  const kitchen = req.body.rooms.kitchen || 0;
  const bathrooms = req.body.rooms.bathrooms || 0;
  const bedrooms = req.body.rooms.bathrooms || 0;
  const depo = req.body.rooms.depo || 0;
  const balcony = req.body.rooms.balcony || 0;
  const garden_square = req.body.rooms.garden_square || 0;
  const furnished = req.body.furnished;
  const price = req.body.price;
  const category_rs = req.body.category_rs;
  const category_usage = req.body.category_usage;
  const property_type = req.body.property_type;
  const description = req.body.description;
  const pictures = req.body.pictures;

  // Create post in db
  const post = new Post({
    title: title,
    address: {
      city: city,
      state: state,
      neighborhood: neighborhood,
      street: street,
      number: number,
    },
    rooms: {
      livingRoom: livingRoom,
      kitchen: kitchen,
      bathrooms: bathrooms,
      bedrooms: bedrooms,
      depo: depo,
      balcony: balcony,
      garden_square: garden_square,
    },
    furnished: furnished,
    price: price,
    category_rs: category_rs,
    category_usage: category_usage,
    property_type: property_type,
    description: description,
    pictures: pictures,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Update post
exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const city = req.body.address.city;
  const state = req.body.address.state || "";
  const neighborhood = req.body.address.neighborhood;
  const street = req.body.address.street;
  const number = req.body.address.number || 0;
  const livingRoom = req.body.rooms.livingRoom || 0;
  const kitchen = req.body.rooms.kitchen || 0;
  const bathrooms = req.body.rooms.bathrooms || 0;
  const bedrooms = req.body.rooms.bathrooms || 0;
  const depo = req.body.rooms.depo || 0;
  const balcony = req.body.rooms.balcony || 0;
  const garden_square = req.body.rooms.garden_square || 0;
  const furnished = req.body.furnished;
  const price = req.body.price;
  const category_rs = req.body.category_rs;
  const category_usage = req.body.category_usage;
  const property_type = req.body.property_type;
  const description = req.body.description;
  let pictures = req.body.pictures;

  //   if(req.file) {
  //       pictures = req.file.path;
  //   }
  //   if(!pictures) {
  //       const error = new Error('No file picked.');
  //       error.statusCode = 422;
  //       throw error;
  //   }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }

    //   if(picture !== post.pictures) {
    //       clearImage(post.pictures)
    //   }

      post.title = title;
      post.address.city = city;
      post.address.state = state;
      post.address.neighborhood = neighborhood;
      post.address.street = street;
      post.address.number = number;
      post.rooms.livingRoom = livingRoom;
      post.rooms.kitchen = kitchen;
      post.rooms.bathrooms = bathrooms;
      post.rooms.bedrooms = bedrooms;
      post.rooms.depo = depo;
      post.rooms.balcony = balcony;
      post.rooms.garden_square = garden_square;
      post.furnished = furnished;
      post.price = price;
      post.category_rs = category_rs;
      post.category_usage = category_usage;
      post.property_type = property_type;
      post.description = description;
      post.pictures = pictures;
      return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Post updated!',
            post: result
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Delete a post
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
          }
        // clearImage(post.pictures);
        
        return Post.findByIdAndRemove(postId);
    }) 
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Deleted post.'
        });
    })
    .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => {
      console.log(err);
    });
  };
  