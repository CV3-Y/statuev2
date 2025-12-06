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

      {/* [좌표 보정 노트]
         - 제목(Label) Y좌표: 기존 226 -> 150 (선 위로 올림)
         - 값(Value) Y좌표: 기존 348 -> 260 (선 아래에 딱 붙임)
         - 폰트 크기: pt 단위를 px로 변환하여 적용 (제목 45px, 내용 32px)
      */}

      {/* ================= 1. 상단 정보 ================= */}
      
      {/* [Date] 날짜 */}
      <div style={{ position: 'absolute', top: 250, left: 120, fontSize: 48, fontWeight: 700 }}>Date</div>
      <div style={{ 
        position: 'absolute', top: 360, left: 80, width: 200, 
        display: 'flex', justifyContent: 'center', fontSize: 32, color: '#ffffff' 
      }}>
        {date || 'N일차'}
      </div>

      {/* [Time] 시간 */}
      <div style={{ position: 'absolute', top: 150, left: 672, fontSize: 48, fontWeight: 700 }}>Time</div>
      <div style={{ 
        position: 'absolute', top: 260, left: 640, width: 200, 
        display: 'flex', justifyContent: 'center', fontSize: 32, color: '#ffffff' 
      }}>
        {time || 'HH:MM'}
      </div>

      {/* [Loc] 위치 */}
      <div style={{ position: 'absolute', top: 150, left: 1220, fontSize: 48, fontWeight: 700 }}>Loc</div>
      <div style={{ 
        position: 'absolute', top: 260, left: 1200, width: 200, 
        display: 'flex', justifyContent: 'center', fontSize: 32, color: '#ffffff' 
      }}>
        {loc || '위치'}
      </div>

      {/* [Class] 직업 */}
      <div style={{ position: 'absolute', top: 150, left: 1780, fontSize: 48, fontWeight: 700 }}>Class</div>
      <div style={{ 
        position: 'absolute', top: 260, left: 1760, width: 220, 
        display: 'flex', justifyContent: 'center', fontSize: 32, color: '#ffffff' 
      }}>
        {job || '직업'}
      </div>


      {/* ================= 2. 관계창 (Relationship) ================= */}
      
      {/* 제목 */}
      <div style={{ position: 'absolute', top: 480, left: 510, fontSize: 36 }}>Relationship</div>
      
      {/* [레이아웃 변경]
         flex-gap 대신 'absolute'로 각 열(Column)의 위치를 고정했습니다.
         이 방식이 배경 이미지의 칸에 정확히 맞추기 더 쉽습니다.
      */}
      
      {/* 1열 (왼쪽) */}
      <div style={{ 
        position: 'absolute', top: 580, left: 510, 
        display: 'flex', flexDirection: 'column', gap: 20, fontSize: 28 
      }}>
        <div>관계1: 데이터 없음</div>
        <div>관계2: 데이터 없음</div>
        <div>관계3: 데이터 없음</div>
      </div>

      {/* 2열 (중앙) - X좌표를 1200으로 설정 */}
      <div style={{ 
        position: 'absolute', top: 580, left: 1200, 
        display: 'flex', flexDirection: 'column', gap: 20, fontSize: 28 
      }}>
        <div>관계4: 데이터 없음</div>
        <div>관계5: 데이터 없음</div>
        <div>관계6: 데이터 없음</div>
      </div>

      {/* 3열 (오른쪽) - X좌표를 1900으로 설정 */}
      <div style={{ 
        position: 'absolute', top: 580, left: 1900, 
        display: 'flex', flexDirection: 'column', gap: 20, fontSize: 28 
      }}>
        <div>관계7: 데이터 없음</div>
        <div>관계8: 데이터 없음</div>
        <div>관계9: 데이터 없음</div>
      </div>


      {/* ================= 3. 하단 텍스트 ================= */}
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