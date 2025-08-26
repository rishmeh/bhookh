import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './css/Find.css'; 
import { useNavigate } from 'react-router-dom';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons for different location types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const Find = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/donations');
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Failed to load donations' }));
          throw new Error(err.message || 'Failed to load donations');
        }
        const data = await res.json();
        const transformed = (data.donations || []).map((d) => ({
          id: d._id,
          name: d.full_name || 'Donor',
          type: d.food_cat || 'Donation',
          address: d.add_info || '',
          coordinates: d.location && d.location[0] ? [d.location[0].lat, d.location[0].lon] : null,
          status: d.drop_off ? 'Drop-off available' : 'Pickup required',
          capacity: d.servings || 'N/A',
          contact: d.contact ? String(d.contact) : '',
          freshness: d.food_fresh || '',
          description: d.food_desc || '',
          color: d.drop_off ? '#10b981' : '#ef4444'
        })).filter((d) => Array.isArray(d.coordinates));
        setLocations(transformed);
        setError('');
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [filterType, setFilterType] = React.useState('All');

  const filteredLocations = filterType === 'All' 
    ? locations 
    : locations.filter(loc => loc.type === filterType);

  const locationTypes = ['All', ...new Set(locations.map(loc => loc.type))];

  const getCapacityIcon = (capacity) => {
    switch(capacity) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  const getFreshnessClass = (freshness) => {
    if (!freshness) return 'freshness-12p';
    if (freshness === '1-3 hr') return 'freshness-13';
    if (freshness === '3-6 hr') return 'freshness-36';
    if (freshness === '6-12 hr') return 'freshness-612';
    return 'freshness-12p';
  };

  return (
    <>
      <div className="locations-container">
        {error && (
          <div className="nav-back" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}
        {loading && (
          <div className="nav-back" style={{ marginBottom: '1rem' }}>Loading donations...</div>
        )}
        {/* Navigation Back Button */}
        <div className="nav-back">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>

        {/* Header */}
        <div className="locations-header">
          <div className="header-content">
            <h1 className="main-title">🗺️ Food Collection Locations</h1>
            <p className="subtitle">Find nearby food donation centers and collection points</p>
            
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-number">{locations.length}</div>
                <div className="stat-label">Active Locations</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{locationTypes.length - 1}</div>
                <div className="stat-label">Location Types</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Available Service</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="filter-section">
              <h3 className="filter-title">Filter by Type</h3>
              <select 
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {locationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="locations-list">
              <h3 className="filter-title">Locations ({filteredLocations.length})</h3>
              {filteredLocations.map(location => (
                <div 
                  key={location.id}
                  className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="location-name">{location.name}</div>
                  <span className="location-type">{location.type}</span>
                  <div className="location-address">📍 {location.address}</div>
                  <div className="location-details">
                    <span className="status-badge">
                      ✅ {location.status}
                    </span>
                    <span className={`freshness-badge ${getFreshnessClass(location.freshness)}`}>
                      ⏱ {location.freshness || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="map-container">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredLocations.map(location => (
                <Marker 
                  key={location.id}
                  position={location.coordinates}
                  icon={createCustomIcon(location.color)}
                >
                  <Popup>
                    <div className="popup-content">
                      <div className="popup-title">{location.name}</div>
                      <span className="popup-type">{location.type}</span>
                      
                      <div className="popup-detail">
                        <span className="popup-label">Address: </span>
                        <span className="popup-value">{location.address}</span>
                      </div>
                      
                      <div className="popup-detail">
                        <span className="popup-label">Freshness: </span>
                        <span className={`freshness-badge ${getFreshnessClass(location.freshness)}`}>
                          ⏱ {location.freshness || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="popup-detail">
                        <span className="popup-label">Contact: </span>
                        <span className="popup-value">{location.contact}</span>
                      </div>
                      
                      <div className="popup-detail">
                        <span className="popup-label">Capacity: </span>
                        <span className="capacity-badge">
                          {getCapacityIcon(location.capacity)} {location.capacity}
                        </span>
                      </div>
                      
                      <div className="popup-detail" style={{marginTop: '0.5rem', fontStyle: 'italic'}}>
                        {location.description}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Find;