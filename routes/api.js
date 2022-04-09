/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const express = require('express');
const mongoose = require('mongoose');

/**
 * @param {express.Express} app 
 * @param {mongoose.Model} Books
 */
module.exports = function (app, Books) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Books.find(null, 'title commentcount', function(err, docs) {
        if (err) console.error(err)

        return res.json(docs)
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.end('missing required field title')
      }

      const book = new Books()
      book.title = title
      book.save().then(bookCreated => {
        return res.status(201).json(bookCreated)
      }).catch(err => {
        console.error(err)
      }) 
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Books.findById(bookid, 'title comments', function(err, doc) {
        if (err || !doc) {
          return res.end('no book exists')
        }

        res.json(doc)
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
