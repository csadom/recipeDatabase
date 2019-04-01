const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Recipe
let Recipe = new Schema({
	receptCim: String,
	elkeszitesiIdo: Number,
	kaloria: Number,
	evszak: [String],
	unnep: [String],
	dieta: [String],
	menu: [String],
	napszak: [String],
	technika: [String],
	hozzavalok: [
		{
			name:String,
				alapanyagok:[
				{
					name: String,
					mennyiseg: String,
					mertekegyseg: String	
				},
				]
		}
	], 
	elkeszites: {
		step: [
			{
				text:String,
			}
		]
	}
},{
    collection: 'recipes'
});

module.exports = mongoose.model('Recipe', Recipe);
