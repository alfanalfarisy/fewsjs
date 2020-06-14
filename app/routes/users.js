var express = require('express');
var crypto = require('crypto');
var User = require('../models/users');
var Auth_mdw = require('../middlewares/auth');
var mongoose = require('mongoose');
const Subscription = mongoose.model('Subscribers');

var router = express.Router();
var secret = 'projek20';
var session_store;

var default_password = crypto.createHmac('sha256', secret)
                   .update('default')
                   .digest('hex');


router.get('/logout', function(req, res){
    req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/');
    }
  });
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});


router.post('/login', function(req, res, next) {
  session_store = req.session;
  // var password = crypto.createHmac('sha256', secret)
  //                  .update(req.param('password'))
  //                  .digest('hex');

  if (req.param('username') == ""  || req.param('password') == "")
  {
      req.flash('info', 'Punten, tidak boleh ada field yang kosong!');
      res.redirect('/users/login');
  }
  else 
  {
      User.find({ username: req.param('username'), password:req.param('password') }, function(err, user) {
      if (err) throw err;

      if (user.length > 0)
      {
          session_store.profile = user[0];
          session_store.username = user[0].username;
          session_store.email = user[0].email;
          session_store.admin = user[0].admin;
          session_store.logged_in = true;

          res.redirect('/');
      }
      else 
      {
          req.flash('msg_error', 'Sepertinya akun Anda salah!');
          res.redirect('/users/login');
      }

    });
  } 
});


// router.get('/', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
router.get('/',Auth_mdw.check_login, function(req, res, next) {
    title='FEWS | Account'
    title1='FEWS | Users'
    session_store = req.session;
    if(session_store.admin){
      // console.log('admin')
      User.find({},function(err, user){
          // console.log(user);
          res.render('users/index', { session_store:session_store, users: JSON.stringify(user) ,title:title});
      })
    }else{
      // console.log('anonym')
      User.find({'username':session_store.username},function(err, user){
        // console.log(user);
        res.render('admin/index', { session_store:session_store, users: JSON.stringify(user) ,title:title1});
      })
    }
    // .select('_id username email firstname lastname admin createdAt updatedAt');
});

router.get('/signup',function(req,res,next){
    // res.render('users/signup')
    title='FEWS | SIGNUP'
    res.render('users/add', { session_store:session_store,title:title });
})
// router.get('/add', function(req, res, next) {
// //     session_store = req.session;
// // 
//     res.render('users/add', { session_store:session_store });
// });

