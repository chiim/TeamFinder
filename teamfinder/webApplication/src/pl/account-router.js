



app.get('/login', function(request, response){
    response.render("login.hbs")
  })
  
  app.post('/login', function(request, response){
    response.redirect("/")
  })
  
  app.get('/register', function(request, response) {
    response.render("register.hbs")
  })