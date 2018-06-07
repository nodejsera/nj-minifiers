var express =  require('express');
var bodyParser = require('body-parser');
var UglifyJS = require("uglify-js");
var fs = require('fs');
var app = express();


app.get('/', function(req,res){
    res.set({
        'Access-Control-Allow-Origin' :'*'
    });
    return res.redirect('views/nj-minifyjs.html');
})

app.use('/views', express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

var minifyjs = (content) => {
				console.log("Content in minifyjs : " + content);
				var result = UglifyJS.minify(content);
				console.log("result" + result.code);
				if(result.error){
					console.log(result.error);	// runtime error, or `undefined` if no error
					return result.error
				}else{
					return result.code 			// minified output
				}
				
                
}

app.post('/minify', function(req,res){
    var content = req.body.content; 
	console.log("CONTENT FROM FRONTEND : " + content);
    
    var minify = minifyjs(content);
	console.log("minify :" + minify);
	const pug = require('pug'); 
                // Compile the source code
    const compiledFunction = pug.compileFile('views/hashed.pug');
    reshash = compiledFunction({
        minified : minify
    }); 
    res.send(reshash);

})

app.listen(process.env.PORT || 3000,function(){
	console.log("App listening at 3000");
});
