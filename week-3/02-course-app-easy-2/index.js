const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

let ADMINS = []
let COURSES = [];
const key = "mySecret"

const generateJwt = (user) => {
	const payload = {username : user.username}
	return jwt.sign(payload,key,{expiresIn:'1h'});
};

const authenticateJwt = (req,res,next) =>{
	const authHeader = req.headers.authorization
	if(authHeader){
		const token = authHeader.split(' ')[1];
		// console.log(token);
		jwt.verify(token,key,(err,user) =>{
			if(err) {
				return res.sendStatus(401);
			}
			req.body.user = user;
			next();
		});
	}
	else{
		res.sendStatus(401);
	}
}

app.post('/admin/signup',(req,res) => {
	const admin = req.body;
	const existingAdmin = ADMINS.find(a=>a.username == admin.username);
	if(existingAdmin){
		res.send("Admin Already Exist")
	}
	else
	{
		ADMINS.push(admin)
		const token = generateJwt(admin);
		res.json({"Message":"Admin Created Successfully",token});
	}
});

app.post('/admin/login',(req,res) => {
	const admin = req.headers;
	const existingAdmin = ADMINS.find(a=>a.username == admin.username && a.password == admin.password);
	if(existingAdmin){
		const token = generateJwt(admin);
		res.json({"Message":"Logged In Successfully",token});
	}
	else{
		res.send("Admin authentication failed")
	}
});


app.post('/admin/courses', authenticateJwt, (req, res) => {
	const course = req.body;
	course.id = COURSES.length + 1; 
	COURSES.push(course);
	res.json({ message: 'Course created successfully', courseId: course.id });
  });


app.listen(3000, () => {
	console.log('Server is listening on port 3000');
  });
