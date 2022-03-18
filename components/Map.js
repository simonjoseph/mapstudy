import React, { useState, useCallback, useEffect } from "react";
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer
} from "react-leaflet";
import { Text, Badge, Card } from "@sanity/ui";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import CommunityIcon from "./CommunityIcon";
import { EditOnlyControl, DrawOnlyControl } from "./EditControl";
import EventsTracker from "./EventsTracker";
import { useSearch } from "./SearchWrapper";

const center = [52.4912, -1.9348];

const Map = () => {
  const { people, filterState, setFilterState } = useSearch();

  const [map, setMap] = useState(null);
  const [iconSize, setIconSize] = useState(45);
  const [shapes, setShapes] = useState([]);
  const [geos, setGeos] = useState([]);
  const [action, setAction] = useState(null);
  const [patches, setPatches] = useState([]);

  useEffect(() => {
    setFilterState({
      ...filterState,
      mapLocations: geos
    });
    // eslint-disable-next-line
  }, [geos]);

  useEffect(() => {
    if (patches.length > 0) {
      let geoItems = [...geos];
      let shapeItems = [...shapes];

      patches.map((patch) => {
        const index = shapeItems.indexOf(patch._leaflet_id);

        if (index >= 0) {
          if (action === "remove") {
            geoItems.splice(index, 1);
            shapeItems.splice(index, 1);
          } else {
            geoItems[index] = patch.toGeoJSON().geometry;
          }
        }
      });

      setGeos(geoItems);
      setShapes(shapeItems);
      setPatches([]);
      setAction(null);
    }
  }, [patches]);

  const onCreated = useCallback((evt) => {
    setGeos((geos) => [...geos, evt.layer.toGeoJSON().geometry]);
    setShapes((shapes) => [...shapes, evt.layer._leaflet_id]);
  }, []);

  const onEdited = useCallback((evt) => {
    const layers = evt.layers.getLayers();
    setPatches(layers);
  }, []);

  const onDeleted = useCallback((evt) => {
    const layers = evt.layers.getLayers();
    setAction("remove");
    setPatches(layers);
  }, []);

  const averageScore =
    people.reduce(
      (totalScore, curPerson) => totalScore + (curPerson?._score || 0),
      0
    ) / people.length;

  return (
    <MapContainer
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{
        height: "calc(100vh - 12em)",
        minHeight: "400px",
        width: "100%",
        minWidth: "200px",
        boxSizing: "border-box"
      }}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {people.length > 0 &&
        people.map(
          ({ _id, _score, geolocation, name, photo, handle, headline }) => (
            <Marker
              icon={CommunityIcon(
                photo,
                // Change the icon size according to current person's _score
                // From 80% to 120% of the size, depending on averageScore of all people
                _score
                  ? iconSize *
                      Math.max(Math.min(_score / averageScore, 1.2), 0.8)
                  : iconSize
              )}
              key={_id}
              position={[geolocation.lat, geolocation.lng]}
            >
              <Popup>
                <Card scheme="light">
                  {typeof _score === "number" && (
                    <Badge
                      style={{
                        display: "inline-block",
                        width: "max-content"
                      }}
                      mode="outline"
                      tone={_score > 0.5 ? "primary" : "default"}
                    >
                      <span style={{ fontSize: ".8em" }}>
                        Match score: {_score.toFixed(2)}
                      </span>
                    </Badge>
                  )}
                  <Text style={{ margin: ".5em 0 .65em" }} size={1}>
                    <a
                      href={`https://www.sanity.io/exchange/community/${handle.current}`}
                    >
                      {name}
                    </a>
                  </Text>
                  <Text size={1} muted>
                    {headline}
                  </Text>
                </Card>
              </Popup>
            </Marker>
          )
        )}
      <FeatureGroup>
        {!geos.length > 0 ? (
          <DrawOnlyControl position="topleft" onCreated={onCreated} />
        ) : (
          <EditOnlyControl
            position="topleft"
            onCreated={onCreated}
            onEdited={onEdited}
            onDeleted={onDeleted}
          />
        )}
      </FeatureGroup>
      {filterState.currentLocation && (
        <Circle
          center={filterState.currentLocation}
          pathOptions={{ fillColor: "blue", weight: 1 }}
          radius={filterState.maxDistance}
        />
      )}
      {map ? <EventsTracker map={map} setIconSize={setIconSize} /> : null}
    </MapContainer>
  );
};

export default Map;
