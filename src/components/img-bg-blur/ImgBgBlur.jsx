import { toImgUrl } from '../../utils'

function ImgBgBlur({ fileUri, alt, onClick }) {
  return (
    <div
      className="rounded-3 h-100 w-100"
      style={{
        backgroundImage: `url("${toImgUrl(fileUri)}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      onClick={onClick}
    >
      <img
        src={toImgUrl(fileUri)}
        draggable="false"
        className="w-100 h-100 rounded-3"
        style={{
          backdropFilter: "blur(4px) brightness(90%)",
          objectFit: "contain",
        }}
        alt={alt}
      />
    </div>
  )
}

export { ImgBgBlur }