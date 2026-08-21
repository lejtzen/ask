import type { ReactNode } from 'react'
import profileImg from '../assets/profile.jpg'

interface Props {
  name?: string
  left?: ReactNode
  right?: ReactNode
}

export default function Navigation({ name = 'Mr. Bot', left, right }: Props) {
  return (
    <div id="top" className="bg-frost">
      <div className="x-top x-left x-right">
        <div className="flex valign">
          {left}
          <div className="grow text-center">
            <img
              src={profileImg.src}
              alt="Vincent Lejtzén"
              width={76}
              height={76}
              style={{
                display: 'block',
                margin: '0 auto',
                width: 'auto',
                height: '38px',
                borderRadius: '1000px',
              }}
            />
          </div>
          {right}
        </div>
        <div className="text-xs text-center">{name}</div>
      </div>
    </div>
  )
}
