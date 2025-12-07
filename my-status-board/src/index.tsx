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
    // -------------------------------------------------------------------------
    // 1. 데이터 파싱
    const { date, time, loc, job, text, hp, maxHp } = c.req.query()
    
    // HP 계산 (안전 장치 추가)
    const currentHpVal = hp ? parseInt(hp) : 100;
    const maxHpVal = maxHp ? parseInt(maxHp) : 100;
    let percentage = 100;
    if (maxHpVal > 0) {
      percentage = Math.min(Math.max(Math.round((currentHpVal / maxHpVal) * 100), 0), 100);
    }
    const waveColor = getHpColor(percentage);

    // 파도 SVG (인코딩된 문자열)
    const waveSvgDataUri = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='${encodeURIComponent(waveColor)}' fill-opacity='1' d='M0,64L40,85.3C80,107,160,149,240,165.3C320,181,400,171,480,154.7C560,139,640,117,720,128C800,139,880,181,960,192C1040,203,1120,181,1200,160C1280,139,1360,117,1400,106.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'%3E%3C/path%3E%3C/svg%3E`;

    // -------------------------------------------------------------------------
    // 2. 리소스 로딩 (에러 발생 1순위 지점)
    const fontMediumUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-Medium.ttf'
    const fontSemiBoldUrl = 'https://github.com/CV3-Y/staute/raw/refs/heads/main/HangamePoker-SemiBold.ttf'
    const bgUrl = 'https://raw.githubusercontent.com/CV3-Y/staute/refs/heads/main/v2%20%EC%99%84%EC%84%B1%EB%B3%B8.png'

    // 폰트 로딩 테스트
    const fontMediumRes = await fetch(fontMediumUrl);
    if (!fontMediumRes.ok) throw new Error(`Medium Font Load Failed: ${fontMediumRes.status} ${fontMediumRes.statusText}`);
    const fontMediumBuffer = await fontMediumRes.arrayBuffer();

    const fontSemiBoldRes = await fetch(fontSemiBoldUrl);
    if (!fontSemiBoldRes.ok) throw new Error(`SemiBold Font Load Failed: ${fontSemiBoldRes.status} ${fontSemiBoldRes.statusText}`);
    const fontSemiBoldBuffer = await fontSemiBoldRes.arrayBuffer();

    // -------------------------------------------------------------------------
    // 3. Satori 렌더링
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
        {/* 배경 이미지 */}
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

        {/* HP Wave Circle (왼쪽 빈 공간) */}
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
            {/* 파도 패턴 (CSS 애니메이션용 id 부여) */}
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
          
          {/* HP 텍스트 */}
          <div style={{ 
            zIndex: 10, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            <div style={{ fontSize: 28, fontWeight: 400, opacity: 0.8 }}>HP Status</div>
            <div style={{ fontSize: 54, fontWeight: 700 }}>
              {currentHpVal}<span style={{fontSize: 32, opacity: 0.7 }}>/{maxHpVal}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, marginTop: 5 }}>{percentage}%</div>
          </div>
        </div>

        {/* 관계창 */}
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

        {/* 하단 텍스트 및 커서 */}
        <div style={{
          position: 'absolute', top: 860, left: 780, width: 1800, height: 200,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          fontSize: 40, fontWeight: 400, color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5,
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

    // 4. CSS 애니메이션 주입 (파도 + 커서)
    const animatedSvg = svg.replace(
      '</svg>',
      `
      <style>
        /* 커서 깜빡임 */
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        rect[fill="#fefefe"] { animation: blink 1s step-end infinite; }

        /* 파도 움직임 (수평 이동) */
        @keyframes moveWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* id가 wave-pattern인 div는 Satori에 의해 path나 g로 변환될 수 있으므로,
           배경 이미지가 있는 요소를 찾아 애니메이션을 적용합니다. */
        /* Satori 출력 구조에 따라 id 선택자가 작동하지 않을 수 있어, 
           가장 확실한 방법은 '파도 이미지를 배경으로 가진 요소'를 찾는 것입니다. 
           여기서는 id 선택자를 우선 시도합니다. */
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
    // 💥 에러 발생 시 500 화면 대신 에러 메시지를 출력합니다.
    return c.text(`[Server Error Log]\nMessage: ${e.message}\n\nStack: ${e.stack}`, 500);
  }
})

export default app