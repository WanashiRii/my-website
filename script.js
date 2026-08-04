let articlesData = [];

// ===== 1. articles.json の読み込み =====
fetch('articles.json')
  .then(response => response.json())
  .then(data => {
    articlesData = data;
    renderArticleList(); // 記事一覧のレンダリング
    handleRoute(); // 読み込み完了後にルーティング実行
  })
  .catch(err => {
    console.error('記事データの取得に失敗しました:', err);
    handleRoute();
  });

// ===== 2. 記事一覧のレンダリング =====
function renderArticleList() {
  const container = document.querySelector('.article-list-container');
  if (!container) return;
  container.innerHTML = '';

  articlesData.forEach(article => {
    const el = document.createElement('div');
    el.className = 'article-card';
    
    // contentが配列の場合は最初の1行を簡易表示
    const previewText = Array.isArray(article.content) ? article.content[0] : article.content;

    el.innerHTML = `
      <h3>${article.title}</h3>
      <div class="article-date">${article.date || ''}</div>
      <p style="margin: 6px 0 0 0; font-size: 0.9rem; color: #555;">${previewText}</p>
    `;

    // クリックで個別記事へ飛ぶ（ハッシュを更新）
    el.addEventListener('click', () => {
      window.location.hash = `#article-${article.id}`;
    });

    container.appendChild(el);
  });
}

// ===== 3. 個別記事の表示 =====
function showArticleDetail(id) {
  const article = articlesData.find(a => String(a.id) === String(id));
  const container = document.getElementById('article-content');

  if (!article) {
    navigateTo('articles');
    return;
  }

  const contentHtml = Array.isArray(article.content) 
    ? article.content.map(p => `<p>${p}</p>`).join('') 
    : `<p>${article.content}</p>`;

  container.innerHTML = `
    <h2>${article.title}</h2>
    <div class="article-date" style="margin-bottom: 15px;">${article.date || ''}</div>
    <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;">
    ${contentHtml}
  `;

  navigateTo('article-detail');
}

// 4. ページ切り替え（ルーター）
function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  let targetPage = document.getElementById(pageId);

  if (!targetPage) {
    pageId = 'profile'; // 👈 'portal' から 'profile' に変更
    targetPage = document.getElementById(pageId);
  }

  pages.forEach(p => p.classList.remove('active'));
  if (targetPage) targetPage.classList.add('active');
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '');

  if (hash.startsWith('article-')) {
    const id = hash.replace('article-', '');
    showArticleDetail(id);
  } else {
    navigateTo(hash || 'profile');
  }
}

// ===== 5. イベント設定 =====
window.addEventListener('hashchange', handleRoute);

// 「記事一覧に戻る」ボタン
const backBtn = document.getElementById('back-to-articles');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.hash = '#articles';
  });
}