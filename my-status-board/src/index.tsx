import { Hono } from 'hono'
import satori from 'satori'

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

  // 2. Satori로 SVG 생성
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

      {/* ================= 1. 상단 정보 ================= */}
      <div style={{ position: 'absolute', top: 225, left: 120, fontSize: 60, fontWeight: 600 }}>Date</div>
      <div style={{ position: 'absolute', top: 345, left: 120, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{date || 'N일차'}</div>

      <div style={{ position: 'absolute', top: 225, left: 677, fontSize: 60, fontWeight: 600 }}>Time</div>
      <div style={{ position: 'absolute', top: 345, left: 677, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{time || 'HH:MM'}</div>

      <div style={{ position: 'absolute', top: 225, left: 1230, fontSize: 60, fontWeight: 600 }}>Loc</div>
      <div style={{ position: 'absolute', top: 345, left: 1230, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{loc || '위치'}</div>

      <div style={{ position: 'absolute', top: 225, left: 1795, fontSize: 60, fontWeight: 600 }}>Class</div>
      <div style={{ position: 'absolute', top: 345, left: 1795, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{job || '직업'}</div>

      {/* ================= 2. 관계창 ================= */}
      <div style={{ position: 'absolute', top: 488, left: 505, fontSize: 48, fontWeight: 600 }}>Relationship</div>
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

{/* ================= 3. 하단 텍스트 (수정됨) ================= */}
      <div style={{
        position: 'absolute', top: 860, left: 780, width: 1800, height: 200,
        display: 'flex',
        flexDirection: 'column', // 세로로 나열 (줄바꿈 효과)
        justifyContent: 'center', // 박스 내에서 수직 중앙 정렬
        alignItems: 'flex-start', // 텍스트를 왼쪽 정렬 (중앙 정렬 원하면 'center'로 변경)
        paddingLeft: 100,         // 왼쪽 여백 (왼쪽 정렬 시 너무 붙지 않게)
        fontSize: 32,             // 폰트 크기
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.5)' // [핵심] 글자 반투명 (0.5 = 50% 투명도)
      }}>
        
        {/* 첫 번째 줄 */}
        <div style={{ marginBottom: 15 }}>System Loading...</div>

        {/* 두 번째 줄 (텍스트 + 커서) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>└ Completed</span>
          
          {/* ▼▼▼ 커서 위치/크기 수정하는 곳 ▼▼▼ */}
          <div style={{
            marginLeft: 15,             // [수정] 글자와 커서 사이 간격 (가로 위치)
            marginTop: 0,               // [수정] 커서 위아래 미세 조정 필요 시 사용 (음수 가능)
            width: 4,                   // [수정] 커서 두께
            height: 32,                 // [수정] 커서 높이
            backgroundColor: '#fefefe', // 애니메이션용 색상 키 (수정 금지)
            display: 'flex'
          }} />
        </div>

      </div>,
    {
      width: 2667, height: 1144,
      fonts: [
        { name: 'MyFont', data: fontMediumBuffer, weight: 400, style: 'normal' },
        { name: 'MyFont', data: fontSemiBoldBuffer, weight: 600, style: 'normal' },
      ],
    }
  )

  // 3. CSS 애니메이션 주입
  const animatedSvg = svg.replace(
    '</svg>',
    `
    <style>
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      /* [수정 2] '#fefefe' 색상을 가진 사각형만 정확히 타겟팅 */
      rect[fill="#fefefe"] {
        animation: blink 1s step-end infinite;
      }
    </style>
    </svg>`
  )

  return new Response(animatedSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
})

export default app