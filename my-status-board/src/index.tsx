import { Hono } from 'hono'
import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'


await initWasm(resvgWasm)

const app = new Hono()

app.get('/', async (c) => {
  const { date, time, loc, job, text } = c.req.query()


  const fontUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf'
  const fontBuffer = await fetch(fontUrl).then((res) => res.arrayBuffer())

  const bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v2%20%EC%99%84%EC%84%B1%EB%B3%B8.png'

  const svg = await satori(
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
      <img
        src={bgUrl}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
        }}
      />
      
      {/* 텍스트 데이터 배치 */}
      <div style={{ position: 'absolute', top: 130, left: 60, fontSize: 32, fontWeight: 700 }}>{date || 'N일차'}</div>
      <div style={{ position: 'absolute', top: 130, left: 400, fontSize: 32, fontWeight: 700 }}>{time || 'HH:MM'}</div>
      <div style={{ position: 'absolute', top: 130, left: 750, fontSize: 32, fontWeight: 700 }}>{loc || '위치 정보'}</div>
      <div style={{ position: 'absolute', top: 130, left: 1100, fontSize: 32, fontWeight: 700 }}>{job || '직업 없음'}</div>
      
      <div style={{ 
        position: 'absolute', top: 350, left: 60, display: 'flex', flexDirection: 'column', fontSize: 24, lineHeight: 1.5 
      }}>
        <div>관계1: 엘리 (신뢰)</div>
        <div>관계2: 슈비 (적대)</div>
      </div>

      <div style={{ 
        position: 'absolute', top: 600, left: 200, width: 900, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
      }}>
        {text || '상황 설명 출력'}
      </div>
    </div>,
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

  const resvg = new Resvg(svg)
  const pngData = resvg.render().asPng()

  return new Response(pngData, {
    headers: {
      'Content-Type': 'image/png',
      // 캐시 설정 (선택사항)
      'Cache-Control': 'public, max-age=60', 
    },
  })
})

export default app