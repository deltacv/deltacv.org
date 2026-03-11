<a href="/blog" class="card" aria-label="Blog">
	<div class="icon-container">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="80"
			height="80"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	</div>

	<div class="footer">
		<h2>Blog</h2>
	</div>
</a>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

	.card {
		font-family: 'Inter', sans-serif;
		position: relative;
		width: 100%;
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		background-color: #161b22;
		border: 1px solid #30363d;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s ease;
		text-decoration: none;
	}

	.card:hover {
		transform: scale(1.02);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
		border-color: #484f58;
	}

	.icon-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		background-color: #21262d;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #8b949e;
		transition: color 0.2s ease;
	}

	.card:hover .icon-container {
		color: #58a6ff;
	}

	.footer {
		width: 100%;
		background: #0d1117;
		padding: 1rem 1.25rem;
		box-sizing: border-box;
		min-height: 56px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #21262d;
	}

	.footer h2 {
		color: #c9d1d9;
		margin: 0;
		font-size: 1.15rem;
		font-weight: 600;
		word-wrap: break-word;
		max-width: 100%;
		transition: color 0.2s ease;
	}

	.card:hover .footer h2 {
		color: #58a6ff;
	}
</style>