import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [locations, setLocations] = useState([]); // State to store locations
    const [location, setLocation] = useState(''); // Selected location
    const [sqft, setSqft] = useState(''); // Square feet input
    const [bath, setBath] = useState(''); // Number of bathrooms input
    const [bhk, setBhk] = useState(''); // Number of bedrooms input
    const [result, setResult] = useState(''); // Result message

    // Fetch locations from the backend (Flask)
    useEffect(() => {
      const fetchLocations = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/locations',{method : 'GET', headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials':'true'
                }});
                 // Fetch locations from Flask
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json(); // Parse JSON response
                console.log("Fetched Locations:", data); // Log fetched data for debugging
                setLocations(data); // Set the locations state
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
              };
        fetchLocations();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log("clicked")
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', { // Send data to Flask for prediction
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials':'true' // Specify the content type
                },
                body: JSON.stringify({ location, sqft, bath, bhk }),
                 // Convert data to JSON string
            });
            // console.log(body: JSON.stringify({ location, sqft, bath, bhk }))

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json(); // Parse JSON response
            console.log(data)
            setResult(`Predicted Price: ₹${data.toFixed(2)} Lakhs`); // Set the result message
        } catch (error) {
            console.error("There was an error making the request!", error);
        }
    };

    return (
        <div className="master-container">
            <div className="card">
                <h1>Bangalore House Price Prediction</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Location:
                        <select value={location} onChange={(e) => setLocation(e.target.value)} required>
                            <option value="" disabled>Select Location</option>
                            {locations.slice(3).map((loc) => ( // Skip the first 3 locations if needed
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Square Feet:
                        <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} required />
                    </label>

                    <label>
                        Number of Bathrooms:
                        <input type="number" value={bath} onChange={(e) => setBath(e.target.value)} required />
                    </label>

                    <label>
                        BHK:
                        <input type="number" value={bhk} onChange={(e) => setBhk(e.target.value)} required />
                    </label>

                    <button onClick= {handleSubmit} >Predict Price</button>
                </form>
                
                {result && <h2>{result}</h2>} {/* Display result if available */}
                
            </div>
        </div>
    );
}

export default App;