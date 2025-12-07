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
  // 주의: 애니메이션 대상인 커서(|)에 고유 클래스 이름(blink-cursor)을 줄 수 없으므로,
  // id를 부여하거나, SVG 구조상 유일한 span 태그임을 이용합니다.
  const svgObject = await satori(
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

      {/* ... (상단 정보 및 관계창 코드는 그대로 유지) ... */}
      
      {/* [Date] */}
      <div style={{ position: 'absolute', top: 225, left: 120, fontSize: 60, fontWeight: 600 }}>Date</div>
      <div style={{ position: 'absolute', top: 345, left: 120, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{date || 'N일차'}</div>

      {/* [Time] */}
      <div style={{ position: 'absolute', top: 225, left: 677, fontSize: 60, fontWeight: 600 }}>Time</div>
      <div style={{ position: 'absolute', top: 345, left: 677, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{time || 'HH:MM'}</div>

      {/* [Loc] */}
      <div style={{ position: 'absolute', top: 225, left: 1230, fontSize: 60, fontWeight: 600 }}>Loc</div>
      <div style={{ position: 'absolute', top: 345, left: 1230, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{loc || '위치'}</div>

      {/* [Class] */}
      <div style={{ position: 'absolute', top: 225, left: 1795, fontSize: 60, fontWeight: 600 }}>Class</div>
      <div style={{ position: 'absolute', top: 345, left: 1795, display: 'flex', fontSize: 32, fontWeight: 400, color: '#ffffff' }}>{job || '직업'}</div>

      {/* [Relationship] */}
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

      {/* ================= 3. 하단 텍스트 (커서에 ID 부여) ================= */}
      <div style={{
        position: 'absolute', top: 860, left: 780, width: 1800, height: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 400,
        color: 'white'
      }}>
        {text || '입력 대기 중...'}
        {/* ▼ Satori에서는 id 속성이 SVG path의 id로 변환될 수 있어 주의해야 하지만, 
            애니메이션 타겟팅을 위해 유니크한 스타일을 줍니다. */}
        <span style={{ marginLeft: '5px', fontWeight: 600, display: 'flex' }}>|</span>
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

  // 3. SVG 문자열 조작 (CSS 애니메이션 강제 주입)
  // Satori가 생성한 SVG는 <svg ...> 태그로 시작합니다.
  // 이 태그 바로 뒤에 <style> 태그를 붙여넣습니다.
  
  // [핵심] 커서(|)를 찾기 위해, SVG 내부 구조상 맨 마지막에 그려지는 text나 path를 타겟팅합니다.
  // Satori는 텍스트를 <path>나 <text>로 변환하는데, '|' 문자는 보통 <path>로 변환됩니다.
  // 가장 확실한 방법은 nth-last-child 선택자를 쓰는 것입니다.

  const css = `
    <style>
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      /* SVG 내부의 모든 경로(path) 중, 마지막 요소(커서)에 애니메이션 적용 */
      /* 주의: 배경이나 다른 글자가 마지막일 수도 있으니 확인 필요. 
         안전하게는 g 태그의 마지막 자식을 타겟팅합니다. */
      g:last-child > path:last-child {
        animation: blink 1s step-end infinite;
      }
      /* 혹시 text 태그로 렌더링될 경우를 대비 */
      text:last-child {
        animation: blink 1s step-end infinite;
      }
    </style>
  `

  // <svg ...> 태그 닫는 괄호(>) 뒤에 style을 넣습니다.
  const animatedSvg = svgObject.replace('>', `>${css}`)

  return new Response(animatedSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      // 캐시 무효화 (애니메이션 확인용)
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
})

export default app