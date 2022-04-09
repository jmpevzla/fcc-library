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
        if (err) return console.error(err);

        return res.json(docs);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.end('missing required field title');
      }

      const book = new Books();
      book.title = title;
      book.save().then(bookCreated => {
        return res.status(201).json(bookCreated);
      }).catch(err => {
        console.error(err);
      }); 
    })
    
    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      Books.deleteMany({}, (err) => {
        if (err) return console.error(err);

        return res.end('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Books.findById(bookid, 'title comments', function(err, doc) {
        if (err || !doc) {
          return res.end('no book exists');
        }

        res.json(doc);
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) {
        return res.end('missing required field comment');
      }

      Books.findById(bookid, 'title comments commentcount', function(err, doc) {
        if (err || !doc) {
          return res.end('no book exists');
        }

        doc.commentcount = Number(doc.commentcount) + 1;
        doc.comments.push(comment);
        doc.save().then(bookUpdated => {
          delete bookUpdated.commentcount;
          return res.json(bookUpdated);
        }).catch(err => {
          console.error(err);
        }); 
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Books.findById(bookid, function(err, doc) {
        if (err || !doc) {
          return res.end('no book exists');
        }

        Books.deleteOne({ _id: bookid }, errx => {
          if (errx) return console.error(errx);

          return res.end('delete successful');
        });
      });
    });
  
};
