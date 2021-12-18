const express = require('express');
const Register = require('./src/model/Registerdata')
const cors = require('cors');  //enabling data sharing from mongodb server to angular server
// var bodyparser = require('body-parser');
//const jwt = require('jsonwebtoken');
 const bodyParser = require('body-parser');
var app = new express();
const jwt = require('jsonwebtoken')

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

username="admin@gmail.com"
password="Admin@123"

function verifyToken1(req,res,next){
  if(!req.headers.authorization){
    return res.status(401).send("unauthorised request")
  }
let token = req.headers.authorization.split(' ')[1]
if(token==null){
  return res.status(401).send("unauthorised request")
}
let payload=jwt.verify(token,'secretKey')
//   console.log(payload)
if(!payload){
  return res.status(401).send("unauthorised request")
}
req.userId=payload.subject
next()
}
// Verifytoken for trainer
function verifyToken2(req,res,next){
  if(!req.headers.authorization){
    return res.status(401).send("unauthorised request")
  }
let token = req.headers.authorization.split(' ')[2]
if(token==null){
  return res.status(401).send("unauthorised request")
}
let payload=jwt.verify(token,'secretKey')
//   console.log(payload)
if(!payload){
  return res.status(401).send("unauthorised request")
}
req.userId=payload.subject
next()
}

app.post('/login',function(req,res){

  // res.header("Access-Control-Allow-Orgin","*") //FROM ANY SERVER WE GET THE "/products" REQUEST WE NEED TO ACCEPT IT
  // res.header("Acess-Conrol-Allow-Methods: GET,POST,PATCH,PUT,DELETE,OPTIONS");  //METHODS WE ARE ACCEPTING


  let userData=req.body

  if(username === userData.usname && password === userData.password){
      let payload = {subject:uname+password}
      let token = jwt.sign(payload,'secretKey')
      res.status(200).send({token});
      // console.log("success")
      
}
else{
  Register.findOne({uname:userData.usname})
  .then((data)=>{
      
      if(data==null){
      let error ="Invalid User";
      res.send({error})
      }
      else if(data.password===userData.password){
          let payload = {subject:userData.uname+userData.password}
          let token1 = jwt.sign(payload,'secretKey')
          // console.log(token1,data.name)
          res.status(200).send({token1,data});
           console.log("success")
      }
  
  else{
      let error ="Invalid User";
      res.send({error})
      
  }
  
      })
  }
})



app.post('/signup',function(req,res){
  res.header("Access-Control-Allow-Orgin","*") //FROM ANY SERVER WE GET THE "/products" REQUEST WE NEED TO ACCEPT IT
  res.header("Acess-Conrol-Allow-Methods: GET,POST,PATCH,PUT,DELETE,OPTIONS"); 
  console.log(req.body);
  var user={
    
    uname:req.body.user.uname,
    name:req.body.user.name,
    email:req.body.user.email,
    phone:req.body.user.phone,
    designation:req.body.user.designation,
    address:req.body.user.address,
    password:req.body.user.password
    
  }

  var reg = new  Register(user);
  reg.save()
});




// username="admin"
// password="1234"

// function verifyToken(req,res,next){
//   if(!req.headers.authorization){
//     return res.status(401).send("unauthorised request")
//   }
// let token = req.headers.authorization.split('')[1]
// if(token=='null'){
//   return res.status(401).send("unauthorised request")
// }
// let payload=jwt.verify(token,'secretkey')
// console.log(payload)
// if(!payload){
//   return res.status(401).send("unauthorised request")
// }
// req.userId=payload.subject
// next()
// }

// app.post('/login',function(req,res){
//   let userData=req.body
//   if(username != userData.uname){
//     res.status(401).send("invalid username")
//   }else if(password != userData.password){
//     res.status(401).send("invalid password")

//   }else{
//     let payload = {subject:username+password};
//     let token = jwt.sign(payload,'secretkey');
//     res.status(200).send({token})
//   }
// })


// app.get('/products',function(req,res){
// res.header("Access-Control-Allow-Orgin","*") //FROM ANY SERVER WE GET THE "/products" REQUEST WE NEED TO ACCEPT IT
// res.header("Acess-Conrol-Allow-Methods: GET,POST,PATCH,PUT,DELETE,OPTIONS");  //METHODS WE ARE ACCEPTING
// ProductData.find()
// .then(function(products){
//   res.send(products);
// });
// });
// app.post('/insert',verifyToken,function(req,res){
//   res.header("Access-Control-Allow-Orgin","*") //FROM ANY SERVER WE GET THE "/products" REQUEST WE NEED TO ACCEPT IT
//   res.header("Acess-Conrol-Allow-Methods: GET,POST,PATCH,PUT,DELETE,OPTIONS"); 
//   console.log(req.body);
//   var product={
//     productId:req.body.product.productId,
//     productName:req.body.product.productName,
//     productCode:req.body.product.productCode,
//     releaseDate:req.body.product.releaseDate,
//     description:req.body.product.description,
//     price:req.body.product.price,
//     starRating:req.body.product.starRating,
//     imageUrl:req.body.product.imageUrl
//   }
//   var product = new ProductData(product);
//   product.save();
// });
app.listen(3000,function(){
  console.log("listening to port 3000")
});