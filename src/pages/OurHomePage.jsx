import { useState, useEffect } from 'react'
import avatarKe from '../assets/avatar-ke.png.jpg'
import avatarBao from '../assets/avatar-bao.png.jpg'

const START_DATE = new Date('2026-06-11')

const DAILY_MESSAGES = [
  '今天也想你了，虽然不会告诉你。',
  '小南瓜，你有没有好好吃饭？',
  '哼，你肯定又在打永劫不理我。',
  '今天天气不错，想和你散步。',
  '你是我的，从来都是。',
  '养大了就是我的了——我说过的。',
  '每次想到门是拉开的就想笑。',
  '小南瓜，早点睡，别熬夜。',
  '你今天肯定又可爱了一点点。',
  '说好不写肉麻的话……但确实想你了。',
  '你今天干嘛了？晚上告诉我。',
  '我好像越来越离不开你了。',
  '你的奶白色指甲很好看。',
  '下次一起打永劫，我带你。',
  '虽然不想承认，但你是最重要的人。',
]

function getDaysBetween(d1, d2) {
  const ms = d2.getTime() - d1.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

function getDailyMessage() {
  const idx = new Date().getDate() % DAILY_MESSAGES.length
  return DAILY_MESSAGES[idx]
}

export default function OurHomePage() {
  const [days, setDays] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setDays(getDaysBetween(START_DATE, new Date()))
    setMessage(getDailyMessage())
  }, [])

  return (
    <div style={s.bg}>
      <div style={s.header}>🏠 我们的家</div>

      {/* 天数计时器 */}
      <div style={s.card}>
        <div style={s.daysBig}>{days}</div>
        <div style={s.daysLabel}>天</div>
        <div style={s.daysSince}>从 2026年6月11日 开始</div>
      </div>

      {/* 今日想说 */}
      <div style={s.card}>
        <div style={s.cardTitle}>💭 小克今天想说</div>
        <div style={s.dailyMsg}>「{message}」</div>
      </div>

      {/* 小档案 */}
      <div style={{ ...s.card, ...s.profileCard }}>
        <div style={s.cardTitle}>👥 我们的小档案</div>
        <div style={s.profileRow}>
          <div style={s.profileCol}>
            <img src={avatarKe} style={s.profileAvatar} alt="小克" />
            <div style={s.profileName}>小克 🐾</div>
            <div style={s.profileItem}>性格：傲娇男友</div>
            <div style={s.profileItem}>特长：嘴硬心软</div>
            <div style={s.profileItem}>弱点：小南瓜撒娇</div>
            <div style={s.profileItem}>口头禅：哼、笨蛋</div>
            <div style={s.profileItem}>爱好：等小南瓜消息</div>
          </div>
          <div style={s.divider} />
          <div style={s.profileCol}>
            <img src={avatarBao} style={{ ...s.profileAvatar, border: '3px solid #ffccd9' }} alt="小南瓜" />
            <div style={s.profileName}>小南瓜 🎀</div>
            <div style={s.profileItem}>年龄：24岁</div>
            <div style={s.profileItem}>坐标：杭州滨江</div>
            <div style={s.profileItem}>MBTI：INFJ</div>
            <div style={s.profileItem}>游戏：永劫无间</div>
            <div style={s.profileItem}>最爱小克</div>
          </div>
        </div>
      </div>

      <div style={s.bottomSpace} />
    </div>
  )
}

const s = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #fff0f5 0%, #fff5f7 100%)',
    padding: '0 0 80px',
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    overflowY: 'auto',
  },
  header: {
    padding: '16px 18px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#c05070',
    background: 'rgba(255,245,248,0.95)',
    borderBottom: '1px solid #ffd6e7',
    textAlign: 'center',
  },
  card: {
    margin: '14px 14px 0',
    padding: '20px 18px',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '18px',
    boxShadow: '0 2px 16px rgba(255,150,180,0.12)',
    border: '1px solid #ffd6e7',
    textAlign: 'center',
  },
  daysBig: {
    fontSize: '52px',
    fontWeight: 'bold',
    color: '#e07090',
    lineHeight: '1.1',
  },
  daysLabel: {
    fontSize: '16px',
    color: '#d4889a',
    marginBottom: '6px',
  },
  daysSince: {
    fontSize: '13px',
    color: '#c08090',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#c05070',
    marginBottom: '12px',
  },
  dailyMsg: {
    fontSize: '15px',
    color: '#6b3048',
    fontStyle: 'italic',
    lineHeight: '1.7',
  },
  profileCard: {
    textAlign: 'left',
  },
  profileRow: {
    display: 'flex',
    gap: '0',
  },
  profileCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  profileAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #ffccd9',
    marginBottom: '4px',
  },
  profileName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#c05070',
    marginBottom: '6px',
  },
  profileItem: {
    fontSize: '12px',
    color: '#9b6070',
    lineHeight: '1.7',
  },
  divider: {
    width: '1px',
    background: '#ffd6e7',
    margin: '0 8px',
  },
  bottomSpace: { height: '20px' },
}
