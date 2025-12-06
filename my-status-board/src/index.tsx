import { Hono } from 'hono'
import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'

// 1. WASM 수동 초기화
await initWasm(resvgWasm)

const app = new Hono()

app.get('/', async (c) => {
  const { date, time, loc, job, text } = c.req.query()

  // 폰트 & 배경 설정 (GitHub Raw URL)
  const fontUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf'
  const fontBuffer = await fetch(fontUrl).then((res) => res.arrayBuffer())
  const bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v2%20%EC%99%84%EC%84%B1%EB%B3%B8.png'

  // 2. satori로 렌더링
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

      {/* ================= 1. 상단 정보 (제목 & 값) ================= */}
      
      {/* [Date] 날짜 */}
      <div style={{ position: 'absolute', top: 226, left: 120, fontSize: '34.18pt', fontWeight: 700 }}>Date</div>
      <div style={{ 
        position: 'absolute', top: 348, left: 119, width: 101, 
        display: 'flex', justifyContent: 'center', fontSize: '18.16pt', color: '#ffffff' 
      }}>
        {date || 'N일차'}
      </div>

      {/* [Time] 시간 */}
      <div style={{ position: 'absolute', top: 224, left: 672, fontSize: '34.18pt', fontWeight: 700 }}>Time</div>
      <div style={{ 
        position: 'absolute', top: 343, left: 671, width: 139, 
        display: 'flex', justifyContent: 'center', fontSize: '18.16pt', color: '#ffffff' 
      }}>
        {time || 'HH:MM'}
      </div>

      {/* [Loc] 위치 */}
      <div style={{ position: 'absolute', top: 222, left: 1220, fontSize: '34.18pt', fontWeight: 700 }}>Loc</div>
      <div style={{ 
        position: 'absolute', top: 341, left: 1220, width: 157, 
        display: 'flex', justifyContent: 'center', fontSize: '18.16pt', color: '#ffffff' 
      }}>
        {loc || '위치'}
      </div>

      {/* [Class] 직업/역할 */}
      <div style={{ position: 'absolute', top: 219, left: 1780, fontSize: '34.18pt', fontWeight: 700 }}>Class</div>
      <div style={{ 
        position: 'absolute', top: 339, left: 1779, width: 180, 
        display: 'flex', justifyContent: 'center', fontSize: '18.16pt', color: '#ffffff' 
      }}>
        {job || '직업'}
      </div>


      {/* ================= 2. 관계창 (Relationship) ================= */}
      
      {/* 제목 */}
      <div style={{ position: 'absolute', top: 504, left: 507, fontSize: '23.54pt' }}>Relationship</div>
      
      {/* 관계 목록 컨테이너 */}
      <div style={{ 
        position: 'absolute', 
        top: 609,      // 시작 Y
        left: 539,     // 시작 X
        display: 'flex', 
        flexDirection: 'row', 
        gap: 770,      // 열 간격 (가로)
        fontSize: '18.96pt' // 폰트 크기
      }}>
        {/* 1열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>관계1: 데이터 없음</div>
          <div>관계2: 데이터 없음</div>
        </div>

        {/* 2열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>관계3: 데이터 없음</div>
          <div>관계4: 데이터 없음</div>
        </div>

        {/* 3열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>관계5: 데이터 없음</div>
          <div>관계6: 데이터 없음</div>
        </div>
      </div>


      {/* ================= 3. 하단 텍스트 (공백 유지) ================= */}
      {/* 추후 텍스트를 넣을 위치입니다.
         현재는 요청하신 대로 비워둡니다.
      */}
      <div style={{ 
        position: 'absolute', top: 860, left: 780, width: 1800, height: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
      }}>
        {/* {text} */}
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

  // 3. PNG 변환 및 반환
  const resvg = new Resvg(svg)
  const pngData = resvg.render().asPng()

  return new Response(pngData, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=60', 
    },
  })
})

export default app