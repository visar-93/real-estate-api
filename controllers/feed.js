const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
    const posts = Post.find()
    .then(result => {
        res.status(200).json({
            posts: result
        })
    })
    .catch(err => {
        console.log(err);
    })
//   res.status(200).json({
//     posts: [
//       {
//         title: "Shtepia ne shitje",
//         address: {
//           city: "Prishtine",
//           state: "Kosova",
//           neighborhood: "Dodona",
//           street: "Afrim Loxha",
//           number: 7,
//         },
//         rooms: {
//           livingRoom: 1,
//           kitchen: 1,
//           bathrooms: 3,
//           bedrooms: 4,
//           depo: 1,
//           balcony: 4,
//           garden_square: 20,
//         },
//         furnished: true,
//         price: 200000,
//         category_rs: "sale",
//         category_usage: "residential",
//         property_type: "house",
//         description: "Shtepia ne shitje shtepia ne shitje shtepia ne shitje",
//         pictures: "imagesistockphoto-1337434489-170667a.jpg",
//       },
//     ],
//   });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
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
//   const pictures = req.body.pictures;


  // Create post in db
//   const post = new Post({
//     title: "Shtepia ne shitje",
//     address: {
//       city: "Prishtine",
//       state: "Kosova",
//       neighborhood: "Dodona",
//       street: "Afrim Loxha",
//       number: 7,
//     },
//     rooms: {
//       livingRoom: 1,
//       kitchen: 1,
//       bathrooms: 3,
//       bedrooms: 4,
//       depo: 1,
//       balcony: 4,
//       garden_square: 20,
//     },
//     furnished: true,
//     price: 200000,
//     category_rs: "sale",
//     category_usage: "residential",
//     property_type: "house",
//     description: "Shtepia ne shitje shtepia ne shitje shtepia ne shitje",
//     pictures: "imagesistockphoto-1337434489-170667a.jpg",
//   });
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
    pictures: "imagesistockphoto-1337434489-170667a.jpg",
  });
  return post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
