const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator/check");
const Post = require("../models/post");
const User = require("../models/user");

// Retrieve all posts
exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 3;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems,
        perPage: perPage,
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
  // console.log("request.files: ",req.files)
  if (!req.files) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  //   const imageUrl = req.file.path;

  const title = req.body.title;
  const city = req.body.city;
  const state = req.body.state || "";
  const neighborhood = req.body.neighborhood;
  const street = req.body.street;
  const number = req.body.number || 0;
  const livingRoom = req.body.livingRoom || 0;
  const kitchen = req.body.kitchen || 0;
  const bathrooms = req.body.bathrooms || 0;
  const bedrooms = req.body.bathrooms || 0;
  const depo = req.body.depo || 0;
  const balcony = req.body.balcony || 0;
  const garden_square = req.body.garden_square || 0;
  const furnished = req.body.furnished;
  const price = req.body.price;
  const category_rs = req.body.category_rs;
  const category_usage = req.body.category_usage;
  const property_type = req.body.property_type;
  const description = req.body.description;
  // console.log('req.files[0]: ', req.files[0].path)
  let pictures = [];

  for (let i = 0; i < req.files.length; i++) {
    pictures[i] = req.files[i].path.replace("\\", "/");
  }

  let creator;
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
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
        creator: {
          _id: creator._id,
          username: creator.username,
        },
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
  const errors = validationResult(req);
  const postId = req.params.postId;

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const city = req.body.city;
  const state = req.body.state || "";
  const neighborhood = req.body.neighborhood;
  const street = req.body.street;
  const number = req.body.number || 0;
  const livingRoom = req.body.livingRoom || 0;
  const kitchen = req.body.kitchen || 0;
  const bathrooms = req.body.bathrooms || 0;
  const bedrooms = req.body.bathrooms || 0;
  const depo = req.body.depo || 0;
  const balcony = req.body.balcony || 0;
  const garden_square = req.body.garden_square || 0;
  const furnished = req.body.furnished;
  const price = req.body.price;
  const category_rs = req.body.category_rs;
  const category_usage = req.body.category_usage;
  const property_type = req.body.property_type;
  const description = req.body.description;
  let pictures = [];

  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      pictures[i] = req.files[i].path.replace("\\", "/");
    }
  }
  if (!pictures) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized to do this operation!");
        error.statusCode = 403;
        throw error;
      }

      for(let i = 0; i < pictures.length && i < post.pictures; i++) {
        if(pictures[i] !== post.pictures[i]) {
          clearImage(post.pictures[i]);
        }
      }

      // console.log('post.pictures: ', post.pictures)
      for(let image of post.pictures) {
        clearImage(image)
      }

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
    .then((result) => {
      res.status(200).json({
        message: "Post updated!",
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

// Delete a post
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized to do this operation!");
        error.statusCode = 403;
        throw error;
      }
      console.log('post.pictures: ', post.pictures)
      for(let image of post.pictures) {
        clearImage(image)
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Deleted post.",
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
