const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Recipe
let Group = new Schema({
	recipes: [
			id:String
	]
},{
    collection: 'groups'
});

module.exports = mongoose.model('Group', Group);
