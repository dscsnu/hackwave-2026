<script lang="ts">
	let step = $state(1);
	let isGoogleLoading = $state(false);
	let submitted = $state(false);

	const tracks = [
		{ id: 'track-1', label: 'Track 1', icon: '🏄', description: 'Coming soon' },
		{ id: 'track-2', label: 'Track 2', icon: '🌊', description: 'Coming soon' },
		{ id: 'track-3', label: 'Track 3', icon: '🐚', description: 'Coming soon' },
		{ id: 'track-4', label: 'Track 4', icon: '🦀', description: 'Coming soon' },
		{ id: 'track-5', label: 'Track 5', icon: '🌴', description: 'Coming soon' },
		{ id: 'track-6', label: 'Track 6', icon: '⛵', description: 'Coming soon' },
	];

	let form = $state({
		name: '',
		email: '',
		phone: '',
		college: '',
		year: '',
		teamName: '',
		teamSize: '',
		track: '',
		experience: '',
		github: '',
		linkedin: '',
		whyJoin: '',
		dietaryReqs: '',
		tshirtSize: '',
		agreeTerms: false,
	});

	let errors = $state<Record<string, string>>({});

	function validateStep1() {
		const e: Record<string, string> = {};
		if (!form.name.trim()) e.name = 'Name is required';
		if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
		if (!form.college.trim()) e.college = 'College is required';
		if (!form.year) e.year = 'Year of study required';
		errors = e;
		return Object.keys(e).length === 0;
	}

	function validateStep2() {
		const e: Record<string, string> = {};
		if (!form.track) e.track = 'Please select a track';
		if (!form.experience) e.experience = 'Please select your experience level';
		if (!form.whyJoin.trim()) e.whyJoin = 'Tell us why you want to join';
		errors = e;
		return Object.keys(e).length === 0;
	}

	function validateStep3() {
		const e: Record<string, string> = {};
		if (!form.tshirtSize) e.tshirtSize = 'T-shirt size is required';
		if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
		errors = e;
		return Object.keys(e).length === 0;
	}

	function nextStep() {
		if (step === 1 && validateStep1()) step = 2;
		else if (step === 2 && validateStep2()) step = 3;
	}

	function prevStep() {
		if (step > 1) step--;
	}

	async function handleSubmit() {
		if (!validateStep3()) return;
		submitted = true;
	}

	async function handleGoogleSignIn() {
		isGoogleLoading = true;
		await new Promise(r => setTimeout(r, 1200));
		isGoogleLoading = false;
	}

	const bubbles = Array.from({ length: 12 }, (_, i) => ({
		id: i,
		size: Math.random() * 60 + 20,
		left: Math.random() * 100,
		delay: Math.random() * 8,
		duration: Math.random() * 6 + 8,
	}));
</script>

