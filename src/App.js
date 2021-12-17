import React, { useEffect, useState } from "react";
import "./App.css";
import osmtogeojson from "osmtogeojson";
import DeckGL from "@deck.gl/react";
import { EditableGeoJsonLayer, DrawPolygonMode } from "nebula.gl";
import { StaticMap } from "react-map-gl";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZWNlbWFjIiwiYSI6ImNreGF5djhzbzA5ZHkycnBkODByZHZob2MifQ.qqHky7ydWDMi0C48FTHX8A";

const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12,
};

function App() {
  const [featureCollection, setFeatureCollection] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [selectedFeatureIndexes] = useState([]);

  /* useEffect(() => {
    fetch("https://www.openstreetmap.org/api/0.6/map?bbox=-0.4,51,0.2,51", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let osm = osmtogeojson(data);
        setFeatureCollection(osm);
      });
  }, []); */

  console.log("OSM: ", featureCollection);

  const layer = new EditableGeoJsonLayer({
    data: featureCollection,
    mode: DrawPolygonMode,
    selectedFeatureIndexes,
    onEdit: ({ updatedData }) => {
      setFeatureCollection(updatedData);
    },
  });

  console.log("selected index: ", selectedFeatureIndexes);

  return (
    <div className="App">
      <DeckGL
        initialViewState={initialViewState}
        controller={{
          doubleClickZoom: false,
        }}
        layers={[layer]}
        getCursor={layer.getCursor.bind(layer)}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    </div>
  );
}

export default App;
