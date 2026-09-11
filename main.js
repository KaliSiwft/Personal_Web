// 点击复制：邮箱按钮与微信图标按钮共用同一逻辑
document.querySelectorAll('[data-copy]').forEach((el) => {
  el.addEventListener('click', async () => {
    const text = el.dataset.copy;
    const ok = await copyText(text);
    if (!ok) return;

    const label = el.querySelector('.copy-text');
    const original = label ? label.textContent : null;
    el.classList.add('copied');
    el.setAttribute('aria-label', el.getAttribute('aria-label').replace(/^.*/, `${text}（已复制）`));
    if (label) label.textContent = '已复制 ✓';

    setTimeout(() => {
      el.classList.remove('copied');
      if (label) label.textContent = original;
    }, 2000);
  });
});

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 降级：旧浏览器或权限受限时使用 execCommand
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// 页脚年份自动更新
document.getElementById('year').textContent = new Date().getFullYear();