<div class="page">
	<!-- Animated background -->
	<div class="bg-scene">
		<div class="sky"></div>
		<div class="sun">
			<div class="sun-rays">
				{#each Array(8) as _, i}
					<div class="ray" style="--i:{i}"></div>
				{/each}
			</div>
		</div>
		{#each bubbles as b}
			<div
				class="bubble"
				style="--size:{b.size}px; --left:{b.left}%; --delay:{b.delay}s; --dur:{b.duration}s"
			></div>
		{/each}
		<div class="ocean-wrap">
			<svg class="wave wave1" viewBox="0 0 1440 120" preserveAspectRatio="none">
				<path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" />
			</svg>
			<svg class="wave wave2" viewBox="0 0 1440 120" preserveAspectRatio="none">
				<path d="M0,80 C200,20 400,100 600,60 C800,20 1000,100 1200,60 C1300,40 1380,70 1440,80 L1440,120 L0,120 Z" />
			</svg>
			<div class="ocean-body"></div>
		</div>
		<div class="sand-bar"></div>
	</div>

	<!-- Content -->
	<div class="content">
		<!-- Hero header -->
		<header class="hero">
			<div class="gdg-badge">GDG × Summer 2026</div>
			<h1 class="hero-title">Summer<br />Hack<span class="title-wave">~</span></h1>
			<p class="hero-sub">Ride the wave of innovation this summer.</p>
		</header>

		<!-- Card -->
		{#if submitted}
			<div class="card success-card">
				<div class="success-icon">🌊</div>
				<h2 class="success-title">You're in the wave!</h2>
				<p class="success-sub">Registration received. We'll hit your inbox soon with the deets.</p>
				<div class="success-tag">{form.name || 'Hacker'} · {tracks.find(t => t.id === form.track)?.label ?? 'Explorer'}</div>
			</div>
		{:else}
			<div class="card">
				<!-- Progress bar -->
				<div class="progress-wrap">
					{#each [1, 2, 3] as s}
						<div class="progress-item">
							<div class="progress-dot" class:active={step >= s} class:current={step === s}>
								{#if step > s}✓{:else}{s}{/if}
							</div>
							<span class="progress-label">{s === 1 ? 'You' : s === 2 ? 'Track' : 'Finish'}</span>
						</div>
						{#if s < 3}
							<div class="progress-line" class:filled={step > s}></div>
						{/if}
					{/each}
				</div>

				<!-- Google Sign-In -->
				{#if step === 1}
					<button class="google-btn" onclick={handleGoogleSignIn} disabled={isGoogleLoading}>
						{#if isGoogleLoading}
							<span class="spinner"></span>
							<span>Signing in...</span>
						{:else}
							<svg class="google-icon" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							<span>Continue with Google</span>
						{/if}
					</button>

					<div class="divider"><span>or register manually</span></div>
				{/if}

				<!-- STEP 1: Personal Info -->
				{#if step === 1}
					<div class="step-header">
						<h2 class="step-title">Who are you, wave rider?</h2>
						<p class="step-sub">Tell us a bit about yourself</p>
					</div>
					<div class="form-grid">
						<div class="field full">
							<label for="name">Full Name</label>
							<input id="name" type="text" placeholder="Your full name" bind:value={form.name} class:error={errors.name} />
							{#if errors.name}<span class="err">{errors.name}</span>{/if}
						</div>
						<div class="field">
							<label for="email">Email</label>
							<input id="email" type="email" placeholder="you@example.com" bind:value={form.email} class:error={errors.email} />
							{#if errors.email}<span class="err">{errors.email}</span>{/if}
						</div>
						<div class="field">
							<label for="phone">Phone (optional)</label>
							<input id="phone" type="tel" placeholder="+91 98765 43210" bind:value={form.phone} />
						</div>
						<div class="field">
							<label for="college">College / University</label>
							<input id="college" type="text" placeholder="Your institution" bind:value={form.college} class:error={errors.college} />
							{#if errors.college}<span class="err">{errors.college}</span>{/if}
						</div>
						<div class="field">
							<label for="year">Year of Study</label>
							<select id="year" bind:value={form.year} class:error={errors.year}>
								<option value="">Select year</option>
								<option value="1">1st Year</option>
								<option value="2">2nd Year</option>
								<option value="3">3rd Year</option>
								<option value="4">4th Year</option>
								<option value="pg">Postgraduate</option>
								<option value="other">Other</option>
							</select>
							{#if errors.year}<span class="err">{errors.year}</span>{/if}
						</div>
					</div>

				<!-- STEP 2: Track & Project -->
				{:else if step === 2}
					<div class="step-header">
						<h2 class="step-title">Pick your wave.</h2>
						<p class="step-sub">Choose a track and tell us about your skills</p>
					</div>

					<div class="tracks-label">Hackathon Track</div>
					<div class="tracks-grid">
						{#each tracks as track}
							<button
								class="track-card"
								class:selected={form.track === track.id}
								onclick={() => { form.track = track.id; errors.track = ''; }}
								type="button"
							>
								<span class="track-icon">{track.icon}</span>
								<span class="track-name">{track.label}</span>
								<span class="track-desc">{track.description}</span>
							</button>
						{/each}
					</div>
					{#if errors.track}<span class="err">{errors.track}</span>{/if}

					<div class="form-grid" style="margin-top: 1.5rem">
						<div class="field">
							<label for="experience">Experience Level</label>
							<select id="experience" bind:value={form.experience} class:error={errors.experience}>
								<option value="">Select level</option>
								<option value="beginner">Beginner — first hackathon!</option>
								<option value="intermediate">Intermediate — been to a few</option>
								<option value="advanced">Advanced — I live for this</option>
							</select>
							{#if errors.experience}<span class="err">{errors.experience}</span>{/if}
						</div>
						<div class="field">
							<label for="teamName">Team Name (optional)</label>
							<input id="teamName" type="text" placeholder="The Surf Squad" bind:value={form.teamName} />
						</div>
						<div class="field full">
							<label for="whyJoin">Why do you want to join? <span class="label-note">(min. 50 chars)</span></label>
							<textarea id="whyJoin" rows="4" placeholder="Tell us what excites you about this hackathon..." bind:value={form.whyJoin} class:error={errors.whyJoin}></textarea>
							{#if errors.whyJoin}<span class="err">{errors.whyJoin}</span>{/if}
						</div>
						<div class="field">
							<label for="github">GitHub (optional)</label>
							<input id="github" type="url" placeholder="github.com/you" bind:value={form.github} />
						</div>
						<div class="field">
							<label for="linkedin">LinkedIn (optional)</label>
							<input id="linkedin" type="url" placeholder="linkedin.com/in/you" bind:value={form.linkedin} />
						</div>
					</div>

				<!-- STEP 3: Final Details -->
				{:else if step === 3}
					<div class="step-header">
						<h2 class="step-title">Almost there! 🌴</h2>
						<p class="step-sub">Last few things before you catch the wave</p>
					</div>
					<div class="form-grid">
						<div class="field">
							<label for="tshirtSize">T-Shirt Size</label>
							<select id="tshirtSize" bind:value={form.tshirtSize} class:error={errors.tshirtSize}>
								<option value="">Pick your size</option>
								<option value="XS">XS</option>
								<option value="S">S</option>
								<option value="M">M</option>
								<option value="L">L</option>
								<option value="XL">XL</option>
								<option value="XXL">XXL</option>
							</select>
							{#if errors.tshirtSize}<span class="err">{errors.tshirtSize}</span>{/if}
						</div>
						<div class="field">
							<label for="dietary">Dietary Requirements (optional)</label>
							<input id="dietary" type="text" placeholder="Veg, Vegan, Gluten-free..." bind:value={form.dietaryReqs} />
						</div>
						<div class="field full review-box">
							<div class="review-title">Review your details</div>
							<div class="review-grid">
								<span class="rv-key">Name</span><span class="rv-val">{form.name || '—'}</span>
								<span class="rv-key">Email</span><span class="rv-val">{form.email || '—'}</span>
								<span class="rv-key">College</span><span class="rv-val">{form.college || '—'}</span>
								<span class="rv-key">Year</span><span class="rv-val">{form.year || '—'}</span>
								<span class="rv-key">Track</span><span class="rv-val">{tracks.find(t => t.id === form.track)?.label ?? '—'}</span>
								<span class="rv-key">Experience</span><span class="rv-val">{form.experience || '—'}</span>
							</div>
						</div>
						<div class="field full">
							<label class="checkbox-label">
								<input type="checkbox" bind:checked={form.agreeTerms} class:error={errors.agreeTerms} />
								<span>I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#code">Code of Conduct</a></span>
							</label>
							{#if errors.agreeTerms}<span class="err">{errors.agreeTerms}</span>{/if}
						</div>
					</div>
				{/if}

				<!-- Navigation buttons -->
				<div class="btn-row">
					{#if step > 1}
						<button class="btn-back" onclick={prevStep} type="button">← Back</button>
					{:else}
						<div></div>
					{/if}

					{#if step < 3}
						<button class="btn-next" onclick={nextStep} type="button">
							Next <span class="btn-wave">~</span>
						</button>
					{:else}
						<button class="btn-submit" onclick={handleSubmit} type="button">
							🌊 Dive In!
						</button>
					{/if}
				</div>
			</div>
		{/if}

		<footer class="footer">
			<p>Made with ☀️ by GDG · Summer Hack 2026</p>
		</footer>
	</div>
</div>

<style>
/* ---- PAGE LAYOUT ---- */
.page {
	min-height: 100vh;
	position: relative;
	overflow-x: hidden;
	display: flex;
	flex-direction: column;
}

/* ---- BACKGROUND SCENE ---- */
.bg-scene {
	position: fixed;
	inset: 0;
	z-index: 0;
	pointer-events: none;
}

.sky {
	position: absolute;
	inset: 0;
	background: linear-gradient(
		180deg,
		#FFD580 0%,
		#FFAA5C 25%,
		#FF7E5F 50%,
		#FF6B5B 65%,
		#1A8FAF 65%,
		#0A6080 100%
	);
}

/* Sun */
.sun {
	position: absolute;
	top: 8%;
	right: 12%;
	width: 90px;
	height: 90px;
}

.sun::before {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background: radial-gradient(circle, #FFF9A0 0%, #FFE566 50%, #FFCA28 100%);
	box-shadow: 0 0 60px 20px rgba(255, 220, 60, 0.5), 0 0 120px 40px rgba(255, 180, 30, 0.2);
	animation: sunPulse 4s ease-in-out infinite;
}

.sun-rays {
	position: absolute;
	inset: 0;
	animation: rotateSun 20s linear infinite;
}

.ray {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 120px;
	height: 2px;
	background: linear-gradient(90deg, rgba(255, 230, 80, 0.6), transparent);
	transform-origin: 0 50%;
	transform: rotate(calc(var(--i) * 45deg)) translateY(-50%);
}

@keyframes sunPulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.05); }
}
@keyframes rotateSun {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* Bubbles */
.bubble {
	position: absolute;
	bottom: -100px;
	left: var(--left);
	width: var(--size);
	height: var(--size);
	border-radius: 50%;
	background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), rgba(255,255,255,0.05));
	border: 1.5px solid rgba(255,255,255,0.25);
	animation: riseBubble var(--dur) var(--delay) infinite ease-in;
	backdrop-filter: blur(2px);
}

@keyframes riseBubble {
	0% { transform: translateY(0) scale(1); opacity: 0.7; }
	80% { opacity: 0.3; }
	100% { transform: translateY(-110vh) scale(0.8); opacity: 0; }
}

/* Waves */
.ocean-wrap {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 35%;
}

.wave {
	position: absolute;
	bottom: 30%;
	width: 100%;
	height: 80px;
}

.wave path {
	fill: rgba(255,255,255,0.15);
}

.wave1 {
	animation: waveShift 6s ease-in-out infinite;
}

.wave2 {
	bottom: 28%;
	animation: waveShift 8s ease-in-out infinite reverse;
}

.wave2 path {
	fill: rgba(255,255,255,0.1);
}

@keyframes waveShift {
	0%, 100% { transform: translateX(0); }
	50% { transform: translateX(-3%); }
}

.ocean-body {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 30%;
	background: linear-gradient(180deg, #0D7FA8 0%, #085C7A 100%);
}

.sand-bar {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 8%;
	background: linear-gradient(180deg, #E8C97A 0%, #D4A853 100%);
}

/* ---- CONTENT ---- */
.content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem 1rem 6rem;
	min-height: 100vh;
}

/* ---- HERO ---- */
.hero {
	text-align: center;
	padding: 2.5rem 0 2rem;
}

.gdg-badge {
	display: inline-block;
	background: rgba(255,255,255,0.2);
	backdrop-filter: blur(8px);
	border: 1px solid rgba(255,255,255,0.35);
	color: #fff;
	font-family: 'Nunito', sans-serif;
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	padding: 0.35rem 1rem;
	border-radius: 100px;
	margin-bottom: 1.2rem;
}

.hero-title {
	font-family: 'Pacifico', cursive;
	font-size: clamp(3.5rem, 10vw, 6rem);
	color: #fff;
	line-height: 1.05;
	text-shadow: 0 4px 30px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.3);
	margin-bottom: 0.75rem;
}

.title-wave {
	color: #FFE566;
	display: inline-block;
	animation: tiltWave 2s ease-in-out infinite;
	transform-origin: center bottom;
}

@keyframes tiltWave {
	0%, 100% { transform: rotate(-5deg) scaleX(1); }
	50% { transform: rotate(5deg) scaleX(1.2); }
}

.hero-sub {
	color: rgba(255,255,255,0.88);
	font-size: 1.1rem;
	font-weight: 500;
	letter-spacing: 0.02em;
}

/* ---- CARD ---- */
.card {
	background: rgba(255, 253, 249, 0.92);
	backdrop-filter: blur(20px);
	border: 1.5px solid rgba(255,255,255,0.7);
	border-radius: 24px;
	box-shadow:
		0 20px 60px rgba(10, 60, 90, 0.18),
		0 4px 16px rgba(10, 60, 90, 0.1),
		inset 0 1px 0 rgba(255,255,255,0.9);
	width: 100%;
	max-width: 620px;
	padding: 2.5rem;
	animation: cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes cardIn {
	from { opacity: 0; transform: translateY(30px) scale(0.97); }
	to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ---- PROGRESS ---- */
.progress-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0;
	margin-bottom: 2rem;
}

.progress-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
}

.progress-dot {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #E8E0D5;
	color: #9A8F83;
	font-size: 0.85rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.progress-dot.active {
	background: var(--ocean);
	color: #fff;
}

.progress-dot.current {
	background: var(--coral);
	color: #fff;
	box-shadow: 0 0 0 4px rgba(255, 107, 91, 0.2);
	transform: scale(1.1);
}

.progress-label {
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--text-light);
}

.progress-line {
	width: 60px;
	height: 2px;
	background: #E8E0D5;
	margin: 0 4px;
	margin-bottom: 20px;
	transition: background 0.3s ease;
	flex-shrink: 0;
}

.progress-line.filled {
	background: var(--ocean);
}

/* ---- GOOGLE BTN ---- */
.google-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	padding: 0.85rem 1.5rem;
	border: 2px solid #E0D8CE;
	border-radius: 14px;
	background: #fff;
	color: var(--text-dark);
	font-family: 'Nunito', sans-serif;
	font-size: 1rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	margin-bottom: 1.25rem;
}

.google-btn:hover:not(:disabled) {
	border-color: var(--ocean);
	box-shadow: 0 4px 16px rgba(26, 127, 168, 0.15);
	transform: translateY(-1px);
}

.google-btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.google-icon {
	width: 22px;
	height: 22px;
	flex-shrink: 0;
}

.spinner {
	width: 20px;
	height: 20px;
	border: 2.5px solid #E0D8CE;
	border-top-color: var(--ocean);
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

/* ---- DIVIDER ---- */
.divider {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1.5rem;
	color: var(--text-light);
	font-size: 0.82rem;
	font-weight: 600;
	letter-spacing: 0.06em;
}

.divider::before,
.divider::after {
	content: '';
	flex: 1;
	height: 1px;
	background: #E0D8CE;
}

/* ---- STEP HEADER ---- */
.step-header {
	margin-bottom: 1.5rem;
}

.step-title {
	font-family: 'Pacifico', cursive;
	font-size: 1.7rem;
	color: var(--ocean-deep);
	margin-bottom: 0.3rem;
}

.step-sub {
	color: var(--text-mid);
	font-size: 0.92rem;
}

/* ---- FORM GRID ---- */
.form-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.field.full {
	grid-column: 1 / -1;
}

label {
	font-size: 0.82rem;
	font-weight: 700;
	color: var(--text-mid);
	letter-spacing: 0.04em;
}

.label-note {
	font-weight: 400;
	color: var(--text-light);
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="url"],
select,
textarea {
	font-family: 'Nunito', sans-serif;
	font-size: 0.95rem;
	padding: 0.7rem 0.9rem;
	border: 1.5px solid #DDD5C8;
	border-radius: 10px;
	background: rgba(255,255,255,0.8);
	color: var(--text-dark);
	transition: all 0.2s ease;
	outline: none;
	width: 100%;
	resize: vertical;
}

input::placeholder,
textarea::placeholder {
	color: #B8AFA5;
}

input:focus,
select:focus,
textarea:focus {
	border-color: var(--ocean);
	background: #fff;
	box-shadow: 0 0 0 3px rgba(26, 127, 168, 0.12);
}

input.error,
select.error,
textarea.error {
	border-color: var(--coral);
}

.err {
	font-size: 0.76rem;
	color: var(--coral-dark);
	font-weight: 600;
}

/* ---- TRACKS GRID ---- */
.tracks-label {
	font-size: 0.82rem;
	font-weight: 700;
	color: var(--text-mid);
	letter-spacing: 0.04em;
	margin-bottom: 0.75rem;
}

.tracks-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.75rem;
}

.track-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.3rem;
	padding: 1rem 0.5rem;
	border: 2px solid #DDD5C8;
	border-radius: 14px;
	background: rgba(255,255,255,0.7);
	cursor: pointer;
	transition: all 0.2s ease;
	font-family: 'Nunito', sans-serif;
	text-align: center;
}

.track-card:hover {
	border-color: var(--ocean);
	background: rgba(26, 127, 168, 0.05);
	transform: translateY(-2px);
}

.track-card.selected {
	border-color: var(--coral);
	background: rgba(255, 107, 91, 0.08);
	box-shadow: 0 0 0 3px rgba(255, 107, 91, 0.15);
}

.track-icon {
	font-size: 1.8rem;
}

.track-name {
	font-size: 0.85rem;
	font-weight: 800;
	color: var(--text-dark);
}

.track-desc {
	font-size: 0.72rem;
	color: var(--text-light);
}

/* ---- REVIEW BOX ---- */
.review-box {
	background: linear-gradient(135deg, rgba(26, 127, 168, 0.06), rgba(43, 181, 160, 0.06));
	border: 1.5px solid rgba(26, 127, 168, 0.15);
	border-radius: 12px;
	padding: 1rem 1.25rem;
}

.review-title {
	font-size: 0.8rem;
	font-weight: 800;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--ocean);
	margin-bottom: 0.75rem;
}

.review-grid {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.35rem 1rem;
}

.rv-key {
	font-size: 0.8rem;
	font-weight: 700;
	color: var(--text-light);
}

.rv-val {
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-dark);
}

/* ---- CHECKBOX ---- */
.checkbox-label {
	display: flex;
	align-items: flex-start;
	gap: 0.6rem;
	font-size: 0.88rem;
	color: var(--text-mid);
	cursor: pointer;
	line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
	width: 18px;
	height: 18px;
	border-radius: 5px;
	flex-shrink: 0;
	margin-top: 1px;
	accent-color: var(--ocean);
	cursor: pointer;
}

.checkbox-label a {
	color: var(--ocean);
	text-decoration: underline;
	text-underline-offset: 2px;
}

/* ---- BUTTON ROW ---- */
.btn-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 1.75rem;
	gap: 1rem;
}

.btn-back {
	font-family: 'Nunito', sans-serif;
	font-size: 0.9rem;
	font-weight: 700;
	color: var(--text-mid);
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	transition: color 0.2s;
}

.btn-back:hover { color: var(--ocean); }

.btn-next {
	font-family: 'Nunito', sans-serif;
	font-size: 1rem;
	font-weight: 800;
	color: #fff;
	background: linear-gradient(135deg, var(--ocean) 0%, var(--teal) 100%);
	border: none;
	border-radius: 12px;
	padding: 0.8rem 2rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: all 0.2s ease;
	box-shadow: 0 4px 16px rgba(26, 127, 168, 0.3);
}

.btn-next:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 24px rgba(26, 127, 168, 0.4);
}

.btn-wave {
	display: inline-block;
	animation: tiltWave 1.5s ease-in-out infinite;
}

.btn-submit {
	font-family: 'Nunito', sans-serif;
	font-size: 1rem;
	font-weight: 800;
	color: #fff;
	background: linear-gradient(135deg, var(--coral) 0%, var(--sunset-deep) 100%);
	border: none;
	border-radius: 12px;
	padding: 0.8rem 2rem;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 4px 16px rgba(255, 107, 91, 0.35);
}

.btn-submit:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 24px rgba(255, 107, 91, 0.45);
}

/* ---- SUCCESS CARD ---- */
.success-card {
	text-align: center;
	padding: 3.5rem 2.5rem;
}

.success-icon {
	font-size: 4rem;
	margin-bottom: 1rem;
	animation: bounceWave 2s ease-in-out infinite;
}

@keyframes bounceWave {
	0%, 100% { transform: translateY(0) rotate(-5deg); }
	50% { transform: translateY(-10px) rotate(5deg); }
}

.success-title {
	font-family: 'Pacifico', cursive;
	font-size: 2rem;
	color: var(--ocean-deep);
	margin-bottom: 0.75rem;
}

.success-sub {
	color: var(--text-mid);
	font-size: 1rem;
	line-height: 1.6;
	margin-bottom: 1.5rem;
}

.success-tag {
	display: inline-block;
	background: linear-gradient(135deg, var(--ocean) 0%, var(--teal) 100%);
	color: #fff;
	font-size: 0.85rem;
	font-weight: 700;
	padding: 0.5rem 1.25rem;
	border-radius: 100px;
	letter-spacing: 0.05em;
}

/* ---- FOOTER ---- */
.footer {
	margin-top: 2rem;
	color: rgba(255,255,255,0.7);
	font-size: 0.82rem;
	font-weight: 600;
	text-align: center;
}

/* ---- RESPONSIVE ---- */
@media (max-width: 520px) {
	.card { padding: 1.75rem 1.25rem; }
	.form-grid { grid-template-columns: 1fr; }
	.field.full { grid-column: 1; }
	.tracks-grid { grid-template-columns: repeat(2, 1fr); }
	.hero-title { font-size: 3rem; }
	.progress-line { width: 32px; }
}
</style>
