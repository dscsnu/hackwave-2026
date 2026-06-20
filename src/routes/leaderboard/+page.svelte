<script lang="ts">
	type LeaderboardEntry = {
		position: number;
		team_name: string;
		points: number;
	};

	const floatingPixels = Array.from({ length: 22 }, (_, index) => ({
		id: index,
		left: ((index * 4.7) % 95) + 2,
		delay: (index * 0.41) % 8,
		duration: 8 + ((index * 0.6) % 7),
		size: [8, 8, 12, 8, 8, 16][index % 6],
		color: ['#EA4335', '#4285F4', '#34A853', '#FBBC05', '#4A9FE8', '#FF8C42'][index % 6],
	}));

	let { data } = $props<{
		data: {
			configured: boolean;
			rows: LeaderboardEntry[];
			errorMessage?: string;
			tableName: string;
		};
	}>();

	const topThree = $derived(data.rows.filter((entry) => entry.position <= 3));

	function medalHue(position: number) {
		if (position === 1) return 'gold';
		if (position === 2) return 'silver';
		if (position === 3) return 'bronze';
		return 'standard';
	}

	let particleCanvas: HTMLCanvasElement;
	let isPointerDown = $state(false);
	let isMobile = $state(false);
	let particles: Array<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
		color: string;
	}> = $state([]);
	let animFrameId: number | null = null;
	let lastSpawn = 0;

	const PARTICLE_COLORS = ['#EA4335', '#4285F4', '#34A853', '#FBBC05', '#4A9FE8', '#FF8C42', '#fff'];

	function spawnParticles(x: number, y: number, count: number) {
		const now = performance.now();
		if (now - lastSpawn < 30) return;
		lastSpawn = now;

		for (let index = 0; index < count; index += 1) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 0.5 + Math.random() * 2.5;

			particles.push({
				x,
				y,
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

		const context = particleCanvas.getContext('2d');
		if (!context) return;

		const width = particleCanvas.width;
		const height = particleCanvas.height;

		context.clearRect(0, 0, width, height);

		for (let index = particles.length - 1; index >= 0; index -= 1) {
			const particle = particles[index];
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.vy += 0.03;
			particle.life -= (1 / 60) / particle.maxLife;

			if (particle.life <= 0) {
				particles.splice(index, 1);
				continue;
			}

			const alpha = particle.life * particle.life;
			const size = particle.size * particle.life;
			context.globalAlpha = alpha;
			context.fillStyle = particle.color;
			context.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);

			if (size > 2) {
				context.globalAlpha = alpha * 0.3;
				context.fillRect(particle.x - size, particle.y - size, size * 2, size * 2);
			}
		}

		context.globalAlpha = 1;
		animFrameId = requestAnimationFrame(animateParticles);
	}

	function handlePointerMove(event: PointerEvent) {
		const count = isPointerDown ? 8 : isMobile ? 0 : 2;
		spawnParticles(event.clientX, event.clientY, count);
	}

	function handlePointerDown() {
		isPointerDown = true;
	}

	function handlePointerUp() {
		isPointerDown = false;
	}

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

<svelte:head>
	<title>Leaderboard — HACKWAVE 2026</title>
	<meta
		name="description"
		content="Live HACKWAVE leaderboard with team positions, names and points."
	/>
</svelte:head>

<div class="leaderboard-page">
	<canvas bind:this={particleCanvas} class="particle-canvas" aria-hidden="true"></canvas>
	<div class="scanlines" aria-hidden="true"></div>
	<div class="pixel-particles" aria-hidden="true">
		{#each floatingPixels as pixel}
			<div
				class="pixel-dot"
				style="left:{pixel.left}%;width:{pixel.size}px;height:{pixel.size}px;background:{pixel.color};animation-delay:{pixel.delay}s;animation-duration:{pixel.duration}s"
			></div>
		{/each}
	</div>
	<div class="background-grid" aria-hidden="true"></div>
	<div class="background-orb orb-one" aria-hidden="true"></div>
	<div class="background-orb orb-two" aria-hidden="true"></div>

	<section class="hero-panel">
		<div class="hero-copy">
			<div class="eyebrow">// LIVE STANDINGS</div>
			<h1>LEADERBOARD</h1>
			<p>
				Live ranking of teams based on the latest score updates.
			</p>
		</div>
	</section>

	<section class="podium-wrap">
		{#each topThree as entry}
			<article class="podium-card rank-{entry.position} hue-{medalHue(entry.position)}">
				<span class="rank-pill">#{entry.position}</span>
				<div class="podium-team">{entry.team_name}</div>
				<div class="podium-points">{entry.points} pts</div>
			</article>
		{/each}
	</section>

	<section class="table-shell">
		<div class="table-head">
			<div>
				<div class="eyebrow">// RANKING BOARD</div>
				<h2>Current standings</h2>
			</div>
			<a href="/" class="back-link">← Back to home</a>
		</div>

		{#if !data.configured}
			<div class="empty-state">
				<p>{data.errorMessage}</p>
				<p>Set the Supabase public URL, anon key and optional table name to enable this page.</p>
			</div>
		{:else if data.errorMessage}
			<div class="empty-state">
				<p>Could not load leaderboard data.</p>
				<p>{data.errorMessage}</p>
			</div>
		{:else if data.rows.length === 0}
			<div class="empty-state">
				<p>No teams have been added yet.</p>
				<p>Once rows exist in {data.tableName}, the leaderboard will render automatically.</p>
			</div>
		{:else}
			<div class="rows">
				<div class="row row-head">
					<span>Position</span>
					<span>Team</span>
					<span>Points</span>
				</div>
				{#each data.rows as entry}
					<div class="row row-{entry.position}">
						<span class="row-cell position-cell">
							<span class="cell-label">Position</span>
							<span class="position-chip">#{entry.position}</span>
						</span>
						<span class="row-cell team-cell">
							<span class="cell-label">Team</span>
							<span class="team-name">{entry.team_name}</span>
						</span>
						<span class="row-cell points-cell">
							<span class="cell-label">Points</span>
							<span class="points">{entry.points}</span>
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.leaderboard-page {
		min-height: 100vh;
		padding: 2rem;
		background: var(--navy);
		color: var(--sand);
		position: relative;
		overflow: hidden;
	}

	.particle-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 9999;
		opacity: 0.75;
	}

	.scanlines {
		position: fixed;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent 0px,
			transparent 3px,
			rgba(0, 0, 0, 0.055) 3px,
			rgba(0, 0, 0, 0.055) 4px
		);
		pointer-events: none;
		z-index: 20;
		animation: flicker 10s ease-in-out infinite;
	}

	@keyframes flicker {
		0%, 94%, 100% {
			opacity: 1;
		}

		95% {
			opacity: 0.93;
		}

		96.5% {
			opacity: 0.98;
		}

		98% {
			opacity: 0.9;
		}
	}

	.pixel-particles {
		position: fixed;
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
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 0;
		}

		8% {
			opacity: 0.55;
		}

		90% {
			opacity: 0.35;
		}

		100% {
			transform: translateY(-105vh) rotate(180deg);
			opacity: 0;
		}
	}

	.background-grid {
		position: fixed;
		inset: 0;
		background-image:
			linear-gradient(rgba(74, 159, 232, 0.08) 1px, transparent 1px),
			linear-gradient(90deg, rgba(74, 159, 232, 0.08) 1px, transparent 1px),
			radial-gradient(circle at 20% 20%, rgba(74, 159, 232, 0.06) 0 2px, transparent 2px),
			radial-gradient(circle at 80% 70%, rgba(74, 159, 232, 0.06) 0 2px, transparent 2px);
		background-size: 32px 32px, 32px 32px, 64px 64px, 64px 64px;
		background-position: 0 0, 0 0, 0 0, 16px 16px;
		background-color: #0a1628;
		pointer-events: none;
		z-index: 0;
	}

	.background-orb {
		position: absolute;
		border-radius: 999px;
		filter: blur(20px);
		opacity: 0.45;
		pointer-events: none;
		z-index: 1;
	}

	.orb-one {
		top: 4rem;
		right: -2rem;
		width: 12rem;
		height: 12rem;
		background: rgba(74, 159, 232, 0.45);
	}

	.orb-two {
		left: -3rem;
		bottom: 10rem;
		width: 14rem;
		height: 14rem;
		background: rgba(184, 134, 11, 0.25);
	}

	.hero-panel,
	.table-shell {
		position: relative;
		z-index: 3;
		max-width: 1120px;
		margin: 0 auto;
	}

	.hero-panel {
		display: block;
		align-items: end;
		margin-bottom: 1rem;
	}

	.hero-copy {
		background: transparent;
		border: 0;
		box-shadow: none;
		padding: 0;
	}

	.eyebrow {
		font-family: var(--pixel);
		font-size: 0.7rem;
		line-height: 1.4;
		letter-spacing: 0.08em;
		color: #4a9fe8;
		margin-bottom: 0.85rem;
	}

	h1,
	h2 {
		font-family: var(--pixel);
		letter-spacing: 0.08em;
	}

	h1 {
		font-size: clamp(2.4rem, 6vw, 5rem);
		line-height: 0.92;
		margin-bottom: 1rem;
	}

	.hero-copy p {
		max-width: 44rem;
		font-size: 1.02rem;
		line-height: 1.6;
		color: rgba(230, 240, 255, 0.9);
	}

	.podium-wrap {
		display: flex;
		gap: 1rem;
		max-width: 1120px;
		margin: 0 auto 1rem;
		position: relative;
		z-index: 1;
	}

	.podium-card {
		background: rgba(10, 22, 40, 0.25);
		border: 2px solid rgba(107, 189, 232, 0.45);
		box-shadow: none;
		backdrop-filter: blur(2px);
		padding: 1.1rem;
		min-height: 10rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		min-width: 0;
	}

	.rank-1 {
		order: 2;
		transform: translateY(-10px) scale(1.04);
		background: rgba(10, 22, 40, 0.4);
		z-index: 2;
	}

	.rank-2 {
		order: 1;
	}

	.rank-3 {
		order: 3;
	}

	.hue-gold {
		border-color: #d4af37;
		box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.25);
	}

	.hue-silver {
		border-color: #c0c0c0;
		box-shadow: 0 0 0 1px rgba(192, 192, 192, 0.2);
	}

	.hue-bronze {
		border-color: #cd7f32;
		box-shadow: 0 0 0 1px rgba(205, 127, 50, 0.2);
	}

	.rank-pill,
	.position-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: max-content;
		padding: 0.35rem 0.7rem;
		background: var(--navy);
		color: var(--sand);
		font-family: var(--pixel);
		font-size: 0.95rem;
		line-height: 1;
	}

	.rank-1 .rank-pill {
		font-size: 1.3rem;
		padding: 0.5rem 0.9rem;
	}

	.rank-2 .rank-pill,
	.rank-3 .rank-pill {
		font-size: 1rem;
	}

	.podium-team {
		font-size: clamp(1.25rem, 2vw, 1.7rem);
		font-weight: 900;
		line-height: 1.15;
		margin: 1rem 0 0.5rem;
		color: var(--cream);
	}

	.podium-points,
	.points {
		font-family: var(--pixel);
		font-size: 0.8rem;
		color: var(--navy-light);
	}

	.table-shell {
		background: transparent;
		border: 0;
		box-shadow: none;
		padding: 1.2rem;
	}

	.table-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.table-head h2 {
		font-size: clamp(1.6rem, 3vw, 2.4rem);
		line-height: 1;
		color: var(--cream);
	}

	.back-link {
		font-family: var(--pixel);
		font-size: 0.65rem;
		text-decoration: none;
		color: var(--cream);
		border: 2px solid rgba(107, 189, 232, 0.8);
		padding: 0.65rem 0.8rem;
		background: rgba(10, 22, 40, 0.35);
		white-space: nowrap;
	}

	.rows {
		display: grid;
		gap: 0.7rem;
	}

	.row {
		display: grid;
		grid-template-columns: 96px minmax(0, 1fr) 110px;
		gap: 1rem;
		align-items: center;
		padding: 0.95rem 1rem;
		border: 1px solid rgba(107, 189, 232, 0.28);
		background: rgba(10, 22, 40, 0.22);
	}

	.row-cell {
		display: contents;
	}

	.cell-label {
		display: none;
		font-family: var(--pixel);
		font-size: 0.48rem;
		letter-spacing: 0.12em;
		color: rgba(184, 220, 255, 0.78);
		text-transform: uppercase;
	}

	.row-1 {
		border-color: rgba(212, 175, 55, 0.88);
	}

	.row-2 {
		border-color: rgba(192, 192, 192, 0.88);
	}

	.row-3 {
		border-color: rgba(205, 127, 50, 0.88);
	}

	.row-1 .position-chip {
		background: #d4af37;
		color: #0a1628;
	}

	.row-2 .position-chip {
		background: #c0c0c0;
		color: #0a1628;
	}

	.row-3 .position-chip {
		background: #cd7f32;
		color: #0a1628;
	}

	.row-1 .team-name,
	.row-1 .points,
	.row-2 .team-name,
	.row-2 .points,
	.row-3 .team-name,
	.row-3 .points {
		color: var(--cream);
	}

	.row-head {
		font-family: var(--pixel);
		font-size: 0.58rem;
		background: rgba(10, 22, 40, 0.94);
		color: var(--sand);
		text-transform: uppercase;
	}

	.position-chip,
	.points {
		color: var(--cream);
	}

	.team-name {
		font-weight: 900;
		font-size: 1.05rem;
		color: var(--cream);
	}

	.podium-points,
	.points {
		font-family: var(--pixel);
		font-size: 0.8rem;
		color: #4a9fe8;
	}

	.empty-state {
		padding: 2rem 1.2rem;
		border: 1px dashed rgba(107, 189, 232, 0.4);
		background: rgba(10, 22, 40, 0.26);
		font-size: 1rem;
		line-height: 1.6;
		color: var(--cream);
	}

	.empty-state p + p {
		margin-top: 0.5rem;
	}

	@media (max-width: 860px) {
		.leaderboard-page {
			padding: 0.85rem;
		}

		.podium-wrap {
			flex-direction: column;
		}

		.rank-1 {
			transform: none;
		}

		.table-head {
			flex-direction: column;
			align-items: flex-start;
		}

		.table-head h2 {
			font-size: clamp(1.45rem, 5vw, 2rem);
		}

		.back-link {
			width: 100%;
			text-align: center;
		}

		.row {
			grid-template-columns: 56px minmax(0, 1fr) 72px;
			gap: 0.55rem;
			padding: 0.8rem 0.85rem;
		}

		.cell-label {
			display: none;
		}

		.position-cell,
		.team-cell,
		.points-cell {
			display: contents;
		}

		.position-cell .position-chip,
		.points-cell .points {
			font-size: 0.95rem;
		}

		.team-cell .team-name {
			font-size: 0.95rem;
			line-height: 1.25;
		}

		.rank-1,
		.rank-2,
		.rank-3 {
			order: 0;
		}
	}

	@media (max-width: 560px) {
		.hero-copy,
		.table-shell,
		.podium-card {
			padding: 1rem;
		}

		.hero-copy {
			text-align: center;
		}

		h1 {
			font-size: clamp(2rem, 12vw, 3.1rem);
			line-height: 0.95;
			margin-bottom: 0.8rem;
			overflow-wrap: anywhere;
			word-break: normal;
		}

		.hero-copy p {
			font-size: 0.92rem;
			max-width: 100%;
		}

		.podium-card {
			min-height: 0;
		}

		.podium-team {
			font-size: clamp(1.1rem, 5.2vw, 1.45rem);
		}

		.row {
			grid-template-columns: 48px minmax(0, 1fr) 60px;
			gap: 0.45rem;
			padding: 0.75rem 0.8rem;
		}

		.position-chip,
		.points {
			font-size: 0.85rem;
		}

		.team-name {
			font-size: 0.88rem;
		}

		.row-head {
			display: none;
		}

		.table-shell {
			padding: 0.95rem;
		}

		.rows {
			gap: 0.6rem;
		}
	}
</style>