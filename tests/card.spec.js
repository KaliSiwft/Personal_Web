const { test, expect } = require('@playwright/test');

const EMAIL = 'hello@example.com';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test.describe('个人名片 MVP 验收标准', () => {
  for (const [label, width, height] of [
    ['手机', 375, 667],
    ['桌面', 1280, 800],
  ]) {
    test(`${label}视口下无横向滚动`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);
    });
  }

  test('首屏包含姓名、定位文案与邮箱入口', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.name')).toHaveText('陈晨');
    await expect(page.locator('.tagline')).toHaveText('前端工程师 / 独立开发者');
    const emailBtn = page.locator('.copy-btn').first();
    await expect(emailBtn).toBeVisible();
    await expect(emailBtn).toContainText(EMAIL);
    // 首屏：无需滚动即可见
    const inViewport = await emailBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight;
    });
    expect(inViewport).toBe(true);
  });

  test('点击邮箱按钮后剪贴板为邮箱地址且出现已复制提示', async ({ page }) => {
    await page.goto('/');
    const emailBtn = page.locator('.copy-btn').first();
    await emailBtn.click();
    await expect(emailBtn).toContainText('已复制');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(EMAIL);
    // 提示为临时状态，2 秒后恢复
    await expect(emailBtn).toContainText(EMAIL, { timeout: 4000 });
  });

  test('社交链接 href 正确且在新标签页打开', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a.social-link');
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute('href', 'https://github.com/yourname');
    await expect(links.nth(1)).toHaveAttribute('href', 'https://www.linkedin.com/in/yourname');
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('页面标题、描述与 favicon 配置完整', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/陈晨/);
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description?.trim()).toBeTruthy();
    const favicon = await page.getAttribute('link[rel="icon"]', 'href');
    expect(favicon?.trim()).toBeTruthy();
    // favicon 可正常加载
    const res = await page.request.get(favicon);
    expect(res.ok()).toBe(true);
  });
});
