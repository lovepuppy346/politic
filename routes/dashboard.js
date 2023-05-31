const express = require('express');
const router = express.Router();
const db = require('../server/firebase_admin')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Express4' });
});

//archives
router.get('/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'archives' });
});

//categories
router.get('/categories', async(req, res, next)=> {
  try{
    const messages = req.flash('info')
    const categoriesRef =  db.collection('categories')
    const response = await categoriesRef.get();
    let responseArr = []
    response.forEach((doc) =>{
      responseArr.push(doc.data())
    })
    res.render('dashboard/categories', { 
        title: 'categories',
        messages,
        hasInfo: messages.length > 0 ,
        categories:responseArr
       });
  } catch (error) {
    res.send(error);
  }
});
router.post('/categories/create', async(req, res, next)=> {
  try {
    const data = req.body
    // console.log(data)
    const categoriesRef = await db.collection('categories').doc(); // 自动生成唯一 ID
    const key = categoriesRef.id
    data.id = key
    const snapshot = await db.collection('categories').where('path', '==', data.path).get();
    if(!snapshot.empty){
      req.flash('info','已有相同路徑')
      res.redirect('/dashboard/categories')
    }else{
      categoriesRef.set(data);
      // console.log(key)
      // res.send({
      //     success: true,
      //     result: data,
      //     message: 'Category created successfully類別新增成功'
      //   });
        res.redirect('/dashboard/categories')
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      result: null,
      message: '類別新增失敗'
    });
  }
});
router.post('/categories/delete/:id', async(req, res, next)=> {
  try {
    const id = req.params.id
    // console.log('id',id)
    const categoryRef = await db.collection('categories').doc(id).delete();
    // console.log(categoryRef)
    req.flash('info','欄位已刪除')
    res.redirect('/dashboard/categories')
  } catch (error) {
    res.status(500).send({
      success: false,
      result: null,
      message: '類別刪除失敗'
    });
  }
})

//article
router.get('/article/create', async(req, res, next) =>{
 try {
   const categoriesRef = db.collection('categories')
    const categoryRef = await categoriesRef.get();
    let categoryData = []
    categoryRef.forEach((doc) =>{
      categoryData.push(doc.data())
    })
    // console.log(responseArr)

  res.render('dashboard/article', { 
    title: ' Article',
    categoryData,
    article: {}, // 如果是创建新文章页面，将 article 设置为空对象
    isNew: true // 设置 isNew 变量为 true，表示新增页面
  });
 } catch (error) {
  res.status(500).send({
      success: false,
      result: null,
      message: '文章讀取失敗'
    });
 }
});

router.get('/article/:id', async(req, res, next) =>{
    try {
      const id = req.params.id;
      // console.log(id)
      const categoriesSnapshot = await db.collection('categories').get();
      const articlesSnapshot = await db.collection('article').doc(id).get();
      const categoriesData = [];
      categoriesSnapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        categoriesData.push(doc.data());
      });
      const articleData = articlesSnapshot.data();
      // console.log(categoriesData);
      console.log(articleData);
     

      res.render('dashboard/article', {
        title:'article',
        categories: categoriesData,
        article: articleData,
        isNew: false // 设置 isNew 变量为 false，表示编辑页面
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to fetch data');
    }
    
});

router.post('/article/create', async(req, res, next) =>{
  try {
    // console.log(req.body)
    const data = req.body
    const articlesRef =  await db.collection('article')
    const articleRef = articlesRef.doc(); // 自动生成唯一 ID
    const key = articleRef.id
    const updateTime = Math.floor(Date.now() / 1000); //取整數
    data.id = key
    data.updateTime = updateTime
    console.log(data)
    articleRef.set(data)
    res.redirect(`/dashboard/article/${key}`);
  } catch (error) {
    res.status(500).send({
      success: false,
      result: null,
      message: '文章新增失敗'
    });
  }
  

})

//youtube
router.get('/youtube', function(req, res, next) {
  res.render('dashboard/youtube', { title: 'youtube' });
});
module.exports = router;
