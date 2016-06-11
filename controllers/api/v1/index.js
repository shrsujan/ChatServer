'use strict';

module.exports = function(app){
	require('./login')(app);
	require('./users')(app);
	app.get('/404', function(req, res, next){
		res.render('404');
	});
}