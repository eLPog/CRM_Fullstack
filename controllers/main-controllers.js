class MainControllers {
/*
Response to a home page request
 */
showHomePage(req, res){
    res.render('home')
}
}

module.exports = new MainControllers();