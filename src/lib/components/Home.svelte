<script lang="ts">

	/* ── data ── */
	const tracks = [
		{ id:'01', name:'THE BLUEPRINT',   category:'OPEN INNOVATION', emoji:'📐',
		  color:'#1E4FCC', colorDim:'#0D2B7A', border:'#2A60E0', img:'/blueprint.png',
		  desc:'Build anything you can dream up. No boundaries, no limits — just pure creativity. From AI agents to social platforms, if it solves a problem, it belongs here.' },
		{ id:'02', name:'CYPHER THE CASH', category:'FINTECH',          emoji:'💰',
		  color:'#2E7D32', colorDim:'#1B4A1E', border:'#3E9C44', img:'/Wallet.png',
		  desc:'Reimagine how money moves. Build the next-gen wallet, lending protocol, or financial tool. Blockchain, AI trading, or simple budgeting — surprise us.' },
		{ id:'03', name:'THE SIMULATION',  category:'GAMIFICATION',     emoji:'🎮',
		  color:'#B8860B', colorDim:'#7A5800', border:'#D4A00D', img:'/controller.png',
		  desc:'Turn anything into a game. Points, leaderboards, quests — make learning, fitness, or productivity addictive. If it has XP bars, it counts.' },
	];

	const logItems = [
		{ icon:'💡', label:'Loading ideas',      pct:100, done:true  },
		{ icon:'</>', label:'Loading workshops',  pct:100, done:true  },
		{ icon:'👥', label:'Loading mentors',    pct:100, done:true  },
		{ icon:'🏆', label:'Loading challenges', pct:100, done:true  },
		{ icon:'🎁', label:'Loading surprises',  pct:100, done:true  },
		{ icon:'🎉', label:'Loading results',     pct:0,   done:false },
	];

	const timelineEvents = [
		{ date:'JUN 10', title:'OPENING CEREMONY',  desc:'Kickoff call + team formation',   marker:'$' },
		{ date:'JUN 17', title:'GAME NIGHT',         desc:'Chill, connect, compete',         marker:'>' },
		{ date:'JUN 24', title:'CREATIVE WORKSHOP',  desc:'Idea validation + design sprint', marker:'*' },
		{ date:'JUL 01', title:'MIDWAY UPDATE',      desc:'Project check-in + feedback',     marker:'#' },
		{ date:'JUL 08', title:'DEV WORKSHOP',        desc:'Shipping & deployment tips',      marker:'/' },
		{ date:'JUL 15', title:'GAME NIGHT',          desc:'Pre-finale chill session',        marker:'>' },
		{ date:'JUL 22', title:'PROJECT SHOWCASES',   desc:'Final submissions & demos',       marker:'@' },
		{ date:'JUL 30', title:'RESULTS',             desc:'Winners announced!',              marker:'!' },
	];

	/* floating pixels – deterministic positions */
	const pixels = Array.from({ length: 22 }, (_, i) => ({
		id: i,
		left:     ((i * 4.7)  % 95) + 2,
		delay:    (i * 0.41)  % 8,
		duration: 8 + (i * 0.6) % 7,
		size:     [8, 8, 12, 8, 8, 16][i % 6],
		color:    ['#EA4335','#4285F4','#34A853','#FBBC05','#4A9FE8','#FF8C42'][i % 6],
	}));

	let cursorVisible = $state(true);

	/* ── countdown ── */
	let cdD = $state('00');
	let cdH = $state('00');
	let cdM = $state('00');
	let cdS = $state('00');
	const countdownTarget = new Date(2026, 5, 10, 9, 0, 0).getTime();

	function pad(n: number) { return String(n).padStart(2, '0'); }

	function updateCountdown() {
		const diff = countdownTarget - Date.now();
		if (diff <= 0) { cdD = '00'; cdH = '00'; cdM = '00'; cdS = '00'; return; }
		const total = Math.floor(diff / 1000);
		cdD = pad(Math.floor(total / 86400));
		cdH = pad(Math.floor((total % 86400) / 3600));
		cdM = pad(Math.floor((total % 3600) / 60));
		cdS = pad(total % 60);
	}

	$effect(() => {
		updateCountdown();
		const cdIv  = setInterval(updateCountdown, 1000);
		const curIv = setInterval(() => { cursorVisible = !cursorVisible; }, 600);
		return () => { clearInterval(cdIv); clearInterval(curIv); };
	});

	/* ── particle cursor trail ── */
	let particleCanvas: HTMLCanvasElement;
	let mouseX = $state(-1000);
	let mouseY = $state(-1000);
	let isPointerDown = $state(false);
	let isMobile = $state(false);

	interface Particle {
		x: number; y: number;
		vx: number; vy: number;
		life: number; maxLife: number;
		size: number;
		color: string;
	}

	const PARTICLE_COLORS = ['#EA4335','#4285F4','#34A853','#FBBC05','#4A9FE8','#FF8C42','#fff'];
	let particles: Particle[] = $state([]);
	let animFrameId: number | null = null;
	let lastSpawn = 0;

	function spawnParticles(x: number, y: number, count: number) {
		const now = performance.now();
		if (now - lastSpawn < 30) return;
		lastSpawn = now;
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 0.5 + Math.random() * 2.5;
			particles.push({
				x, y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 0.5,
				life: 1,
				maxLife: 0.5 + Math.random() * 0.8,
				size: 2 + Math.random() * 5,
				color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
			});
		}
	}

	function animateParticles() {
		if (!particleCanvas) return;
		const ctx = particleCanvas.getContext('2d')!;
		const w = particleCanvas.width;
		const h = particleCanvas.height;

		ctx.clearRect(0, 0, w, h);

		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i];
			p.x += p.vx;
			p.y += p.vy;
			p.vy += 0.03;
			p.life -= (1 / 60) / p.maxLife;

			if (p.life <= 0) {
				particles.splice(i, 1);
				continue;
			}

			const alpha = p.life * p.life;
			const size = p.size * p.life;
			ctx.globalAlpha = alpha;
			ctx.fillStyle = p.color;
			ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

			if (size > 2) {
				ctx.globalAlpha = alpha * 0.3;
				ctx.fillRect(p.x - size, p.y - size, size * 2, size * 2);
			}
		}
		ctx.globalAlpha = 1;

		animFrameId = requestAnimationFrame(animateParticles);
	}

	function handlePointerMove(e: PointerEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		const count = isPointerDown ? 8 : (isMobile ? 0 : 2);
		spawnParticles(e.clientX, e.clientY, count);
	}

	function handlePointerDown() { isPointerDown = true; }
	function handlePointerUp() { isPointerDown = false; }

	$effect(() => {
		if (!particleCanvas) return;

		isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

		function resize() {
			if (!particleCanvas) return;
			particleCanvas.width = window.innerWidth;
			particleCanvas.height = document.documentElement.scrollHeight;
		}
		resize();
		window.addEventListener('resize', resize);
		window.addEventListener('scroll', resize);

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('pointerup', handlePointerUp);

		animFrameId = requestAnimationFrame(animateParticles);

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('scroll', resize);
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('pointerup', handlePointerUp);
			if (animFrameId) cancelAnimationFrame(animFrameId);
		};
	});
