const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  const report = [];
  for (const width of [360, 390, 768, 1366, 1920, 2560]) {
    await page.setViewportSize({ width, height: width < 800 ? 900 : 1080 });
    await page.goto('http://localhost:3190', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path:`artifacts/polish/home-${width}.png`,fullPage:true,caret:'initial'});
    await page.screenshot({path:`artifacts/polish/top-${width}.png`,caret:'initial'});
    await page.locator('.featured-section').screenshot({path:`artifacts/polish/products-${width}.png`,caret:'initial'});
    const fonts = await page.evaluate(() => Object.fromEntries(['.hero h1','.hero-copy>p','.button','.product-name','.price','.main-nav>a','.section-heading h2','.footer-main h4'].map(s=>[s,getComputedStyle(document.querySelector(s)).fontSize])));
    const routes = [];
    for (const path of ['/', '/shop', '/product/linen-shirt', '/cart', '/checkout', '/track', '/about', '/policies', '/wishlist']) {
      if(path !== '/') await page.goto(`http://localhost:3190${path}`, {waitUntil:'networkidle'});
      routes.push(await page.evaluate(path => ({path, width: innerWidth, scrollWidth: document.documentElement.scrollWidth}), path));
    }
    report.push({width,fonts,routes});
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://localhost:3190',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Mở menu',exact:true}).click();
  await page.getByRole('navigation').getByRole('link',{name:/Yêu thích/}).waitFor();
  await page.screenshot({path:'artifacts/polish/mobile-menu.png',caret:'initial'});
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Tìm kiếm',exact:true}).click();
  await page.getByRole('textbox',{name:'Tìm sản phẩm'}).fill('Linen');
  await page.keyboard.press('Enter');
  await page.waitForURL('**/shop?q=Linen');
  await page.locator('.product-name').first().waitFor();
  const search = await page.locator('.product-name').allTextContents();
  await page.goto('http://localhost:3190',{waitUntil:'networkidle'});
  const styleLinks = [];
  for(let i=0;i<3;i++){
    await page.locator('.style-card').nth(i).click();
    await page.waitForURL('**/shop?category=*');
    styleLinks.push({url:page.url(),count:await page.locator('.product-card').count()});
    await page.goto('http://localhost:3190',{waitUntil:'networkidle'});
  }
  const result={report,errors,search,styleLinks};
  fs.writeFileSync('artifacts/polish/responsive-audit.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify({fonts:report.map(r=>({width:r.width,fonts:r.fonts})),overflow:report.flatMap(r=>r.routes.filter(p=>p.scrollWidth>p.width)),errors,search,styleLinks},null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
