import { Hono } from 'hono'
import satori from 'satori'

// Resvg 제거 (SVG 모드)
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
        fontWeight: 400,
      }}
    >
      <img
        src={bgUrl}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
        }}
      />

      {/* ================= 1. 상단 정보 (좌측 정렬 적용) ================= */}
      {/* [수정 포인트]
          1. 제목(Label)과 값(Value)의 Left 좌표를 동일하게 맞춤 (예: Date는 둘 다 120)
          2. 값(Value)에서 width 제한과 justifyContent: 'center'를 제거 -> 오른쪽으로 자연스럽게 확장됨
      */}
      
      {/* [Date] 날짜 */}
      <div style={{ position: 'absolute', top: 225, left: 120, fontSize: 60, fontWeight: 600 }}>Date</div>
      <div style={{ 
        position: 'absolute', top: 345, left: 120, 
        display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' 
      }}>
        {date || 'N일차'}
      </div>

      {/* [Time] 시간 */}
      <div style={{ position: 'absolute', top: 225, left: 677, fontSize: 60, fontWeight: 600 }}>Time</div>
      <div style={{ 
        position: 'absolute', top: 345, left: 677, 
        display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' 
      }}>
        {time || 'HH:MM'}
      </div>

      {/* [Loc] 위치 */}
      <div style={{ position: 'absolute', top: 225, left: 1230, fontSize: 60, fontWeight: 600 }}>Loc</div>
      <div style={{ 
        position: 'absolute', top: 345, left: 1232, 
        display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' 
      }}>
        {loc || '위치'}
      </div>

      {/* [Class] 직업 */}
      <div style={{ position: 'absolute', top: 225, left: 1795, fontSize: 60, fontWeight: 600 }}>Class</div>
      <div style={{ 
        position: 'absolute', top: 345, left: 1797, 
        display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' 
      }}>
        {job || '직업'}
      </div>


      {/* ================= 2. 관계창 (Relationship) ================= */}
      
      <div style={{ position: 'absolute', top: 488, left: 505, fontSize: 48, fontWeight: 600 }}>Relationship</div>
      
      {/* 관계창 목록: 기본적으로 좌측 정렬(flex-start) 상태이므로 유지 */}
      <div style={{ position: 'absolute', top: 595, left: 530, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
        <div>관계1: 데이터 없음</div>
        <div>관계2: 데이터 없음</div>
        <div>관계3: 데이터 없음</div>
      </div>
      <div style={{ position: 'absolute', top: 595, left: 1230, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
        <div>관계4: 데이터 없음</div>
        <div>관계5: 데이터 없음</div>
        <div>관계6: 데이터 없음</div>
      </div>
      <div style={{ position: 'absolute', top: 595, left: 2030, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
        <div>관계7: 데이터 없음</div>
        <div>관계8: 데이터 없음</div>
        <div>관계9: 데이터 없음</div>
      </div>

      {/* ================= 3. 하단 텍스트 (중앙 정렬 유지) ================= */}
      {/* 긴 텍스트는 보통 중앙 정렬이 보기에 좋아 유지했지만, 좌측 정렬을 원하시면 justifyContent를 지우시면 됩니다. */}
      <div style={{ 
        position: 'absolute', top: 860, left: 780, width: 1800, height: 200, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 400 
      }}>
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

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  })
})

export default app