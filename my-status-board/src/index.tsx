import { Hono } from 'hono'
import satori from 'satori'

const app = new Hono()

// [헬퍼 함수] HP 색상 계산
function getHpColor(percentage: number): string {
  if (percentage >= 70) return '#4ade80';
  if (percentage >= 35) return '#facc15';
  return '#ef4444';
}

app.get('/', async (c) => {
  try {
    const { date, time, loc, job, text, hp, maxHp } = c.req.query()
    
    // HP 계산
    const currentHpVal = hp ? parseInt(hp) : 100;
    const maxHpVal = maxHp ? parseInt(maxHp) : 100;
    let percentage = 100;
    if (maxHpVal > 0) {
      percentage = Math.min(Math.max(Math.round((currentHpVal / maxHpVal) * 100), 0), 100);
    }
    const waveColor = getHpColor(percentage);

    // 파도 SVG
    const waveSvgDataUri = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='${encodeURIComponent(waveColor)}' fill-opacity='1' d='M0,64L40,85.3C80,107,160,149,240,165.3C320,181,400,171,480,154.7C560,139,640,117,720,128C800,139,880,181,960,192C1040,203,1120,181,1200,160C1280,139,1360,117,1400,106.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'%3E%3C/path%3E%3C/svg%3E`;

    // 폰트 로딩
    const fontMediumUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf'
    const fontSemiBoldUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-SemiBold.ttf'
    const bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v2%20%EC%99%84%EC%84%B1%EB%B3%B8.png'

    const [fontMediumBuffer, fontSemiBoldBuffer] = await Promise.all([
      fetch(fontMediumUrl).then((res) => { if(!res.ok) throw new Error('Medium Font Fail'); return res.arrayBuffer(); }),
      fetch(fontSemiBoldUrl).then((res) => { if(!res.ok) throw new Error('SemiBold Font Fail'); return res.arrayBuffer(); }),
    ])

    // Satori 렌더링
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
          width="2667"
          height="1144"
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />

        {/* 상단 정보 */}
        <div style={{ position: 'absolute', top: 225, left: 120, fontSize: 60, fontWeight: 600 }}>Date</div>
        <div style={{ position: 'absolute', top: 345, left: 120, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{date || 'N일차'}</div>

        <div style={{ position: 'absolute', top: 225, left: 677, fontSize: 60, fontWeight: 600 }}>Time</div>
        <div style={{ position: 'absolute', top: 345, left: 677, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{time || 'HH:MM'}</div>

        <div style={{ position: 'absolute', top: 225, left: 1230, fontSize: 60, fontWeight: 600 }}>Loc</div>
        <div style={{ position: 'absolute', top: 345, left: 1230, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{loc || '위치'}</div>

        <div style={{ position: 'absolute', top: 225, left: 1795, fontSize: 60, fontWeight: 600 }}>Class</div>
        <div style={{ position: 'absolute', top: 345, left: 1795, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{job || '직업'}</div>

        {/* ======================= HP Wave Circle ======================= */}
        <div
          style={{
            position: 'absolute',
            top: 450,
            left: 100,
            width: 280,
            height: 280,
            borderRadius: '50%',
            border: `6px solid ${waveColor}`,
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${waveColor}80`
          }}
        >
          {/* 수위 조절 컨테이너 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${percentage}%`,
              backgroundColor: waveColor,
              display: 'flex',
            }}
          >
            {/* 파도 패턴 */}
            <div
              id="wave-pattern"
              style={{
                position: 'absolute',
                top: '-25px',
                width: '200%',
                height: '50px',
                backgroundImage: `url("${waveSvgDataUri}")`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: '50% 100%',
              }}
            />
          </div>
          
          {/* HP 텍스트 (수정됨: display: flex 필수!) */}
          <div style={{ 
            zIndex: 10, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 400, opacity: 0.8 }}>HP Status</div>
            
            {/* [수정 포인트] 자식이 둘 이상이므로 display: flex와 정렬 속성 추가 */}
            <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 54, fontWeight: 700 }}>
              {currentHpVal}<span style={{fontSize: 32, opacity: 0.7 }}>/{maxHpVal}</span>
            </div>
            
            <div style={{ display: 'flex', fontSize: 32, fontWeight: 600, marginTop: 5 }}>{percentage}%</div>
          </div>
        </div>

        {/* 관계창 (각 줄에도 안전하게 flex 추가) */}
        <div style={{ position: 'absolute', top: 488, left: 505, fontSize: 48, fontWeight: 600 }}>Relationship</div>
        <div style={{ position: 'absolute', top: 595, left: 530, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
          <div style={{ display: 'flex' }}>관계1: 데이터 없음</div>
          <div style={{ display: 'flex' }}>관계2: 데이터 없음</div>
          <div style={{ display: 'flex' }}>관계3: 데이터 없음</div>
        </div>
        <div style={{ position: 'absolute', top: 595, left: 1230, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
          <div style={{ display: 'flex' }}>관계4: 데이터 없음</div>
          <div style={{ display: 'flex' }}>관계5: 데이터 없음</div>
          <div style={{ display: 'flex' }}>관계6: 데이터 없음</div>
        </div>
        <div style={{ position: 'absolute', top: 595, left: 2030, display: 'flex', flexDirection: 'column', gap: 40, fontSize: 33, fontWeight: 400 }}>
          <div style={{ display: 'flex' }}>관계7: 데이터 없음</div>
          <div style={{ display: 'flex' }}>관계8: 데이터 없음</div>
          <div style={{ display: 'flex' }}>관계9: 데이터 없음</div>
        </div>

        {/* 하단 텍스트 및 커서 */}
        <div style={{
          position: 'absolute', top: 860, left: 780, width: 1800, height: 200,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          fontSize: 40, fontWeight: 400, color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5,
        }}>
          {!text ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex' }}>System Loading...</div>
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

    // CSS 애니메이션 주입
    const animatedSvg = svg.replace(
      '</svg>',
      `
      <style>
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        rect[fill="#fefefe"] { animation: blink 1s step-end infinite; }

        @keyframes moveWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        #wave-pattern { animation: moveWave 3s linear infinite; }
      </style>
      </svg>`
    )

    return new Response(animatedSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

  } catch (e: any) {
    return c.text(`[Server Error Log]\nMessage: ${e.message}\n\nStack: ${e.stack}`, 500);
  }
})

export default app