router.post('/add',function (req, res, next){
    session_store = req.session;

    req.assert('username', 'Nama diperlukan').withMessage('Username harus di isi').notEmpty().isLength({ min: 8 });
    req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
    req.assert('firstname', 'Nama depan harus terdiri dari huruf').isAlpha().notEmpty();
    req.assert('lastname', 'Nama belakang harus terdiri huruf');
    req.assert('kontak', 'Kontak harus terdiri dari angka').isNumeric().notEmpty();
    req.assert('password', 'Password harus minimal 8 character').notEmpty().isLength({ min: 8 });

    var errors = req.validationErrors();  
    console.log(errors);

    if (!errors)
    {
        v_username = req.sanitize( 'username' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_firstname = req.sanitize( 'firstname' ).escape().trim();
        v_lastname = req.sanitize( 'lastname' ).escape().trim();
        v_kontak = req.sanitize( 'kontak' ).escape().trim();
        v_password = req.sanitize( 'password' ).escape().trim();

        User.find({$or:[{username:req.param('username')},{email:req.param('email')},{no:req.param('kontak')}]}, function (err, user){
            if (user.length == 0)
            {
                var admin = new User({
                    username: v_username,
                    email: v_email,
                    password: v_password,
                    firstname: v_firstname,
                    lastname: v_lastname,
                    no: v_kontak,
                    admin: false,
                });

                admin.save(function(err) {
                    if (err) 
                    {
                        console.log(err);

                        req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami');
                        res.redirect('/users/login');
                    }
                    else
                    {
                        req.flash('msg_info', 'Akun Anda berhasil dibuat!');
                        res.redirect('/users/login');
                    }
                });
            }
            else
            {
                req.flash('msg_error', 'Punten, Username/ Email/ No HP sudah digunakan!');
                res.render('users/add', { 
                    session_store:session_store,
                    username: req.param('username'),
                    email: req.param('email'),
                    firstname: req.param('firstname'),
                    lastname: req.param('lastname'),
                    kontak: req.param('kontak'),
                });
            }
        });
    }
    else
    {   
        // menampilkan pesan error
        errors_detail = "<p>Punten, sepertinya ada salah pengisian, mohon check lagi formnyah!</p><ul>";

        for (i in errors)
        {
            error = errors[i];
            errors_detail += '<li>'+error.msg+'</li>';
        }

        errors_detail += "</ul>";

        req.flash('msg_error', errors_detail);
        res.render('users/add', {
            session_store: session_store, 
            username: req.param('username'),
            email: req.param('email'),
            firstname: req.param('firstname'),
            lastname: req.param('lastname'),
            kontak: req.param('kontak'),
        });
    }

});
// router.get('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
//     session_store = req.session;

//     User.findOne({_id:req.params.id}, function (err, user){
//         if (user)
//         {
//             console.log(user);

//             res.render('users/edit', { session_store:session_store, user: user });
//         }
//         else
//         {
//             req.flash('msg_error', 'Punten, user tidak ditemukan!');
//             res.redirect('/users');
//         }
//     });
// });

// router.put('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function (req, res, next){
//     session_store = req.session;

//     req.assert('username', 'Nama diperlukan').isAlpha().withMessage('Username harus terdiri dari angka dan huruf').notEmpty();
//     req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
//     req.assert('firstname', 'Nama depan harus terdiri dari angka dan huruf').isAlpha();
//     req.assert('lastname', 'Nama belakang harus terdiri dari angka dan huruf').isAlpha();

//     var errors = req.validationErrors();  
//     console.log(errors);

//     if (!errors)
//     {
//         v_username = req.sanitize( 'username' ).escape().trim();
//         v_email = req.sanitize( 'email' ).escape().trim();
//         v_firstname = req.sanitize( 'firstname' ).escape().trim();
//         v_lastname = req.sanitize( 'lastname' ).escape().trim();
//         v_admin = req.sanitize( 'admin' ).escape().trim();

//         User.findById(req.params.id, function(err, user){
//             user.username = req.param('username');
//             user.email = req.param('email');
//             user.firstname = req.param('firstname');
//             user.lastname = req.param('lastname');
//             user.admin = req.param('admin');

//             user.save(function(err, user){
//                 if (err) 
//                 {
//                     req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
//                 }
//                 else
//                 {
//                     req.flash('msg_info', 'Edit user berhasil!');
//                 }

//                 res.redirect('/users/edit/'+req.params.id);

//             });
//         });
//     }
//     else
//     {   
//         // menampilkan pesan error
//         errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";

//         for (i in errors)
//         {
//             error = errors[i];
//             errors_detail += '<li>'+error.msg+'</li>';
//         }

//         errors_detail += "</ul>";

//         req.flash('msg_error', errors_detail);
//         res.render('users/edit', {
//             _id: req.params.id, 
//             session_store: session_store, 
//             username: req.param('username'),
//             email: req.param('email'),
//             firstname: req.param('firstname'),
//             lastname: req.param('lastname'),
//         });
//     }

// });

// router.delete('/delete/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function (req, res, next){
//     User.findById(req.params.id, function(err, user){
//         user.remove(function(err, user){
//             if (err) 
//             {
//                 req.flash('msg_error', 'Punten, sepertinya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
//             }
//             else
//             {
//                 req.flash('msg_info', 'Hapus user berhasil!');
//             }
//             res.redirect('/users');
//         });
//     });
// });
    router.post('/subscribe', (req, res) => {
        const subscriptionModel = new Subscription(req.body);
        subscriptionModel.save((err, subscription) => {
            if (err) {
                console.error(`Error occurred while saving subscription. Err: ${err}`);
                res.status(500).json({
                    error: 'Technical error occurred'
                });
            } else {
                res.json({
                    data: 'Subscription saved.'
                });
            }
        });
    });


module.exports = router;