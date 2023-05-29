const express = require('express');
const router = express.Router();
const db = require('../server/firebase_admin')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express4' });
});

router.post('/create', async(req, res, next) =>{
    // console.log(req.body)
    const id = req.body.email
    const dataJson = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    const docRef = db.collection('users').doc(id);
    const response = await docRef.set(dataJson);

    if (response) {
      const snapshot = await docRef.get();
      if (snapshot.exists) {
        const data = snapshot.data();
        res.send({
          success: true,
          result: data,
          message: '資料讀取成功'
        });
      } else {
        res.send({
          success: false,
          result: null,
          message: '找不到指定的文檔'
        });
      }
    } else {
      res.send({
        success: false,
        result: null,
        message: '資料寫入失敗'
      });
  }
});


router.get('/read/all', async(req, res)=>{
  try {
    const usersRef = db.collection('users')
    const response = await usersRef.get()
    let responseArr = []
    response.forEach(doc =>{
      responseArr.push(doc.data())
    })
    res.send(responseArr);
  } catch (error) {
    res.send(error);
  }
})

router.get('/read/:id', async(req, res)=>{
  try {
    const userRef = db.collection('users').doc(req.params.id)
    const response = await userRef.get()
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
})

router.post('/update', async(req, res)=>{
  try {
    const id = req.body.id
    const newFirstName = 'Hello world!!'
    const userRef = await db.collection('users').doc(id)
    .update({
      firstName: newFirstName,
    })
    res.send(userRef);
  } catch (error) {
    res.send(error);
  }
})


router.delete('/delete/:id', async(req, res)=>{
  try {
    const id = req.params.id
    const response = await db.collection('users').doc(id).delete();
    console.log(id,response)
    res.send({
          success: true,
          result: id,response,
          message: '資料刪除成功'
        });
  } catch (error) {
    res.send({
        success: false,
        result: null,
        message: '資料刪除失敗'
      });
  }
})



router.get('/archives', function(req, res, next) {
  res.render('archives', { title: 'Express4' });
});


router.get('/categories', function(req, res, next) {
  res.render('categories', { title: 'Express4' });
});
router.get('/article', function(req, res, next) {
  res.render('article', { title: 'Express4' });
});
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express4' });
});
router.get('/youtube', function(req, res, next) {
  res.render('youtube', { title: 'Express4' });
});


module.exports = router;
