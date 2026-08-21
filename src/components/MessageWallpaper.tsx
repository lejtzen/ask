interface Props {
  wallpaper: string
}

export default function MessageWallpaper({ wallpaper }: Props) {
  return (
    <div
      id="wallpaper"
      style={{ backgroundImage: `url(${wallpaper})` }}
    />
  )
}
