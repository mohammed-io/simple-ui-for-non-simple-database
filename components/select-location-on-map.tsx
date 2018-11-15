import { Gmaps, Marker, InfoWindow, Circle } from "react-gmaps";

export default ({
  coordinates = { lat: 36.20956640321589, lng: 44.02851596560663 },
  params = { v: "3.exp", key: "" },
  width = "100%",
  height = "100%",
  zoom = 12,
  loadingMessage = "Loading..",
  canChangeLocation = true,
  onLocationChanged = (coords?: { lat: number; lng: number }) => {},
  onMarkerDragEnd = (e?) => {},
  onMapCreated = (e?) => {}
}) => (
  <Gmaps
    width={width}
    height={height}
    lat={coordinates.lat}
    lng={coordinates.lng}
    zoom={zoom}
    loadingMessage={loadingMessage}
    params={params}
    onMapCreated={onMapCreated}
  >
    <Marker
      lat={coordinates.lat}
      lng={coordinates.lng}
      draggable={canChangeLocation}
      onDragEnd={e => {
        onMarkerDragEnd(e);
        onLocationChanged({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }}
    />
  </Gmaps>
);
