// 📺 每日追剧提醒 — Server酱推送
const SCHEDULE = {
  Monday:    [ { name:'尖帽子的魔法工坊', time:'23:00', note:'Netflix/日漫' } ],
  Tuesday:   [ { name:'百炼成神3', time:'10:00', note:'腾讯视频' } ],
  Wednesday: [],
  Thursday:  [ { name:'将夜', time:'11:00', note:'B站' }, { name:'星辰变第七季', time:'10:00', note:'腾讯视频' }, { name:'石纪元第四季', time:'22:00', note:'B站/日漫' } ],
  Friday:    [ { name:'斗破苍穹', time:'10:00', note:'腾讯视频' }, { name:'一人之下', time:'10:00', note:'腾讯视频' }, { name:'沧元图第二季', time:'10:00', note:'腾讯/优酷' }, { name:'大主宰', time:'09:00', note:'爱奇艺' }, { name:'转生史莱姆第四季', time:'22:00', note:'B站/日漫' } ],
  Saturday:  [ { name:'斗罗大陆', time:'10:00', note:'腾讯视频' }, { name:'光阴之外', time:'18:00', note:'优酷SVIP' }, { name:'择天记', time:'09:00', note:'爱奇艺' } ],
  Sunday:    [ { name:'成何体统2', time:'09:00', note:'爱奇艺' }, { name:'钻石王牌第四季', time:'16:30', note:'日漫' }, { name:'仙逆', time:'18:00', note:'腾讯SVIP' }, { name:'牧神记', time:'11:00', note:'B站' }, { name:'春夏秋冬代行者', time:'00:30', note:'B站/日漫' }, { name:'杖与剑的魔剑谭第二季', time:'15:30', note:'B站/日漫' } ],
};

// 已完结/无新作的推荐动漫（每天轮换一条）
const RECOMMENDS = [
  '恶役千金LV99',
  '奇幻自卫队',
  '动物狂想曲（最终季）',
  '盾之勇者成名录',
  '金牌得主',
  '状态异常',
];

const DAY_CN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_MAP = { Sunday:'周日', Monday:'周一', Tuesday:'周二', Wednesday:'周三',
  Thursday:'周四', Friday:'周五', Saturday:'周六' };

function getBJ() {
  const d = new Date();
  return new Date(d.getTime() + 8 * 3600000);
}

async function main() {
  const now = getBJ();
  const todayKey = DAY_CN[now.getUTCDay()];
  const dayCn = DAY_MAP[todayKey];
  const dayIdx = now.getUTCDay(); // 0=周日
  const shows = SCHEDULE[todayKey] || [];

  // 标题
  const names = shows.map(s => `${s.name}${s.time ? '('+s.time+')' : ''}`).join(' ');
  const title = shows.length ? `📺${dayCn} ${names}` : `📺${dayCn} 休息一天`;

  // 详情
  let desp = `### ${dayCn}追剧清单\n\n`;
  if (!shows.length) {
    desp += '今天没有更新，休息一天～ 🎉\n\n';
  } else {
    desp += '| 剧名 | 时间 | 平台 |\n|---|---|---|\n';
    for (const s of shows) desp += `| ${s.name} | ${s.time||'-'} | ${s.note||'-'} |\n`;
  }

  // 推荐一栏
  desp += `\n---\n📌 **推荐补番**\n`;
  for (const r of RECOMMENDS) desp += `- ${r}\n`;
  desp += '\n> 🎬 前往 [追剧日历](https://k423cp-sketch.github.io/tv-reminder/tv-calendar.html) 查看完整一周';

  const sendkey = process.env.SENDKEY;
  if (!sendkey) { console.error('❌ 未设置 SENDKEY'); process.exit(1); }

  const r = await fetch(`https://sctapi.ftqq.com/${sendkey}.send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, desp }),
  });
  const result = await r.json();
  if (result.code === 0) {
    console.log(`✅ 推送成功: ${title}`);
    console.log(`📌 推荐列表: ${RECOMMENDS.join(', ')}`);
  } else {
    console.error('❌ 推送失败:', JSON.stringify(result));
    process.exit(1);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
