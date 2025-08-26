const mongoose = require('mongoose');

const locationScheme = new mongoose.Schema({
  lat: {type: Number, required: true},
  lon: {type: Number, required: true}
})
// Schema for classes
const DonateSchema = new mongoose.Schema({
  full_name: {
    type: String, required: true
  },
  contact:{
    type: Number, default: 9999999999
  },
  food_cat:{
    type: String, required: true
  },
  food_fresh:{
    type: String, required: true
  },
  food_desc:{
    type: String
  },
  servings:{
    type: String
  },
  location:{
    type: [locationScheme], default: []
  },
  drop_off:{
    type: Boolean, default: false
  },
  add_info:{
    type: String, required: false
  }
}, { timestamps: true })

// Automatically delete donations 24 hours after creation
DonateSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });



const DonateData = mongoose.model('Donate', DonateSchema);

const FindSchema = new mongoose.Schema({
  filter:{
    type: String, default: "All"
  },
  curr_location:{
    type: locationScheme, default: []
  }
})

const FindData = mongoose.model('Find', FindSchema);



module.exports = {DonateData, FindData};