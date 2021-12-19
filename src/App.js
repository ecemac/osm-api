import React, { useEffect, useState } from "react";
import "./App.css";
import osmtogeojson from "osmtogeojson";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

function App() {
  const [featureCollection, setFeatureCollection] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [latInput, setLatInput] = useState(52.520008);
  const [longInput, setLongInput] = useState(13.404954);
  const [position, setPosition] = useState([52.520008, 13.404954]);
  const [bbox, setBbox] = useState([]);
  const [loading, setLoading] = useState(true);

  const findBbox = (long, lat) => {
    let left = long - 0.0025;
    let bottom = lat - 0.0025;
    let right = long + 0.0025;
    let top = lat + 0.0025;

    let newBbox = [left, bottom, right, top];
    setBbox(newBbox);
  };

  useEffect(() => {
    findBbox(position[1], position[0]);
  }, [position]);

  useEffect(() => {
    if (bbox.length > 0) {
      setLoading(true);
      fetch(
        `https://www.openstreetmap.org/api/0.6/map?bbox=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          let osm = osmtogeojson(data);
          setFeatureCollection(osm);
          setLoading(false);
        });
    }
  }, [bbox]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let lat = parseFloat(latInput);
    let long = parseFloat(longInput);
    setPosition([lat, long]);
  };

  function LocationMarker({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    useMapEvents({
      click(e) {
        let { lat, lng } = e.latlng;
        let newPosition = [lat, lng];
        setPosition(newPosition);
      },
    });

    return (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <div id="map">
      <MapContainer center={position} zoom={12}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker center={position} zoom={12} />
      </MapContainer>
      <div className="search-container">
        <form className="search-coordinates" onSubmit={(e) => handleSubmit(e)}>
          <label>
            Lat:
            <input
              type="text"
              name="lat"
              defaultValue={latInput}
              onChange={(e) => setLatInput(e.target.value)}
            />
          </label>
          <label>
            Long:
            <input
              type="text"
              name="long"
              defaultValue={longInput}
              onChange={(e) => setLongInput(e.target.value)}
            />
          </label>
          <input type="submit" value="Go" />
        </form>
        <div className="osm-infos">
          {featureCollection.features.length > 0 &&
            !loading &&
            featureCollection.features.map(
              (f) =>
                f.properties.hasOwnProperty("name") && (
                  <div className="info" key={f.id}>
                    <button>{f.properties.name}</button>
                    <p>{f.properties.locality}</p>
                    <p>{f.properties.description}</p>
                    <p>{f.properties.route}</p>
                    <p>{f.properties.website}</p>
                  </div>
                )
            )}
          {!loading && featureCollection.length === 0 && <p>No result.</p>}
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
