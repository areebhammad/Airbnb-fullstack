export default function Image({ src, ...rest }) {
  src = src && src.includes("https://") ? src : "http://localhost:1337/" + src;
  return <img {...rest} src={src} alt={""} />;
}
