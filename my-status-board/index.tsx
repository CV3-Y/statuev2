import { Hono } from 'hono'
import { ImageResponse } from '@vercel/og'

const app = new Hono()

app.get('/', async (c) => {
  const { date, time, loc, job, text } = c.req.query()

  const fontUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf' 
  const fontBuffer = await fetch(fontUrl).then((res) => res.arrayBuffer())

  const bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v2%20%EC%99%84%EC%84%B1%EB%B3%B8.png' 

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          position: 'relative',
          backgroundColor: 'black',
          color: 'white',
          fontFamily: '"MyFont"', 
        }}
      >
        {/* 배경 이미지 */}
        <img
          src={bgUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* 1. Date (날짜) */}
        <div style={{ position: 'absolute', top: 130, left: 60, fontSize: 32, fontWeight: 700 }}>
          {date || 'N일차'}
        </div>

        {/* 2. Time (시간) */}
        <div style={{ position: 'absolute', top: 130, left: 400, fontSize: 32, fontWeight: 700 }}>
          {time || 'HH:MM'}
        </div>

        {/* 3. Location (위치) */}
        <div style={{ position: 'absolute', top: 130, left: 750, fontSize: 32, fontWeight: 700 }}>
          {loc || '위치 정보'}
        </div>

        {/* 4. Class (직업/역할) */}
        <div style={{ position: 'absolute', top: 130, left: 1100, fontSize: 32, fontWeight: 700 }}>
          {job || '직업 없음'}
        </div>

        {/* 5. Relationship (관계 - 줄바꿈 처리) */}
        <div style={{ 
          position: 'absolute', 
          top: 350, 
          left: 60, 
          display: 'flex', 
          flexDirection: 'column', 
          fontSize: 24, 
          lineHeight: 1.5 
        }}>
          <div>관계1: 엘리 (신뢰)</div>
          <div>관계2: 슈비 (적대)</div>
        </div>

        {/* 6. Main Text (하단 사건 설명) */}
        <div style={{ 
          position: 'absolute', 
          top: 600, 
          left: 200, 
          width: 900, 
          fontSize: 28, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          {text || '현재 상황에 대한 설명이 여기에 출력됩니다.'}
        </div>

      </div>
    ),
    {
      width: 2667, 
      height: 1144,
      fonts: [
        {
          name: 'MyFont',
          data: fontBuffer,
          style: 'normal',
        },
      ],
    }
  )
})

export default app