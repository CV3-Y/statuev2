import { Hono } from 'hono'
import satori from 'satori'

// [중요] 무거운 Resvg(PNG 변환기) 제거
// import { initWasm, Resvg } from '@resvg/resvg-wasm'
// import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'
// await initWasm(resvgWasm)

const app = new Hono()

app.get('/', async (c) => {
  const { date, time, loc, job, text } = c.req.query()

  // 1. 폰트 불러오기
  const fontMediumUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf'
  const fontSemiBoldUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-SemiBold.ttf'

  const [fontMediumBuffer, fontSemiBoldBuffer] = await Promise.all([
    fetch(fontMediumUrl).then((res) => res.arrayBuffer()),
    fetch(fontSemiBoldUrl).then((res) => res.arrayBuffer()),
  ])

  // 배경 이미지
  const bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v2%20%EC%99%84%EC%84%B1%EB%B3%B8.png'

  // 2. SVG 생성 (CPU 사용량 적음)
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
        fontWeight: 400,
      }}
    >
      <img
        src={bgUrl}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
        }}
      />

      {/* === 상단 정보 === */}
      <div style={{ position: 'absolute', top: 225, left: 120, fontSize: 60, fontWeight: 600 }}>Date</div>
      <div style={{ position: 'absolute', top: 345, left: 60, width: 200, display: 'flex', justifyContent: 'center', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{date || 'N일차'}</div>

      <div style={{ position: 'absolute', top: 150, left: 672, fontSize: 48, fontWeight: 600 }}>Time</div>
      <div style={{ position: 'absolute', top: 260, left: 640, width: 200, display: 'flex', justifyContent: 'center', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{time || 'HH:MM'}</div>

      <div style={{ position: 'absolute', top: 150, left: 1220, fontSize: 48, fontWeight: 600 }}>Loc</div>
      <div style={{ position: 'absolute', top: 260, left: 1200, width: 200, display: 'flex', justifyContent: 'center', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{loc || '위치'}</div>

      <div style={{ position: 'absolute', top: 150, left: 1780, fontSize: 48, fontWeight: 600 }}>Class</div>
      <div style={{ position: 'absolute', top: 260, left: 1760, width: 220, display: 'flex', justifyContent: 'center', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{job || '직업'}</div>

      {/* === 관계창 === */}
      <div style={{ position: 'absolute', top: 480, left: 510, fontSize: 36, fontWeight: 600 }}>Relationship</div>
      
      <div style={{ position: 'absolute', top: 580, left: 510, display: 'flex', flexDirection: 'column', gap: 20, fontSize: 28, fontWeight: 400 }}>
        <div>관계1: 데이터 없음</div>
        <div>관계2: 데이터 없음</div>
        <div>관계3: 데이터 없음</div>
      </div>
      <div style={{ position: 'absolute', top: 580, left: 1200, display: 'flex', flexDirection: 'column', gap: 20, fontSize: 28, fontWeight: 400 }}>
        <div>관계4: 데이터 없음</div>
        <div>관계5: 데이터 없음</div>
        <div>관계6: 데이터 없음</div>
      </div>
      <div style={{ position: 'absolute', top: 580, left: 1900, display: 'flex', flexDirection: 'column', gap: 20, fontSize: 28, fontWeight: 400 }}>
        <div>관계7: 데이터 없음</div>
        <div>관계8: 데이터 없음</div>
        <div>관계9: 데이터 없음</div>
      </div>

      {/* === 하단 텍스트 === */}
      <div style={{ position: 'absolute', top: 860, left: 780, width: 1800, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 400 }}>
        {/* {text} */}
      </div>
    </div>,
    {
      width: 2667,
      height: 1144,
      fonts: [
        { name: 'MyFont', data: fontMediumBuffer, weight: 400, style: 'normal' },
        { name: 'MyFont', data: fontSemiBoldBuffer, weight: 600, style: 'normal' },
      ],
    }
  )

  // 3. SVG 문자열을 그대로 반환 (Content-Type: image/svg+xml)
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  })
})

export default app