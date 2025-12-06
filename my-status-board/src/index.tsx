import { Hono } from 'hono'
import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'

// WASM 초기화
await initWasm(resvgWasm)

const app = new Hono()

app.get('/', async (c) => {
  const { date, time, loc, job, text } = c.req.query()

  // 폰트 & 배경 설정
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
      {/* 배경 이미지 */}
      <img
        src={bgUrl}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
        }}
      />

      {/* ================= 상단 정보 (제목 + 값) ================= */}
      
      {/* 1. Date (날짜) */}
      <div style={{ position: 'absolute', top: 120, left: 140, fontSize: 80, fontWeight: 700 }}>Date</div>
      <div style={{ position: 'absolute', top: 260, left: 50, width: 500, display: 'flex', justifyContent: 'center', fontSize: 50, color: '#ddd' }}>
        {date || 'N일차'}
      </div>

      {/* 2. Time (시간) */}
      <div style={{ position: 'absolute', top: 120, left: 810, fontSize: 80, fontWeight: 700 }}>Time</div>
      <div style={{ position: 'absolute', top: 260, left: 720, width: 500, display: 'flex', justifyContent: 'center', fontSize: 50, color: '#ddd' }}>
        {time || 'HH:MM'}
      </div>

      {/* 3. Loc (위치) */}
      <div style={{ position: 'absolute', top: 120, left: 1520, fontSize: 80, fontWeight: 700 }}>Loc</div>
      <div style={{ position: 'absolute', top: 260, left: 1390, width: 500, display: 'flex', justifyContent: 'center', fontSize: 50, color: '#ddd' }}>
        {loc || '현재 위치'}
      </div>

      {/* 4. Class (직업) */}
      <div style={{ position: 'absolute', top: 120, left: 2150, fontSize: 80, fontWeight: 700 }}>Class</div>
      <div style={{ position: 'absolute', top: 260, left: 2060, width: 500, display: 'flex', justifyContent: 'center', fontSize: 50, color: '#ddd' }}>
        {job || '역할(직업)'}
      </div>


      {/* ================= 중간 관계창 (Relationship) ================= */}
      
      {/* 제목 */}
      <div style={{ position: 'absolute', top: 430, left: 620, fontSize: 70, textDecoration: 'underline', textUnderlineOffset: 15 }}>Relationship</div>
      
      {/* 관계 목록 (3열 배치) */}
      <div style={{ 
        position: 'absolute', top: 560, left: 620, width: 1900, 
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: 45 
      }}>
        {/* 1열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>관계1: 예시 데이터</div>
          <div>관계2: 예시 데이터</div>
        </div>
        {/* 2열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>관계3: 예시 데이터</div>
          <div>관계4: 예시 데이터</div>
        </div>
        {/* 3열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>관계5: 예시 데이터</div>
          <div>관계6: 예시 데이터</div>
        </div>
      </div>


      {/* ================= 좌측 하단 (영혼 오염도) ================= */}
      <div style={{ 
        position: 'absolute', top: 660, left: 50, width: 480, 
        display: 'flex', justifyContent: 'center', fontSize: 40, color: '#aaa' 
      }}>
        &gt; 영혼 오염도
      </div>


      {/* ================= 최하단 메인 텍스트 (Incident) ================= */}
      <div style={{ 
        position: 'absolute', top: 860, left: 780, width: 1800, height: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: 55, textAlign: 'center', lineHeight: 1.4
      }}>
        {text || '여기에 현재 상황이나 사건에 대한 설명이 출력됩니다.'}
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
    headers: { 'Content-Type': 'image/png' },
  })
})

export default app