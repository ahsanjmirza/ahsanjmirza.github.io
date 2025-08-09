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