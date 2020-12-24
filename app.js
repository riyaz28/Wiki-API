//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});
const articleschema=
  {

    title:String,
    content:String
  };

const Article=mongoose.model("article",articleschema);
const art1=new Article(
{
    "title" : "REST",
    "content" : "REST is short for REpresentational State Transfer. IIt's an architectural style for designing APIs."
});

const art2=new Article(
{
    "title" : "API",
    "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
});

 // art1.save();
 // art2.save();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static("public"));

////////////////////Requesting targeting all Articles  ////////////////////////////////////////////////////////
app.route("/articles")
.get(function(req,res)
{
Article.find({},function(err,foundArticle)
{
  if(!err)
  {
    // console.log(foundArticle);
    res.send(foundArticle);
  }
  else
  {
    res.send(err);
  }
});
}
).post(function(req,res)
{
   console.log(req.body.title);
   console.log(req.body.content);

  const art3=new Article({
    title:req.body.title,
    content:req.body.content
  });
}
)
.delete(function(req,res)
{
 Article.deleteMany(function(err)
 {
 if(!err)
 {
   res.send("Successfully deleted the Article");
 }
 else
 {
   res.send(err);
 }
});
}
);
////////////////////Requesting targeting a specific Articles  ////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res)
{
Article.findOne({title:req.params.articleTitle},function(err,foundArticle)
{
  if(!err)
  {
    res.send(foundArticle);
  }
  else
  {
    res.send(err);
  }
});
})
.put(function(req,res)
{
  Article.update({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},{overwrites:true},
    function(err)
    {
      if(!err)
      {
        res.send("Successfully updated the article");
      }
    }

)
})
.patch(function(req,res)
{
  // We just pass this JS object inside $set and it will update
  // req.body={
  //   title:"something"
  //   body:"something"
  // }
 Article.update({title:req.params.articleTitle},{$set:req.body},function(err)
{
 if(!err)
 {
   res.send("Successfully updated the article");
 }
 else
 {
   res.send(err);
 }
});
})
.delete(function(req,res)
{
 Article.deleteOne({title:req.params.articleTitle},function(err)
{
  if(!err)
  {
    res.send("successfully deleted specific article");
  }
  else
  {
    res.send(err);
  }
})

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
