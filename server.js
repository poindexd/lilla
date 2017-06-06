const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const pug = require('pug');
const config = require('./config');
const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());

app.post('/report', function(req, res){
	console.log(req.body);
	var fn = pug.compileFile('./pug/templates/social_needs/report.pug');
	var html = fn(req.body);

	pdf.create(html, config.html_pdf_options).toBuffer(function(err, buffer) {
		var filename = 'report.pdf';
		if (err){
			console.log(err);
			res.end(500, "Error")
			return;
		}
		res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Content-disposition': 'attachment;filename=' + filename,
			'Content-Length': buffer.length
		})
		res.end(buffer)
	});
})

app.listen(1004, function(){
	console.log('listening on port 1004')
})
