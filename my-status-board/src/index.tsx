import { Hono } from 'hono'
import satori from 'satori'

const app = new Hono()

app.get('/', async (c) => {
  const { date, time, loc, job, text, hp, maxHp } = c.req.query()

  // 1. HP 비율 계산
  const currentHpVal = hp ? parseInt(hp) : 100;
  const maxHpVal = maxHp ? parseInt(maxHp) : 100;
  
  // 퍼센트 계산 (0~100 사이로 제한)
  // 예: 50/100 -> 50, 200/200 -> 100
  let percentage = 100;
  if (maxHpVal > 0) {
    percentage = Math.min(Math.max(Math.round((currentHpVal / maxHpVal) * 100), 0), 100);
  }

  // 2. [사용자 설정] HP 단계별 배경 이미지 URL 설정
  // 각 단계에 맞는 이미지 주소를 따옴표 안에 넣어주세요.
  let bgUrl = '';

  if (percentage <= 20) {
    // HP 0% ~ 20% (위험/빨강)
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v5.png'; 
  } else if (percentage <= 40) {
    // HP 21% ~ 40% (주황)
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v4.png';
  } else if (percentage <= 60) {
    // HP 41% ~ 60% (노랑)
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v3.png';
  } else if (percentage <= 80) {
    // HP 61% ~ 80% (연두)
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v2.png';
  } else {
    // HP 81% ~ 100% (초록/가득참) - 기본값
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v1.png';
  }

  // 3. 폰트 불러오기
  const fontMediumUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf'
  const fontSemiBoldUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-SemiBold.ttf'

  const [fontMediumBuffer, fontSemiBoldBuffer] = await Promise.all([
    fetch(fontMediumUrl).then((res) => res.arrayBuffer()),
    fetch(fontSemiBoldUrl).then((res) => res.arrayBuffer()),
  ])

  // 4. Satori로 SVG 생성
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
      {/* 배경 이미지 (HP에 따라 변경됨) */}
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

      {/* ================= 3. 하단 텍스트 (System Loading...) ================= */}
      <div style={{
        position: 'absolute', top: 880, left: -90, width: 1800, height: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 1.5,
      }}>
        {!text ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div>System Loading...</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              └ Completed
              {/* ▼ 커서 (도형) */}
              <div style={{
                marginLeft: 15,
                width: 12,
                height: 40,
                backgroundColor: '#fefefe',
                display: 'flex'
              }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {text}
            <div style={{ marginLeft: 10, width: 4, height: 40, backgroundColor: '#fefefe', display: 'flex' }} />
          </div>
        )}
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

  // 5. CSS 애니메이션 주입 (커서 깜빡임)
  const animatedSvg = svg.replace(
    '</svg>',
    `
    <style>
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
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