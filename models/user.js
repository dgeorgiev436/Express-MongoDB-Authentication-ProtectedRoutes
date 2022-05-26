const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, "Please enter username"]
	},
	password: {
		type: String,
		required: [true, "Please enter password"]
	}
})

// LECTURE 503
// userSchema.statics.findAndValidate = async function (username, password) {
// 	const foundUser = await this.findOne({username});
// 	if(foundUser){
// 		const hashedPassword = await bcrypt.hash(password, 12);
// 		const user = await new User({username, password:hashedPassword});
// 		await user.save()
// 		return user;
// 	}else{
// 		return false;
// 	}
// }

const User = mongoose.model("User", userSchema);

module.exports = User;