/* ===== 要素取得 ===== */
const input        = document.getElementById('input');
const preview      = document.getElementById('preview');
const copyAsciiBtn = document.getElementById('copyAsciiBtn');
const copyTeXBtn   = document.getElementById('copyTeXBtn');
const copyMdBtn    = document.getElementById('copyMdBtn');
const copyHtmlBtn  = document.getElementById('copyHtmlBtn');
const screenshotBtn= document.getElementById('screenshotBtn');
const themeToggle  = document.getElementById('themeToggle');
const paletteBtns  = document.querySelectorAll('.palette button');

/* ===== ライブラリ準備 ===== */
const parser  = new AsciiMathParser();
let   lastTex = '';

/* ===== 数式レンダリング ===== */
function render() {
  const ascii = input.value.trim().replace(/\n/g, '\\');
  const tex   = parser.parse(ascii).replace(/\\cdot/g, '\\times');
  lastTex     = tex;

  preview.innerHTML = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: true
  });
}

/* ===== テキストエリアに挿入 ===== */
function insertAtCursor(el, text) {
  const [s, e] = [el.selectionStart, el.selectionEnd];
  el.value = el.value.slice(0, s) + text + el.value.slice(e);
  el.setSelectionRange(s + text.length, s + text.length);
  el.focus();
  render();
}

/* パレットボタン */
paletteBtns.forEach(btn =>
  btn.addEventListener('click', () =>
    insertAtCursor(input, btn.dataset.ascii)
  )
);

/* ===== クリップボード関連 ===== */
copyAsciiBtn.addEventListener('click', () =>
  navigator.clipboard.writeText(input.value)
           .then(() => alert('AsciiMath コピーしたで！'))
);

copyTeXBtn.addEventListener('click', () =>
  navigator.clipboard.writeText(lastTex)
           .then(() => alert('TeX コードコピーしたで！'))
);

copyMdBtn.addEventListener('click', () =>
  navigator.clipboard.writeText(`$$\n${lastTex}\n$$`)
           .then(() => alert('Markdown コピーしたで！'))
);

copyHtmlBtn.addEventListener('click', () =>
  navigator.clipboard.writeText(preview.innerHTML)
           .then(() => alert('HTML コピーしたで！'))
);

/* ===== スクリーンショット ===== */
screenshotBtn.addEventListener('click', () => {
  html2canvas(preview, { backgroundColor: null }).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = 'preview.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  });
});

/* ===== テーマ切替 ===== */
function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
}

themeToggle.addEventListener('click', () => {
  const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

/* ===== イベント ===== */
window.addEventListener('load', () => {
  initTheme();
  render();
});
input.addEventListener('input', render);
