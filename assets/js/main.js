(function(){
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById('menuToggle');
  const menu = document.getElementById('site-menu');
  if(menuToggle && menu){
    menuToggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const themeToggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('color-scheme');
  if(stored === 'light') document.body.classList.add('light');
  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const mode = document.body.classList.contains('light') ? 'light' : 'dark';
      localStorage.setItem('color-scheme', mode);
    });
  }
})();


// -------- Projects (GitHub) --------
async function fetchJSON(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
  return await r.json();
}

// Format time ago
function timeAgo(dateStr){
  const d = new Date(dateStr);
  const sec = Math.floor((new Date() - d) / 1000);
  const mins = Math.floor(sec/60), hrs = Math.floor(mins/60), days = Math.floor(hrs/24), months=Math.floor(days/30), years=Math.floor(days/365);
  if(years>0) return years + 'y ago';
  if(months>0) return months + 'mo ago';
  if(days>0) return days + 'd ago';
  if(hrs>0) return hrs + 'h ago';
  if(mins>0) return mins + 'm ago';
  return 'just now';
}

async function loadProjects(){
  const grid = document.getElementById('projects-grid');
  if(!grid) return;
  const username = document.body.dataset.gh || 'ahsanjmirza';

  // Try curated list
  let repos = [];
  try {
    const curated = await fetch('projects.json', {cache: 'no-store'});
    if(curated.ok){
      const data = await curated.json();
      if(Array.isArray(data.repos) && data.repos.length){
        const details = await Promise.all(data.repos.map(full=>fetchJSON('https://api.github.com/repos/'+full)));
        repos = details;
      }
    }
  } catch(e){ /* ignore */ }

  // Fallback to recent public repos
  if(!repos.length){
    const list = await fetchJSON(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    repos = list.filter(r => !r.fork).sort((a,b)=> b.stargazers_count - a.stargazers_count).slice(0,12);
  }

  grid.innerHTML = '';
  repos.forEach(r => {
    const topics = (r.topics || []).slice(0,4);
    const homepage = r.homepage && r.homepage.trim() ? r.homepage : null;
    const card = document.createElement('article');
    card.className = 'project card';
    card.innerHTML = `
      <div class="title">
        <a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
        <span class="badge">${r.language || '—'}</span>
      </div>
      <p class="desc">${r.description || ''}</p>
      <div class="badges">
        ${topics.map(t=>`<span class="badge">#${t}</span>`).join('')}
      </div>
      <div class="meta">
        <span>updated ${timeAgo(r.pushed_at)}</span>
        <span class="links">
          ${homepage ? `<a href="${homepage}" target="_blank" rel="noopener">Demo</a>` : ''}
          <a href="${r.html_url}" target="_blank" rel="noopener">Repo</a>
        </span>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadProjects);
