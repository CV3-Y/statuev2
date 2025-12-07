import { Hono } from 'hono'
import satori from 'satori'

const app = new Hono()

app.get('/', async (c) => {
  // rels(관계 데이터) 파라미터 추가
  const { date, time, loc, job, text, hp, maxHp, rels } = c.req.query()

  // 1. HP 비율 계산
  const currentHpVal = hp ? parseInt(hp) : 100;
  const maxHpVal = maxHp ? parseInt(maxHp) : 100;
  let percentage = 100;
  if (maxHpVal > 0) {
    percentage = Math.min(Math.max(Math.round((currentHpVal / maxHpVal) * 100), 0), 100);
  }

  // 2. HP 단계별 배경 이미지 설정
  let bgUrl = '';
  if (percentage <= 20) {
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v5.png'; 
  } else if (percentage <= 40) {
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v4.png';
  } else if (percentage <= 60) {
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v3.png';
  } else if (percentage <= 80) {
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v2.png';
  } else {
    bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v3v1.png';
  }

  // 3. 관계 데이터 파싱 (쉼표로 구분)
  // 입력이 없으면 빈 배열 -> 화면에 아무것도 안 뜸
  const relationships = rels ? rels.split(',') : [];

  // 4. 폰트 불러오기
  const fontMediumUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf'
  const fontSemiBoldUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-SemiBold.ttf'

  const [fontMediumBuffer, fontSemiBoldBuffer] = await Promise.all([
    fetch(fontMediumUrl).then((res) => res.arrayBuffer()),
    fetch(fontSemiBoldUrl).then((res) => res.arrayBuffer()),
  ])

  // 5. Satori로 SVG 생성
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

      {/* ================= 2. 관계창 (동적 데이터 적용) ================= */}
      <div style={{ position: 'absolute', top: 488, left: 505, fontSize: 48, fontWeight: 600 }}>Relationship</div>
      
      {/* 1열 (1~3번 데이터) */}
      <div style={{ position: 'absolute', top: 595, left: 530, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
        <div>{relationships[0] || ''}</div>
        <div>{relationships[1] || ''}</div>
        <div>{relationships[2] || ''}</div>
      </div>
      
      {/* 2열 (4~6번 데이터) */}
      <div style={{ position: 'absolute', top: 595, left: 1230, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
        <div>{relationships[3] || ''}</div>
        <div>{relationships[4] || ''}</div>
        <div>{relationships[5] || ''}</div>
      </div>
      
      {/* 3열 (7~9번 데이터) */}
      <div style={{ position: 'absolute', top: 595, left: 2030, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
        <div>{relationships[6] || ''}</div>
        <div>{relationships[7] || ''}</div>
        <div>{relationships[8] || ''}</div>
      </div>

      {/* ================= 3. 하단 텍스트 (System Loading...) ================= */}
      <div style={{
        position: 'absolute', top: 880, left: -255, width: 1800, height: 200,
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

  // 6. CSS 애니메이션 주입 (커서 깜빡임)
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