const express = require('express');
const router = express.Router();
const { DonateData, FindData } = require('./schema');
const cors = require('cors');

router.use(express.json());
router.use(cors());

// Create a new donation
router.post("/donate", async (req, res) => {
  const { 
    full_name, 
    contact, 
    food_cat, 
    food_fresh, 
    food_desc, 
    servings, 
    location, 
    drop_off, 
    add_info 
  } = req.body;
  
  try {
    // Validate required fields
    if (!full_name || !food_cat || !food_fresh) {
      return res.status(400).json({ 
        message: "Full name, food category, and food freshness are required" 
      });
    }
    
    // Create new donation
    const newDonation = new DonateData({
      full_name,
      contact,
      food_cat,
      food_fresh,
      food_desc,
      servings,
      location,
      drop_off,
      add_info
    });
    
    await newDonation.save();
    
    res.status(201).json({
      message: "Donation created successfully",
      donationId: newDonation._id,
      donation: newDonation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create donation"
    });
  }
});

// Helper to compute freshness bucket based on age in hours
const computeFreshness = (createdAt) => {
  const now = Date.now();
  const ageMs = now - new Date(createdAt).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  if (ageHours < 3) return '1-3 hr';
  if (ageHours < 6) return '3-6 hr';
  if (ageHours < 12) return '6-12 hr';
  if (ageHours < 24) return '12+ hr';
  return 'expired';
}

// Get all donations with optional filtering, exclude >24h
router.get("/donations", async (req, res) => {
  const { food_cat, food_fresh, drop_off } = req.query;
  
  try {
    let filter = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
    
    if (food_cat) filter.food_cat = food_cat;
    if (drop_off !== undefined) filter.drop_off = drop_off === 'true';

    const donations = await DonateData.find(filter).sort({ createdAt: -1 });

    const decorated = donations.map((d) => {
      const dynamicFresh = computeFreshness(d.createdAt);
      return {
        ...d.toObject(),
        food_fresh: dynamicFresh
      };
    }).filter((d) => d.food_fresh !== 'expired');

    // Apply food_fresh filter after dynamic computation
    const final = food_fresh ? decorated.filter((d) => d.food_fresh === food_fresh) : decorated;
    
    res.status(200).json({
      message: "Donations fetched successfully",
      count: final.length,
      donations: final
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch donations"
    });
  }
});

// Get a specific donation by ID (if not expired)
router.get("/donations/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const donation = await DonateData.findOne({ _id: id, createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    const dynamicFresh = computeFreshness(donation.createdAt);
    res.status(200).json({
      message: "Donation fetched successfully",
      donation: { ...donation.toObject(), food_fresh: dynamicFresh }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch donation"
    });
  }
});

// Update a donation
router.put("/donations/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  try {
    const updatedDonation = await DonateData.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    res.status(200).json({
      message: "Donation updated successfully",
      donation: updatedDonation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update donation"
    });
  }
});

// Delete a donation
router.delete("/donations/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedDonation = await DonateData.findByIdAndDelete(id);
    
    if (!deletedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    res.status(200).json({
      message: "Donation deleted successfully",
      donation: deletedDonation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete donation"
    });
  }
});

// Create a find request
router.post("/find", async (req, res) => {
  const { filter, curr_location } = req.body;
  
  try {
    const newFind = new FindData({
      filter,
      curr_location
    });
    
    await newFind.save();
    
    res.status(201).json({
      message: "Find request created successfully",
      findId: newFind._id,
      findRequest: newFind
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create find request"
    });
  }
});

// Get all find requests
router.get("/find", async (req, res) => {
  try {
    const findRequests = await FindData.find();
    
    res.status(200).json({
      message: "Find requests fetched successfully",
      count: findRequests.length,
      findRequests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch find requests"
    });
  }
});

// Get donations near a location (basic distance calculation)
router.post("/donations/nearby", async (req, res) => {
  const { lat, lon, maxDistance = 10 } = req.body; // maxDistance in km
  
  try {
    if (!lat || !lon) {
      return res.status(400).json({ 
        message: "Latitude and longitude are required" 
      });
    }
    
    const donations = await DonateData.find({});
    
    // Filter donations by distance (basic calculation)
    const nearbyDonations = donations.filter(donation => {
      if (!donation.location || donation.location.length === 0) {
        return false;
      }
      
      // Use the first location if multiple locations exist
      const donationLat = donation.location[0].lat;
      const donationLon = donation.location[0].lon;
      
      // Simple distance calculation (Haversine formula approximation)
      const R = 6371; // Earth's radius in km
      const dLat = (donationLat - lat) * Math.PI / 180;
      const dLon = (donationLon - lon) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat * Math.PI / 180) * Math.cos(donationLat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance <= maxDistance;
    });
    
    res.status(200).json({
      message: "Nearby donations fetched successfully",
      searchLocation: { lat, lon },
      maxDistance,
      count: nearbyDonations.length,
      donations: nearbyDonations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch nearby donations"
    });
  }
});

// Get donation statistics
router.get("/stats", async (req, res) => {
  try {
    const totalDonations = await DonateData.countDocuments();
    const dropOffAvailable = await DonateData.countDocuments({ drop_off: true });
    const pickupRequired = await DonateData.countDocuments({ drop_off: false });
    
    // Get food category breakdown
    const categoryStats = await DonateData.aggregate([
      { $group: { _id: "$food_cat", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get freshness breakdown
    const freshnessStats = await DonateData.aggregate([
      { $group: { _id: "$food_fresh", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      message: "Statistics fetched successfully",
      stats: {
        totalDonations,
        dropOffAvailable,
        pickupRequired,
        categoryBreakdown: categoryStats,
        freshnessBreakdown: freshnessStats
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch statistics"
    });
  }
});

module.exports = router;
