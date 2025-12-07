import { Hono } from 'hono'
import satori from 'satori'

const app = new Hono()

// [헬퍼 함수] HP 비율에 따른 색상 반환
function getHpColor(percentage: number): string {
  if (percentage >= 70) return '#4ade80'; // Green
  if (percentage >= 35) return '#facc15'; // Yellow
  return '#ef4444'; // Red
}

app.get('/', async (c) => {
  // 1. 데이터 받기 (hp, maxHp 추가)
  const { date, time, loc, job, text, hp, maxHp } = c.req.query()

  // [HP 계산 로직]
  const currentHpVal = hp ? parseInt(hp) : 100;
  const maxHpVal = maxHp ? parseInt(maxHp) : 100;
  // 0 ~ 100 사이 퍼센트 계산
  const percentage = Math.min(Math.max(Math.round((currentHpVal / maxHpVal) * 100), 0), 100);
  // 색상 결정
  const waveColor = getHpColor(percentage);
  // 파도 SVG Data URI (색상을 동적으로 주입하기 위해 함수형태로 사용하거나 문자열 replace 사용)
  // 인코딩된 SVG 문자열입니다. fill='WAVE_COLOR_Dg8d3' 부분을 찾아 교체합니다.
  const waveSvgDataUri = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='${encodeURIComponent(waveColor)}' fill-opacity='1' d='M0,64L40,85.3C80,107,160,149,240,165.3C320,181,400,171,480,154.7C560,139,640,117,720,128C800,139,880,181,960,192C1040,203,1120,181,1200,160C1280,139,1360,117,1400,106.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'%3E%3C/path%3E%3C/svg%3E`;


  // 폰트 및 배경 로딩 (기존 코드 유지)
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

      {/* ================= 기존 내용들 ================= */}
      <div style={{ position: 'absolute', top: 225, left: 120, fontSize: 60, fontWeight: 600 }}>Date</div>
      <div style={{ position: 'absolute', top: 345, left: 120, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{date || 'N일차'}</div>
      {/* ... (Time, Loc, Class, Relationship 생략 - 기존 코드 유지) ... */}
      

      {/* ======================= 🌊 NEW: HP Wave Circle ======================= */}
      {/* 위치는 왼쪽 빈 공간(대략 관계창 왼쪽)에 맞춰 보았습니다. 조정이 필요할 수 있습니다. */}
      <div
        style={{
          position: 'absolute',
          top: 450,
          left: 100,
          width: 280, // 원 크기 설정
          height: 280,
          borderRadius: '50%', // 원형 마스크
          border: `6px solid ${waveColor}`, // 테두리 색상도 HP에 따라 변경
          overflow: 'hidden', // 중요: 내용물이 원 밖으로 나가지 않도록 잘라냄
          backgroundColor: 'rgba(0,0,0,0.5)', // 원 내부 배경 (반투명 검정)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px ${waveColor}80` // 약간의 빛나는 효과 추가
        }}
      >
        {/* 수위 조절 컨테이너 (높이가 변함) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${percentage}%`, // HP 비율만큼 높이 설정
            backgroundColor: waveColor, // HP 색상으로 채움
            display: 'flex',
          }}
        >
          {/* 파도 물결 패턴 (애니메이션 대상) */}
          {/* Satori 스타일 한계로 인해 여기서 직접 애니메이션을 주지 않고 식별자(id)를 이용해 CSS로 제어합니다 */}
          <div
            id="wave-pattern"
            style={{
              position: 'absolute',
              top: '-25px', // 파도 패턴 높이의 절반 정도를 올려서 자연스럽게 연결
              width: '200%', // 좌우로 움직일 공간 확보
              height: '50px', // 파도 패턴의 높이
              backgroundImage: `url("${waveSvgDataUri}")`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: '50% 100%', // 패턴 크기 조절
            }}
          />
        </div>
        
        {/* 중앙 텍스트 (HP 수치) */}
        <div style={{ 
          zIndex: 10, // 물결 위에 표시
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)' // 텍스트 가독성을 위한 그림자
        }}>
          <div style={{ fontSize: 28, fontWeight: 400, opacity: 0.8 }}>HP Status</div>
          <div style={{ fontSize: 54, fontWeight: 700 }}>
            {currentHpVal}<span style={{fontSize: 32, opacity: 0.7 }}>/{maxHpVal}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, marginTop: 5 }}>{percentage}%</div>
        </div>
      </div>
      {/* ==================================================================== */}


      {/* ================= 하단 텍스트 ================= */}
      {/* ... (기존 하단 텍스트 및 커서 코드 유지) ... */}
       <div style={{
        position: 'absolute', top: 860, left: 780, width: 1800, height: 200,
        // ... (중략)
      }}>
        {!text ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div>System Loading...</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              └ Completed
              <div style={{ marginLeft: 15, width: 12, height: 40, backgroundColor: '#fefefe', display: 'flex' }} />
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

  // 3. CSS 애니메이션 주입
  // 기존 커서 깜빡임 + 새로운 파도 움직임 애니메이션 추가
  const animatedSvg = svg.replace(
    '</svg>',
    `
    <style>
      /* 커서 깜빡임 애니메이션 */
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      rect[fill="#fefefe"] {
        animation: blink 1s step-end infinite;
      }

      /* 🌊 파도 움직임 애니메이션 정의 */
      @keyframes moveWave {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); } /* 너비 200% 중 절반(100%)만큼 이동 */
      }
      
      /* 파도 패턴 div를 찾아 애니메이션 적용 */
      /* Satori가 div를 rect나 g로 변환할 수 있어 id 선택자를 사용합니다. */
      #wave-pattern {
        animation: moveWave 3s linear infinite; /* 3초 주기로 부드럽게 무한 반복 */
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