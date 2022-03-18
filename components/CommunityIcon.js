import Leaflet from "leaflet";
import { urlFor } from "../lib/sanity";

function CommunityIcon(photo, size) {
  return new Leaflet.Icon({
    iconUrl: photo?.asset
      ? urlFor(photo).width(100).height(100).url()
      : "/avatar.png",
    iconSize: [size, size], // size of the icon
    iconAnchor: [size / 2, size / 2], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -size / 2] // point from which the popup should open relative to the iconAnchor
  });
}

export default CommunityIcon;