</script>

<div class="page">

<!-- particle cursor trail canvas -->
<canvas bind:this={particleCanvas} class="particle-canvas" aria-hidden="true"></canvas>

<!-- ═══════════════════════════════════════
     HERO
════════════════════════════════════════ -->
<section class="hero">
	<div class="scanlines" aria-hidden="true"></div>

	<!-- floating pixel particles -->
	<div class="pixel-particles" aria-hidden="true">
		{#each pixels as p}
			<div class="pixel-dot"
				style="left:{p.left}%;width:{p.size}px;height:{p.size}px;background:{p.color};animation-delay:{p.delay}s;animation-duration:{p.duration}s">
			</div>
		{/each}
	</div>

	<!-- HUD -->
	<div class="hud">
		<div class="hud-stats">
			<div class="stat-row"><span>❤</span><span class="sl">HP</span><div class="sbar"><div class="sf hp"></div></div><span class="sn">100/100</span></div>
			<div class="stat-row"><span>★</span><span class="sl">XP</span><div class="sbar"><div class="sf xp"></div></div><span class="sn">00100</span></div>
		</div>
		<div class="system-box">
			<div class="sys-hdr">SYSTEM</div>
			<div class="sys-ln"><span class="sk">ORG:</span> GDG</div>
			<div class="sys-ln"><span class="sk">MODE:</span> Summer</div>
			<div class="sys-ln"><span class="sk">STATUS:</span> Active</div>
		</div>
	</div>

	<!-- two-col body -->
	<div class="hero-body">
		<div class="hero-text">
			<div class="bracket br-tl"></div>
			<div class="bracket br-br"></div>

			<div class="gdg-row">
				<img src="/GDG logo pixel.png" alt="GDG" class="gdg-img" />
	<span class="gdg-label">GOOGLE DEVELOPER GROUPS</span>
			</div>

			<div class="title-block">
				<div class="event-pill">6-WEEK VIRTUAL HACKATHON</div>
				<h1 class="hackwave-title">HACK<br>WAVE</h1>
				<p class="beat">BEAT THE HEAT</p>
			</div>

			<div class="info-strip">
				<div class="ic"><span class="ik">DATE</span><span class="iv">JUNE 10 –<br>JULY 22, 2026</span></div>
				<div class="idiv"></div>
				<div class="ic"><span class="ik">FORMAT</span><span class="iv">VIRTUAL</span></div>
				<div class="idiv"></div>
				<div class="ic"><span class="ik">DURATION</span><span class="iv">6 WEEKS</span></div>
			</div>

			<div class="hero-icons">
				<div class="hi"><span class="his">&lt;/&gt;</span><span class="hil">BUILD</span></div>
				<div class="hi"><span class="his">👥</span><span class="hil">COLLAB</span></div>
				<div class="hi"><span class="his">&gt;_</span><span class="hil">LEARN</span></div>
				<div class="hi"><span class="his">🏆</span><span class="hil">WIN</span></div>
			</div>

			<a href="/leaderboard" class="leaderboard-cta">
				VIEW LEADERBOARD →
			</a>
		</div>
	</div>

	<div class="ticker-bar">
		<span class="ticker-text">
			&gt;&gt;&gt; IDEAS FLOW. IMPACT GROWS. &nbsp;· · · · · · · · · · · · ·&nbsp; READY? LET'S HACK. &gt;&gt;&gt; &nbsp;&nbsp;&nbsp;&nbsp;
			&gt;&gt;&gt; IDEAS FLOW. IMPACT GROWS. &nbsp;· · · · · · · · · · · · ·&nbsp; READY? LET'S HACK. &gt;&gt;&gt;
		</span>
	</div>
</section>

<!-- ═══════════════════════════════════════
     TRACKS
════════════════════════════════════════ -->
<section class="tracks-section">
	<div class="section-hdr">
		<div class="section-sub">// SELECT YOUR PATH</div>
		<h2 class="section-title">TRACKS</h2>
	</div>

	<div class="tracks-grid">
		{#each tracks as t}
			<div class="track-card" style="--tc:{t.color};--tcd:{t.colorDim};--tcb:{t.border}">
				<div class="tbadge">TRACK_{t.id}</div>
				<h3 class="tname">{t.name}</h3>
				<div class="tcat">+ {t.category} +</div>
			<div class="ticon-wrap">
				<img src={t.img} alt={t.name} class="timgy" />
			</div>
				<div class="tdesc">{t.desc}</div>
			</div>
		{/each}
	</div>

	<div class="palm palm-l">🌴</div>
	<div class="palm palm-r">🌴</div>
</section>

<!-- ═══════════════════════════════════════
     PRIZE POOL
════════════════════════════════════════ -->
<section class="prize-section">
	<div class="prize-grid">
		<div class="prize-head">
			<div class="section-hdr">
				<div class="section-sub">// REWARDS</div>
				<h2 class="section-title">PRIZE POOL</h2>
			</div>
			<div class="prize-big">
				<span class="prize-amount">₹7.5K</span>
				<span class="prize-label">TOTAL PRIZES</span>
			</div>
		</div>


	</div>
</section>

<!-- ═══════════════════════════════════════
     HEATWAVE TIMELINE
════════════════════════════════════════ -->
<section class="timeline-section">
	<div class="section-hdr">
		<div class="section-sub">// HEATWAVE TIMELINE</div>
		<h2 class="section-title">THE JOURNEY</h2>
	</div>

	<div class="timeline">
		{#each timelineEvents as event, i}
			<div class="tl-event" class:tl-left={i % 2 === 0}>
				<div class="tl-marker">{event.marker}</div>
				<div class="tl-card">
					<div class="tl-date">{event.date}</div>
					<h3 class="tl-title">{event.title}</h3>
					<p class="tl-desc">{event.desc}</p>
				</div>
			</div>
		{/each}
		<div class="tl-line" aria-hidden="true"></div>
	</div>
</section>

<!-- ═══════════════════════════════════════
     EVENT LOG
════════════════════════════════════════ -->
<section class="log-section">
	<div class="log-panel">
		<div class="log-head">
			<span class="log-title">EVENT LOG</span>
			<span class="log-status">LOADING SUMMER UPDATE...</span>
		</div>
		<div class="log-body">
			{#each logItems as item}
				<div class="log-row">
					<span class="licon">{item.icon}</span>
					<span class="llabel">{item.label}</span>
					<div class="ldots">· · · · · · · · · · · · ·</div>
					<div class="lbar"><div class="lfill" class:done={item.done} style="width:{item.pct}%"></div></div>
					<span class="lpct">{item.pct}%</span>
				</div>
			{/each}
			<div class="lalmost">⌛ Almost there...</div>
		</div>
	</div>
</section>

<!-- footer -->
<div class="footer">
	<span class="fprompt">&gt; stay_tuned...<span class="cur" class:off={!cursorVisible}>█</span></span>
	<div class="fdots"><span></span><span></span><span></span></div>
</div>

</div>

<style>
/* ── page ── */
.page { min-height: 100vh; background: var(--sand); overflow-x: hidden; }

/* particle canvas */
.particle-canvas {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 9999;
}

/* ── hero ── */
.hero {
	background: var(--navy);
	display: flex;
	flex-direction: column;
	height: 100vh;
	min-height: 600px;
	position: relative;
	overflow: hidden;
}

.scanlines {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px);
	pointer-events: none;
	z-index: 20;
	animation: flicker 10s ease-in-out infinite;
}

@keyframes flicker {
	0%,94%,100% { opacity:1; }
	95% { opacity:0.93; }
	96.5% { opacity:0.98; }
	98%  { opacity:0.9; }
}

/* floating pixels */
.pixel-particles {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
	z-index: 2;
}

.pixel-dot {
	position: absolute;
	bottom: -20px;
	opacity: 0;
	animation: floatUp linear infinite;
}

@keyframes floatUp {
	0%   { transform: translateY(0)    rotate(0deg);   opacity: 0; }
	8%   { opacity: 0.55; }
	90%  { opacity: 0.35; }
	100% { transform: translateY(-105vh) rotate(180deg); opacity: 0; }
}

/* HUD */
.hud {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 0.9rem 1.5rem;
	flex-shrink: 0;
	z-index: 10;
	position: relative;
}

.hud-stats {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
	background: rgba(245,230,200,0.96);
	border: 2px solid var(--navy);
	padding: 0.5rem 0.8rem;
	box-shadow: 3px 3px 0 rgba(255,255,255,0.1);
}

.stat-row {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	font-family: var(--pixel);
	font-size: 0.55rem;
	color: var(--navy);
	white-space: nowrap;
}

.sl { min-width: 1.2rem; }
.sn { font-size: 0.48rem; }

.sbar { width:80px; height:8px; background:#C8B898; border:1.5px solid var(--navy); overflow:hidden; }
.sf   { height:100%; }
.sf.hp { width:100%; background:#E03030; }
.sf.xp { width:30%;  background:#D4A200; }

.system-box {
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
	background: rgba(10,22,40,0.96);
	border: 2px solid #4A9FE8;
	padding: 0.5rem 1rem;
	box-shadow: 3px 3px 0 rgba(74,159,232,0.3);
}

.sys-hdr { font-family:var(--pixel); font-size:0.52rem; color:#4A9FE8; border-bottom:1px solid #1A4FAD; padding-bottom:0.25rem; margin-bottom:0.15rem; letter-spacing:0.1em; }
.sys-ln  { font-family:var(--terminal); font-size:1.05rem; color:rgba(180,220,255,0.88); line-height:1.35; }
.sk { color:#6BBDE8; }

/* hero body */
.hero-body {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 0;
	position: relative;
	z-index: 5;
}

/* hero text */
.hero-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 2rem;
	gap: 1.6rem;
	position: relative;
	text-align: center;
	max-width: 700px;
}

.bracket { position:absolute; width:20px; height:20px; z-index:2; }
.br-tl { top:1rem; left:1.5rem; border-top:3px solid #4A9FE8; border-left:3px solid #4A9FE8; }
.br-br { bottom:1rem; right:2.5rem; border-bottom:3px solid #4A9FE8; border-right:3px solid #4A9FE8; }

@media (max-width: 500px) {
	.bracket { width:14px; height:14px; }
	.br-tl { top:0.5rem; left:0.5rem; border-width:2px; }
	.br-br { bottom:0.5rem; right:0.5rem; border-width:2px; }
}

.gdg-row  { display:flex; align-items:center; gap:0.75rem; }
.gdg-img  { width:42px; height:42px; object-fit:contain; flex-shrink:0; }
.gdg-label { font-family:var(--pixel); font-size:0.42rem; color:rgba(200,230,255,0.5); letter-spacing:0.1em; line-height:1.7; }

.title-block { display:flex; flex-direction:column; gap:0.5rem; }

.event-pill {
	font-family:var(--pixel); font-size:0.5rem;
	color:rgba(200,230,255,0.55); letter-spacing:0.12em;
	border:1px solid rgba(74,159,232,0.3);
	padding:0.4rem 0.75rem; width:fit-content;
}

.hackwave-title {
	font-family: var(--pixel);
	font-size: clamp(3.2rem, 7vw, 6.5rem);
	line-height: 1.2;
	color: #fff;
	letter-spacing: 0.04em;
	text-shadow: 6px 6px 0 rgba(74,159,232,0.3);
	animation: glitch 7s ease-in-out infinite;
}

@keyframes glitch {
	0%,87%,100% { text-shadow:6px 6px 0 rgba(74,159,232,0.3); transform:translate(0,0); filter:none; }
	88%   { text-shadow:-5px 0 #ff3366, 5px 0 #33ccff; transform:translate(-3px,0) skewX(-1deg); filter:brightness(1.1); }
	89.5% { text-shadow: 5px 0 #ff3366,-5px 0 #33ccff; transform:translate(3px,0) skewX(1deg); }
	91%   { text-shadow:-5px 0 #ff3366, 5px 0 #33ccff; transform:translate(-1px,1px); }
	92%   { text-shadow:6px 6px 0 rgba(74,159,232,0.3); transform:translate(0,0); filter:none; }
}

.beat { font-family:var(--pixel); font-size:0.75rem; color:rgba(200,230,255,0.7); letter-spacing:0.22em; }

.info-strip { display:flex; align-items:stretch; justify-content:center; border:1.5px solid rgba(74,159,232,0.35); }
.ic { display:flex; flex-direction:column; gap:0.3rem; padding:0.7rem 1rem; flex:1; }
.idiv { width:1.5px; background:rgba(74,159,232,0.3); flex-shrink:0; }
.ik { font-family:var(--pixel); font-size:0.38rem; color:#4A9FE8; letter-spacing:0.14em; }
.iv { font-family:var(--pixel); font-size:0.55rem; color:#fff; letter-spacing:0.05em; line-height:1.6; }

.hero-icons { display:flex; justify-content:center; gap:1.5rem; }
.hi { display:flex; flex-direction:column; align-items:center; gap:0.35rem; }
.his { font-family:var(--pixel); font-size:0.7rem; color:rgba(200,230,255,0.9); }
.hil { font-family:var(--pixel); font-size:0.35rem; color:rgba(200,230,255,0.5); letter-spacing:0.1em; }

.register-cta {
	display: inline-block;
	background: #fff;
	color: var(--navy);
	font-family: var(--pixel);
	font-size: 0.65rem;
	letter-spacing: 0.12em;
	padding: 1rem 2rem;
	text-decoration: none;
	width: fit-content;
	animation: ctaGlow 2.5s ease-in-out infinite;
	transition: transform 0.1s, box-shadow 0.1s;
}

@keyframes ctaGlow {
	0%,100% { box-shadow: 5px 5px 0 #4A9FE8; }
	50%     { box-shadow: 5px 5px 0 #4A9FE8, 0 0 28px rgba(74,159,232,0.4); }
}

.register-cta:hover {
	transform: translate(-3px,-3px);
	box-shadow: 8px 8px 0 #4A9FE8, 0 0 40px rgba(74,159,232,0.45) !important;
	animation: none;
}

.register-cta:active { transform:translate(2px,2px); box-shadow:3px 3px 0 #4A9FE8 !important; }

.leaderboard-cta {
	display: inline-block;
	background: transparent;
	color: var(--sand);
	font-family: var(--pixel);
	font-size: 0.55rem;
	letter-spacing: 0.12em;
	padding: 1rem 1.6rem;
	margin-left: 0.9rem;
	text-decoration: none;
	width: fit-content;
	border: 2px solid var(--blue-crest);
	transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
	box-shadow: 5px 5px 0 rgba(107, 189, 232, 0.55);
}

.leaderboard-cta:hover {
	transform: translate(-3px,-3px);
	background: rgba(107, 189, 232, 0.08);
	box-shadow: 8px 8px 0 rgba(107, 189, 232, 0.7);
}

.leaderboard-cta:active { transform:translate(2px,2px); box-shadow:3px 3px 0 rgba(107, 189, 232, 0.55) !important; }

/* ticker */
.ticker-bar { background:#050E22; border-top:2px solid #1A5FAD; overflow:hidden; padding:0.65rem 0; white-space:nowrap; flex-shrink:0; z-index:10; position:relative; }
.ticker-text { display:inline-block; font-family:var(--pixel); font-size:0.5rem; color:rgba(200,230,255,0.6); letter-spacing:0.12em; animation:ticker 26s linear infinite; }

@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* ═══════════ COUNTDOWN ═══════════ */
.countdown-section {
	background: #0A1628;
	padding: 3.5rem 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	border-top: 3px solid #1A5FAD;
	border-bottom: 3px solid #1A5FAD;
	position: relative;
	overflow: hidden;
}

.countdown-section::before {
	content: '';
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(74,159,232,0.06) 1px, transparent 1px),
		linear-gradient(90deg, rgba(74,159,232,0.06) 1px, transparent 1px);
	background-size: 32px 32px;
	pointer-events: none;
}

.cd-label {
	font-family: var(--terminal);
	font-size: 1.3rem;
	color: rgba(200,230,255,0.45);
	letter-spacing: 0.2em;
	position: relative;
}

.cd-grid {
	display: flex;
	align-items: center;
	gap: 1rem;
	position: relative;
}

.cd-unit {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.cd-num {
	font-family: var(--pixel);
	font-size: clamp(2.5rem, 6vw, 5rem);
	color: #fff;
	line-height: 1;
	background: rgba(74,159,232,0.08);
	border: 2px solid rgba(74,159,232,0.35);
	padding: 0.6rem 1rem;
	min-width: 6rem;
	text-align: center;
	box-shadow: 0 0 20px rgba(74,159,232,0.12), inset 0 0 20px rgba(74,159,232,0.05);
	letter-spacing: 0.05em;
	text-shadow: 0 0 20px rgba(74,159,232,0.6);
}

.cd-num.cd-secs {
	color: #FFD740;
	border-color: rgba(255,215,64,0.35);
	box-shadow: 0 0 20px rgba(255,215,64,0.12), inset 0 0 20px rgba(255,215,64,0.05);
	text-shadow: 0 0 20px rgba(255,215,64,0.6);
}

.cd-sub {
	font-family: var(--pixel);
	font-size: 0.42rem;
	color: rgba(200,230,255,0.45);
	letter-spacing: 0.15em;
}

.cd-colon {
	font-family: var(--pixel);
	font-size: clamp(2rem, 5vw, 4rem);
	color: rgba(74,159,232,0.5);
	margin-bottom: 1.4rem;
	animation: colonBlink 1s ease-in-out infinite;
}

@keyframes colonBlink {
	0%,100% { opacity: 0.5; }
	50%     { opacity: 0.15; }
}

.cd-date {
	font-family: var(--pixel);
	font-size: 0.55rem;
	color: rgba(200,230,255,0.4);
	letter-spacing: 0.14em;
	position: relative;
}

/* ═══════════ TRACKS ═══════════ */
.tracks-section {
	background: var(--sand);
	padding: 5rem 3rem 6rem;
	position: relative;
	overflow: hidden;
}

.tracks-section::before {
	content: '';
	position: absolute;
	inset: 0;
	background:
		radial-gradient(ellipse at 15% 60%, rgba(210,180,120,0.3) 0%, transparent 55%),
		radial-gradient(ellipse at 85% 20%, rgba(230,200,130,0.25) 0%, transparent 50%);
	pointer-events: none;
}

.section-hdr  { text-align:center; margin-bottom:3.5rem; }
.section-sub  { font-family:var(--terminal); font-size:1.3rem; color:rgba(10,22,40,0.4); letter-spacing:0.18em; margin-bottom:0.5rem; }
.section-title { font-family:var(--pixel); font-size:clamp(1.5rem,3.5vw,2.5rem); color:var(--navy); letter-spacing:0.1em; }

.tracks-grid {
	display: grid;
	grid-template-columns: repeat(3,1fr);
	gap: 2rem;
	max-width: 1100px;
	margin: 0 auto;
	position: relative;
	z-index: 1;
}

.track-card {
	background: var(--cream);
	border: 3px solid var(--navy);
	box-shadow: 6px 6px 0 var(--navy);
	padding: 2rem 1.5rem 1.75rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 1rem;
	position: relative;
	transition: transform 0.12s, box-shadow 0.12s;
	cursor: default;
}

.track-card:hover { transform:translate(-4px,-4px); box-shadow:10px 10px 0 var(--navy); }
.track-card::before { content:'✦'; position:absolute; top:0.7rem; right:0.9rem; font-size:0.75rem; color:rgba(10,22,40,0.18); }

.tbadge { font-family:var(--pixel); font-size:0.55rem; letter-spacing:0.1em; background:var(--navy); color:#fff; padding:0.4rem 0.9rem; }
.tname  { font-family:var(--pixel); font-size:clamp(0.85rem,1.5vw,1.1rem); line-height:1.6; color:var(--tc); letter-spacing:0.05em; }
.tcat   { font-family:var(--pixel); font-size:0.42rem; color:var(--navy); letter-spacing:0.12em; opacity:0.6; }

.ticon-wrap {
	background: linear-gradient(135deg,var(--tcd),var(--tc));
	border: 3px solid var(--navy);
	width:88px; height:88px;
	display:flex; align-items:center; justify-content:center;
	box-shadow: 4px 4px 0 var(--navy);
	overflow: hidden;
}

.timgy {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.tdesc {
	border:2px solid var(--tcb);
	padding:0.9rem 1rem 1.2rem;
	width:100%;
	text-align:left;
	position:relative;
	background:rgba(255,255,255,0.45);
	font-family: var(--terminal);
	font-size: 1.05rem;
	color: var(--tc);
	line-height: 1.5;
	letter-spacing: 0.03em;
}

.tdesc::before { content:''; position:absolute; top:0; left:0; border-style:solid; border-width:12px 12px 0 0; border-color:var(--tcb) transparent transparent transparent; }

.palm { position:absolute; bottom:0; font-size:6rem; opacity:0.28; pointer-events:none; line-height:1; }
.palm-l { left:-0.5rem; }
.palm-r { right:-0.5rem; transform:scaleX(-1); }

/* ═══════════ TIMELINE ═══════════ */
.timeline-section {
	background: #0A1628;
	padding: 5rem 3rem 6rem;
	position: relative;
	overflow: hidden;
	border-top: 3px solid #1A5FAD;
}

.timeline-section::before {
	content: '';
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(74,159,232,0.04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(74,159,232,0.04) 1px, transparent 1px);
	background-size: 24px 24px;
	pointer-events: none;
}

.timeline {
	position: relative;
	max-width: 700px;
	margin: 0 auto;
	padding: 2rem 0;
}

.tl-line {
	position: absolute;
	left: 50%;
	top: 0;
	bottom: 0;
	width: 2px;
	background: linear-gradient(to bottom, transparent, #4A9FE8, #4A9FE8, transparent);
	transform: translateX(-50%);
}

.tl-event {
	display: flex;
	align-items: flex-start;
	gap: 1.5rem;
	margin-bottom: 2.5rem;
	position: relative;
}

.tl-event:last-child { margin-bottom: 0; }

.tl-event:nth-child(odd) {
	flex-direction: row;
	padding-right: calc(50% + 2rem);
}
.tl-event:nth-child(even) {
	flex-direction: row-reverse;
	padding-left: calc(50% + 2rem);
}
.tl-event:nth-child(odd) .tl-marker { order: 2; }
.tl-event:nth-child(even) .tl-marker { order: 1; }
.tl-event:nth-child(odd) .tl-card { order: 1; text-align: right; }
.tl-event:nth-child(even) .tl-card { order: 2; text-align: left; }

.tl-marker {
	font-family: var(--pixel);
	font-size: 0.7rem;
	width: 2.5rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #0A1628;
	border: 2px solid #4A9FE8;
	color: #4A9FE8;
	flex-shrink: 0;
	position: relative;
	z-index: 2;
}

.tl-card {
	flex: 1;
	background: rgba(74,159,232,0.06);
	border: 1.5px solid rgba(74,159,232,0.25);
	padding: 1rem 1.25rem;
}

.tl-date {
	font-family: var(--pixel);
	font-size: 0.38rem;
	color: #4A9FE8;
	letter-spacing: 0.15em;
	margin-bottom: 0.35rem;
}

.tl-title {
	font-family: var(--pixel);
	font-size: 0.55rem;
	color: #fff;
	letter-spacing: 0.06em;
	margin-bottom: 0.3rem;
}

.tl-desc {
	font-family: var(--terminal);
	font-size: 1rem;
	color: rgba(200,230,255,0.5);
	letter-spacing: 0.03em;
	margin: 0;
}

/* ═══════════ PRIZE POOL ═══════════ */
.prize-section {
	background: var(--sand);
	padding: 5rem 3rem 6rem;
	position: relative;
	overflow: hidden;
}

.prize-section::before {
	content: '';
	position: absolute;
	inset: 0;
	background:
		radial-gradient(ellipse at 50% 30%, rgba(210,180,120,0.25) 0%, transparent 60%),
		radial-gradient(ellipse at 20% 80%, rgba(230,200,130,0.15) 0%, transparent 50%);
	pointer-events: none;
}

.prize-head {
	text-align: center;
	margin-bottom: 3rem;
}

.prize-big {
	margin-top: 1.5rem;
}

.prize-amount {
	display: block;
	font-family: var(--pixel);
	font-size: clamp(2.5rem, 6vw, 4rem);
	color: var(--navy);
	letter-spacing: 0.04em;
	text-shadow: 4px 4px 0 rgba(10,22,40,0.1);
}

.prize-label {
	display: block;
	font-family: var(--pixel);
	font-size: 0.45rem;
	color: rgba(10,22,40,0.4);
	letter-spacing: 0.2em;
	margin-top: 0.5rem;
}

/* ═══════════ EVENT LOG ═══════════ */
.log-section { background:#EDD9AA; padding:3rem; border-top:3px solid var(--navy); }

.log-panel { max-width:780px; margin:0 auto; border:3px solid var(--navy); background:var(--cream); box-shadow:6px 6px 0 var(--navy); }

.log-head { display:flex; justify-content:space-between; align-items:center; padding:0.65rem 1.25rem; background:var(--navy); }
.log-title  { font-family:var(--pixel); font-size:0.55rem; color:rgba(200,230,255,0.9); letter-spacing:0.1em; }
.log-status { font-family:var(--terminal); font-size:1rem; color:rgba(200,230,255,0.55); letter-spacing:0.06em; }

.log-body  { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:0.7rem; }
.log-row   { display:flex; align-items:center; gap:0.6rem; }
.licon     { font-size:1rem; width:1.5rem; text-align:center; flex-shrink:0; }
.llabel    { font-family:var(--terminal); font-size:1.1rem; color:var(--navy); min-width:142px; letter-spacing:0.03em; }
.ldots     { font-family:var(--terminal); font-size:1rem; color:rgba(10,22,40,0.25); flex:1; overflow:hidden; letter-spacing:0.15em; }
.lbar      { width:110px; height:14px; background:#D4C4A0; border:2px solid var(--navy); overflow:hidden; flex-shrink:0; }
.lfill     { height:100%; background:#D4A200; }
.lfill.done { background:#2E7D32; }
.lpct      { font-family:var(--terminal); font-size:1.1rem; color:var(--navy); min-width:2.8rem; text-align:right; }
.lalmost   { font-family:var(--terminal); font-size:1.05rem; color:#B02020; margin-top:0.25rem; letter-spacing:0.05em; }

/* footer */
.footer    { background:var(--navy); border-top:2px solid #1A5FAD; padding:0.7rem 1.5rem; display:flex; align-items:center; gap:1rem; }
.fprompt   { font-family:var(--terminal); font-size:1.2rem; color:rgba(200,230,255,0.8); letter-spacing:0.05em; flex:1; }
.cur       { color:rgba(200,230,255,0.9); }
.cur.off   { opacity:0; }
.fdots     { display:flex; gap:5px; }
.fdots span { width:9px; height:9px; border-radius:50%; }
.fdots span:nth-child(1) { background:#E03030; }
.fdots span:nth-child(2) { background:#E0A030; }
.fdots span:nth-child(3) { background:#30A030; }

/* ── responsive: tablet (≤900px) ── */
@media (max-width: 900px) {
	.hud { padding: 0.7rem 1rem; }
	.hud-stats { padding: 0.4rem 0.65rem; }
	.stat-row { font-size: 0.5rem; }
	.sbar { width: 60px; }
	.system-box { padding: 0.4rem 0.75rem; }
	.sys-hdr { font-size: 0.46rem; }
	.sys-ln { font-size: 0.9rem; }

	.hero { min-height: 560px; }
	.hero-text { padding: 1.5rem 1.5rem; gap: 1.25rem; max-width: 100%; }
	.hackwave-title { font-size: clamp(3rem, 8vw, 5.5rem); }
	.beat { font-size: 0.65rem; }
	.ic { padding: 0.6rem 0.85rem; }

	.hero-icons { gap: 1rem; }
	.register-cta { padding: 0.85rem 1.6rem; font-size: 0.58rem; }

	.tracks-section { padding: 3.5rem 2rem 5rem; }
	.tracks-grid { grid-template-columns: 1fr 1fr; gap: 1.75rem; max-width: 700px; margin: 0 auto; }

	.countdown-section { padding: 3rem 1.5rem; }
	.cd-num { font-size: clamp(2.2rem, 5vw, 4rem); min-width: 4.5rem; padding: 0.55rem 0.85rem; }
	.cd-grid { gap: 0.75rem; }

	.log-section { padding: 2.5rem 1.25rem; }
	.log-panel { max-width: 100%; }
	.log-body { padding: 1rem 1.25rem; }
	.ldots { display: none; }
	.lbar { width: 90px; }

	.footer { padding: 0.65rem 1.25rem; }
	.fprompt { font-size: 1.05rem; }
}

/* ── responsive: mobile (≤640px) ── */
@media (max-width: 640px) {
	.particle-canvas { opacity: 0.75; }

	/* HUD – compact but both panels visible */
	.hud { padding: 0.55rem 0.85rem; }
	.hud-stats { padding: 0.35rem 0.55rem; }
	.stat-row { font-size: 0.46rem; gap: 0.25rem; }
	.sl { min-width: 0.9rem; }
	.sn { display: none; }
	.sbar { width: 44px; height: 6px; }
	.system-box { padding: 0.35rem 0.65rem; }
	.sys-hdr { font-size: 0.42rem; }
	.sys-ln { font-size: 0.82rem; line-height: 1.3; }

	/* Hero */
	.hero { height: auto; min-height: 100svh; }
	.hero-text { padding: 1rem 1rem 1.5rem; gap: 1rem; }
	.gdg-row { gap: 0.5rem; }
	.gdg-img { width: 34px; height: 34px; }
	.gdg-label { font-size: 0.37rem; }
	.event-pill { font-size: 0.42rem; padding: 0.32rem 0.6rem; }
	.hackwave-title { font-size: clamp(2.8rem, 11vw, 4.2rem); }
	.beat { font-size: 0.55rem; letter-spacing: 0.16em; }

	/* Info strip – keep horizontal 3-col with visible dividers */
	.info-strip { display: flex; border: 1.5px solid rgba(74,159,232,0.35); }
	.ic { flex: 1; padding: 0.55rem 0.3rem; align-items: center; gap: 0.2rem; }
	.ik { font-size: 0.33rem; letter-spacing: 0.08em; }
	.iv { font-size: 0.42rem; line-height: 1.45; letter-spacing: 0.03em; }
	.idiv { display: block; }

	.hero-icons { gap: 0.9rem; }
	.his { font-size: 0.62rem; }
	.hil { font-size: 0.3rem; }

	/* CTA full width */
	.register-cta { width: 100%; text-align: center; padding: 0.85rem 1rem; font-size: 0.52rem; box-sizing: border-box; }

	/* Countdown – hide seconds */
	.countdown-section { padding: 2.5rem 1rem; gap: 1.5rem; }
	.cd-label { font-size: 1.05rem; letter-spacing: 0.15em; }
	.cd-num { font-size: clamp(1.9rem, 7vw, 3rem); min-width: 3.5rem; padding: 0.45rem 0.55rem; }
	.cd-colon { font-size: clamp(1.5rem, 6vw, 2.2rem); margin-bottom: 1rem; }
	.cd-sub { font-size: 0.38rem; }
	.cd-secs-colon, .cd-secs-unit { display: none; }
	.cd-grid { gap: 0.5rem; }
	.cd-date { font-size: 0.44rem; letter-spacing: 0.1em; }

	/* Tracks – 2-col */
	.tracks-section { padding: 2.5rem 1rem 3.5rem; }
	.section-hdr { margin-bottom: 2rem; }
	.section-sub { font-size: 1.05rem; }
	.section-title { font-size: clamp(1.3rem, 5vw, 2rem); }
	.tracks-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
	.track-card { padding: 1.4rem 0.9rem 1.2rem; gap: 0.75rem; }
	.tbadge { font-size: 0.5rem; padding: 0.35rem 0.7rem; }
	.tname { font-size: clamp(0.8rem, 3vw, 1rem); }
	.tcat { font-size: 0.38rem; }
	.ticon-wrap { width: 68px; height: 68px; }
	.tdesc { padding: 0.7rem 0.75rem 0.9rem; font-size: 0.95rem; }
	.palm { font-size: 4rem; }

	/* Event log */
	.log-section { padding: 2rem 0.85rem; }
	.log-head { flex-direction: column; gap: 0.25rem; align-items: flex-start; padding: 0.5rem 0.85rem; }
	.log-status { font-size: 0.88rem; }
	.log-body { padding: 0.85rem; gap: 0.55rem; }
	.log-row { flex-wrap: nowrap; gap: 0.45rem; }
	.licon { width: 1.2rem; font-size: 0.9rem; }
	.llabel { font-size: 0.92rem; min-width: auto; flex: 1; }
	.lbar { width: 65px; height: 11px; }
	.lpct { font-size: 0.9rem; min-width: 2.6rem; }
	.lalmost { font-size: 0.9rem; }

	/* Timeline */
	.timeline-section { padding: 2.5rem 1rem 3.5rem; }
	.tl-event { gap: 1rem; margin-bottom: 2rem; }

	/* Prize Pool */
	.prize-section { padding: 2.5rem 1rem 3.5rem; }

	.footer { padding: 0.55rem 0.85rem; }
	.fprompt { font-size: 0.95rem; }
}

/* ── responsive: small phone (≤420px) ── */
@media (max-width: 420px) {
	/* HUD – collapse to stacked rows, drop system panel */
	.system-box { display: none; }
	.hud { flex-direction: column; gap: 0.3rem; padding: 0.5rem 0.75rem; }
	.hud-stats { flex-direction: row; gap: 0.4rem; justify-content: flex-start; }
	.stat-row { font-size: 0.44rem; }
	.sbar { width: 38px; height: 5px; }

	.hackwave-title { font-size: clamp(2.3rem, 14vw, 3rem); }
	.hero-text { gap: 0.8rem; padding: 0.75rem 0.75rem 1.25rem; }
	.event-pill { font-size: 0.4rem; }
	.beat { font-size: 0.5rem; }

	/* Info strip – stacked rows with label ↔ value layout */
	.info-strip { flex-direction: column; border: 1.5px solid rgba(74,159,232,0.35); }
	.ic { flex-direction: column; align-items: center; text-align: center; padding: 0.45rem 0.5rem; border-bottom: 1px solid rgba(74,159,232,0.2); gap: 0.2rem; }
	.ic:last-child { border-bottom: none; }
	.ik { font-size: 0.38rem; letter-spacing: 0.1em; }
	.iv { font-size: 0.5rem; text-align: center; line-height: 1.4; }
	.idiv { display: none; }

	.hero-icons { gap: 0.75rem; }
	.his { font-size: 0.58rem; }
	.hil { font-size: 0.28rem; }

	/* Countdown – tighter */
	.countdown-section { padding: 1.75rem 0.7rem; gap: 1.1rem; }
	.cd-label { font-size: 0.9rem; }
	.cd-num { font-size: clamp(1.5rem, 10vw, 2.2rem); min-width: 2.7rem; padding: 0.38rem 0.42rem; }
	.cd-colon { font-size: clamp(1.2rem, 8vw, 1.7rem); margin-bottom: 0.8rem; }
	.cd-sub { font-size: 0.33rem; }
	.cd-date { font-size: 0.4rem; text-align: center; }

	/* Tracks – single column */
	.tracks-section { padding: 2rem 0.7rem 3rem; }
	.section-title { font-size: 1.25rem; }
	.tracks-grid { grid-template-columns: 1fr; max-width: 360px; }
	.track-card { padding: 1.25rem 1.1rem 1rem; gap: 0.7rem; }
	.tname { font-size: 0.85rem; }
	.ticon-wrap { width: 60px; height: 60px; }
	.tdesc { padding: 0.6rem 0.7rem 0.8rem; font-size: 0.88rem; }
	.palm { font-size: 3rem; }

	/* Timeline – single column */
	.timeline-section { padding: 2rem 0.7rem 3rem; }
	.tl-line { left: 1.25rem; }
	.tl-event:nth-child(odd),
	.tl-event:nth-child(even) {
		flex-direction: row;
		padding-left: 0;
		padding-right: 0;
	}
	.tl-event:nth-child(odd) .tl-card,
	.tl-event:nth-child(even) .tl-card { order: 2; text-align: left; }
	.tl-event:nth-child(odd) .tl-marker,
	.tl-event:nth-child(even) .tl-marker { order: 1; }

	/* Prizes – single column */
	.prize-section { padding: 2rem 0.7rem 3rem; }

	/* Log */
	.log-section { padding: 1.5rem 0.6rem; }
	.log-body { padding: 0.65rem 0.6rem; gap: 0.45rem; }
	.licon { width: 1rem; font-size: 0.8rem; }
	.llabel { font-size: 0.82rem; }
	.lbar { width: 50px; height: 10px; }
	.lpct { font-size: 0.82rem; min-width: 2.2rem; }
	.lalmost { font-size: 0.82rem; }

	.footer { flex-direction: column; gap: 0.4rem; padding: 0.6rem 0.75rem; text-align: center; }
	.fprompt { font-size: 0.88rem; }
}
</style>
