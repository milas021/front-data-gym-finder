import L from "leaflet";

const MarkerIcon = () => {
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1200 1200">
        <path fill="#ff0000" d="M600,0C350.178,0,147.656,202.521,147.656,452.344 c0,83.547,16.353,169.837,63.281,232.031L600,1200l389.062-515.625c42.625-56.49,63.281-156.356,63.281-232.031 C1052.344,202.521,849.822,0,600,0z M600,261.987c105.116,0,190.356,85.241,190.356,190.356C790.356,557.46,705.116,642.7,600,642.7 s-190.356-85.24-190.356-190.356S494.884,261.987,600,261.987z"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export default MarkerIcon;
