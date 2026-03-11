<footer class="footer">
  <div class="footer-inner">
    <div class="contact-icons">
      <a href="mailto:dev@deltacv.org" target="_blank" aria-label="Email">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" fill="currentColor">
          <path d="M0 2a2 2 0 012-2h20a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm2 0v.01L12 9l10-6.99V2H2zm20 2.34l-8.42 5.9a1 1 0 01-1.16 0L2 4.34V14h20V4.34z"/>
        </svg>
      </a>
      <a href="https://github.com/deltacv" target="_blank" aria-label="GitHub">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.05c-3.2.7-3.88-1.55-3.88-1.55-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.2-3.07-.12-.3-.52-1.52.11-3.16 0 0 .98-.31 3.2 1.18a11.06 11.06 0 012.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.64.23 2.86.11 3.16.75.8 1.2 1.82 1.2 3.07 0 4.39-2.69 5.36-5.24 5.64.41.35.77 1.05.77 2.12v3.15c0 .31.21.66.79.55C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5z"/>
        </svg>
      </a>
    </div>
  </div>
</footer>

<style>
.footer {
  width: 100%;
  background-color: #0d1117;
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.footer-inner {
  width: 90%;
  max-width: 750px; /* match main content */
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-icons {
  display: flex;
  gap: 20px;
}

.contact-icons a {
  color: #58a6ff;
  transition: transform 0.2s, color 0.2s;
}

.contact-icons a:hover {
  color: #1f6feb;
  transform: scale(1.2);
}

.contact-icons svg {
  width: 28px;
  height: 28px;
}

@media (max-width: 768px) {
  .footer {
    padding: 15px 0;
  }

  .footer-inner {
    width: 95%;
  }

  .contact-icons {
    gap: 15px;
  }

  .contact-icons svg {
    width: 24px;
    height: 24px;
  }
}
</style>
