@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
:root { --bg: #f4f7f6; --main: #064e3b; --accent: #fbbf24; }
body { font-family: 'Cairo', sans-serif; background: var(--bg); margin: 0; padding-bottom: 160px; direction: rtl; }

/* هيدر منضبط */
.main-header { background: var(--main); color: white; padding: 25px 10px; text-align: center; border-bottom: 4px solid var(--accent); }
.main-header h1 { font-size: 20px; margin: 0; }

/* زر التليجرام */
.telegram-btn { display: block; background: #0088cc; color: white !important; text-align: center; padding: 12px; margin: 15px auto; width: 85%; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; }

/* شبكة الكروت منضبطة */
.menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 10px; }
.card { background: white; padding: 15px 5px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; border-bottom: 3px solid var(--main); }
.card i { font-size: 24px; color: var(--main); margin-bottom: 8px; display: block; }
.card span { font-size: 13px; font-weight: bold; }

/* مشغل صوتي نحيف لا يغطي الشاشة */
.player-bar { position: fixed; bottom: 0; width: 100%; background: #011d17; color: white; padding: 10px 0; z-index: 999; border-top: 3px solid var(--accent); }
.player-title { text-align: center; font-size: 12px; margin-bottom: 8px; color: var(--accent); }
.player-controls { display: flex; justify-content: center; align-items: center; gap: 20px; }
.play-main-btn { background: white; color: #011d17; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

.hidden { display: none; }
.prayer-section { padding: 10px; }
.prayer-box { display: grid; grid-template-columns: repeat(5, 1fr); background: white; border-radius: 10px; padding: 8px; border: 1px solid var(--accent); }