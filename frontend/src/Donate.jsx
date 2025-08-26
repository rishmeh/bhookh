import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from 'react-router-dom';
import './css/Donate.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle click on map
function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

const Donate = () => {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [contact, setContact] = React.useState('');
    const [foodType, setFoodType] = React.useState('');
    const [foodDetails, setFoodDetails] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [foodAge, setFoodAge] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [dropOff, setDropOff] = React.useState('yes');
    const [specialInstructions, setSpecialInstructions] = React.useState('');

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();

        if (!name || !contact || !foodType || !foodDetails || !location || !foodAge || !quantity) {
            alert("Please fill in all required fields and select a location on the map.");
            return;
        }

        try {
            const apiBase = import.meta.env.VITE_API_BASE || '/api';
            const response = await fetch(`${apiBase.replace(/\/$/, '')}/donate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: name,
                    contact: Number(contact),
                    food_cat: foodType,
                    food_fresh: foodAge,
                    food_desc: foodDetails,
                    servings: quantity,
                    location: [{ lat: location.lat, lon: location.lng }],
                    drop_off: dropOff === 'yes',
                    add_info: specialInstructions
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ message: 'Failed to submit donation' }));
                throw new Error(err.message || 'Failed to submit donation');
            }

            await response.json();
            alert('Thank you for your donation!');

            setName('');
            setContact('');
            setFoodType('');
            setFoodDetails('');
            setLocation('');
            setFoodAge('');
            setQuantity(1);
            setDropOff('yes');
            setSpecialInstructions('');
        } catch (e) {
            alert(e.message || 'Something went wrong');
            console.error(e);
        }
    };

    const handleContactChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // remove non-digits
        if (value.length <= 10) setContact(value);
    };

    return (
        <>
            <div className="donate-container">
                <div className="donate-wrapper">
                    {/* Navigation Back Button */}
                    <div className="nav-back">
                        <button 
                            onClick={() => navigate('/')}
                            className="back-button"
                        >
                            ← Back to Home
                        </button>
                    </div>

                    {/* Header Section */}
                    <div className="donate-header">
                        <h1 className="donate-title">
                            🍽️ Share Food, Share Love
                        </h1>
                        <p className="donate-subtitle">
                            Help us fight food waste and hunger by donating your surplus food to those in need. 
                            Every donation makes a difference in someone's life.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="donate-card">
                        <div>
                            {/* Personal Information Section */}
                            <div className="form-section">
                                <h2 className="section-header">
                                    <span className="section-number green">1</span>
                                    Personal Information
                                </h2>
                                
                                <div className="form-grid two-columns">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">
                                            Full Name *
                                        </label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            required 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-input"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact" className="form-label">
                                            Contact Number *
                                        </label>
                                        <input 
                                            type="tel" 
                                            pattern="[0-9]{10}"
                                            id="contact" 
                                            name="contact" 
                                            required 
                                            value={contact} 
                                            onChange={(e) => handleContactChange(e)}
                                            className="form-input"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Food Information Section */}
                            <div className="form-section">
                                <h2 className="section-header">
                                    <span className="section-number blue">2</span>
                                    Food Details
                                </h2>
                                
                                <div className="form-grid two-columns">
                                    <div className="form-group">
                                        <label htmlFor='foodType' className="form-label">
                                            Food Category *
                                        </label>
                                        <select 
                                            id="foodType" 
                                            name="foodType" 
                                            required 
                                            value={foodType} 
                                            onChange={(e) => setFoodType(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Select food category</option>
                                            <option value="dairy">🥛 Dairy & Milk Products</option>
                                            <option value="curry">🍛 Cooked Meals & Curries</option>
                                            <option value="bread">🍞 Bread & Bakery Items</option>
                                            <option value="snacks">🍪 Snacks & Packaged Food</option>
                                            <option value="fruits">🍎 Fresh Fruits</option>
                                            <option value="vegetable">🥕 Fresh Vegetables</option>
                                            <option value="non-vegetarian">🍖 Non-Vegetarian Items</option>
                                            <option value="vegan">🌱 Vegan & Plant-Based</option>
                                            <option value="other">📦 Other Food Items</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor='foodAge' className="form-label">
                                            Food Freshness *
                                        </label>
                                        <select 
                                            name="foodAge" 
                                            value={foodAge} 
                                            onChange={(e) => setFoodAge(e.target.value)} 
                                            required
                                            className="form-select"
                                        >
                                            <option value="">Select freshness</option>
                                            <option value="1-3 hr">🟢 Fresh (1–3 hr)</option>
                                            <option value="3-6 hr">🟡 3–6 hr</option>
                                            <option value="6-12 hr">🟠 6–12 hr</option>
                                            <option value="12+ hr">🔴 12+ hr</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="foodDetails" className="form-label">
                                        Food Description *
                                    </label>
                                    <textarea 
                                        id="foodDetails" 
                                        name="foodDetails" 
                                        required 
                                        rows="4"
                                        value={foodDetails} 
                                        onChange={(e) => setFoodDetails(e.target.value)}
                                        className="form-textarea"
                                        placeholder="Describe the food items, ingredients, preparation method, packaging, and any other relevant details..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="quantity" className="form-label">
                                        Estimated Servings *
                                    </label>
                                    <select 
                                        name="quantity" 
                                        value={quantity} 
                                        onChange={(e) => setQuantity(e.target.value)} 
                                        required
                                        className="form-select"
                                    >
                                        <option value="">Select serving size</option>
                                        <option value="1-10">👤 1–10 people</option>
                                        <option value="10-30">👥 10–30 people</option>
                                        <option value="30-70">👪 30–70 people</option>
                                        <option value="70-150">🏢 70–150 people</option>
                                        <option value="150+">🏟️ 150+ people</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="form-section">
                                <h2 className="section-header">
                                    <span className="section-number orange">3</span>
                                    Location Details
                                </h2>
                                
                                <div className="form-group">
                                    <label className="form-label">
                                        Select Your Location *
                                    </label>
                                    <div className="map-instruction">
                                        📍 Click on the map below to mark your exact location for food pickup or drop-off
                                    </div>
                                </div>
                                
                                <div className="map-container">
                                    <MapContainer
                                        center={[20.5937, 78.9629]}
                                        zoom={5}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <LocationPicker setLocation={setLocation} />
                                        {location && <Marker position={location}></Marker>}
                                    </MapContainer>
                                </div>

                                <div className="form-group">
                                    <label htmlFor='dropOff' className="form-label">
                                        Can you drop off the food to a nearby collection point? *
                                    </label>
                                    <select 
                                        id="dropOff" 
                                        name="dropOff" 
                                        required 
                                        value={dropOff} 
                                        onChange={(e) => setDropOff(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="yes">✅ Yes, I can drop off</option>
                                        <option value="no">❌ No, please arrange pickup</option>
                                    </select>
                                </div>
                            </div>

                            {/* Additional Information Section */}
                            <div className="form-section">
                                <h2 className="section-header">
                                    <span className="section-number purple">4</span>
                                    Additional Information
                                </h2>
                                
                                <div className="form-group">
                                    <label htmlFor="specialInstructions" className="form-label">
                                        Special Instructions (Optional)
                                    </label>
                                    <textarea 
                                        id="specialInstructions" 
                                        name="specialInstructions" 
                                        rows="3"
                                        value={specialInstructions} 
                                        onChange={(e) => setSpecialInstructions(e.target.value)}
                                        className="form-textarea"
                                        placeholder="Any special handling instructions, dietary information, allergens, storage requirements, or additional notes..."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="button"
                                onClick={handleSubmit}
                                className="submit-button"
                            >
                                🚀 Submit Donation
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="donate-footer">
                        <p>💚 Thank you for helping us reduce food waste and feed those in need! Your generosity makes a real difference.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Donate;