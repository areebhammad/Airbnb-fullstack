export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) {
    return "";
  }
  {
    if (!className) {
      className = "object-cover";
    }
    <img
      className={className}
      src={"http://localhost:1337/" + place.photos[index]}
      alt=""
    />;
  }
}
