const EventsTracker = ({ map, setIconSize }) => {
  map.on("zoomend", function () {
    const zoom = map.getZoom();
    const size = zoom >= 0 ? 5 + 8 * zoom : 45;
    setIconSize(size);
  });
  return null;
};

export default EventsTracker;
