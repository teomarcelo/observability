const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const LOGIN_URL = 'https://login.salesforce.com/';
const USERNAME = 'epic.th.fd6dae9c4e75@orgfarm.salesforce.com';
const PASSWORD = 'orgfarm1234';
const OUT = path.join(__dirname, 'screenshots4');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const layoutData = {};
let idx = 0;

async function shot(page, name) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
  const file = `${OUT}/${String(idx++).padStart(2, '0')}_${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log('  saved:', path.basename(file));
  return file;
}

async function extractLayout(page, sectionName) {
  const data = await page.evaluate(() => {
    const results = { cards: [], tabs: [], filters: [], tables: [], headings: [] };

    // Extract headings
    document.querySelectorAll('h1, h2, h3, .slds-text-heading_large, .slds-text-heading_medium').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        results.headings.push({
          text: el.textContent.trim().substring(0, 100),
          tag: el.tagName,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    });

    // Extract card-like elements
    document.querySelectorAll('[class*="card"], [class*="tile"], [class*="kpi"], [class*="metric"]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 50 && rect.height > 30) {
        const style = getComputedStyle(el);
        results.cards.push({
          text: el.textContent.trim().substring(0, 200),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          bg: style.backgroundColor,
          border: style.border,
          borderRadius: style.borderRadius
        });
      }
    });

    // Extract tabs
    document.querySelectorAll('[role="tab"], [role="tablist"] a, [role="tablist"] button').forEach(el => {
      results.tabs.push({
        text: el.textContent.trim(),
        active: el.getAttribute('aria-selected') === 'true' || el.classList.contains('slds-is-active'),
      });
    });

    // Extract filter dropdowns
    document.querySelectorAll('select, [role="combobox"], [role="listbox"]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        results.filters.push({
          label: el.getAttribute('aria-label') || el.previousElementSibling?.textContent?.trim() || '',
          value: el.value || el.textContent.trim().substring(0, 50),
        });
      }
    });

    // Extract table headers
    document.querySelectorAll('table, [role="grid"]').forEach(table => {
      const headers = [];
      table.querySelectorAll('th, [role="columnheader"]').forEach(th => {
        headers.push(th.textContent.trim());
      });
      if (headers.length > 0) {
        const rows = table.querySelectorAll('tbody tr, [role="row"]').length;
        results.tables.push({ headers, rowCount: rows });
      }
    });

    return results;
  });

  layoutData[sectionName] = data;
  console.log(`  Layout extracted: ${sectionName} (${data.headings.length} headings, ${data.cards.length} cards, ${data.tabs.length} tabs)`);
}

async function clickInnerTab(page, text) {
  try {
    const clicked = await page.evaluate(function (tabText) {
      var all = Array.from(document.querySelectorAll('a, [role="tab"], li, button'));
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.textContent.trim() === tabText) {
          var rect = el.getBoundingClientRect();
          if (rect.x > 260 && rect.y > 200 && rect.y < 500) {
            el.click();
            return true;
          }
        }
      }
      return false;
    }, text);
    await page.waitForTimeout(3000);
    return clicked;
  } catch (e) {
    console.log('  clickInnerTab error: ' + text + ' - ' + e.message);
    return false;
  }
}

async function switchAgentType(page, agentType) {
  try {
    await page.evaluate(function (targetType) {
      var btns = Array.from(document.querySelectorAll('button'));
      for (var j = 0; j < btns.length; j++) {
        if (btns[j].textContent.includes('Employee Agent') || btns[j].textContent.includes('Service Agent')) {
          btns[j].click();
          return;
        }
      }
      var labels = Array.from(document.querySelectorAll('label, span'));
      for (var i = 0; i < labels.length; i++) {
        if (labels[i].textContent.trim() === 'Agent Type') {
          var parent = labels[i].closest('.slds-form-element, .slds-combobox_container, div');
          if (parent) {
            var btn = parent.querySelector('button') || (parent.nextElementSibling && parent.nextElementSibling.querySelector('button'));
            if (btn) { btn.click(); return; }
          }
        }
      }
    }, agentType);
    await page.waitForTimeout(1500);
    await page.locator(`span[title="${agentType}"], lightning-base-combobox-item:has-text("${agentType}")`).first().click();
    await page.waitForTimeout(4000);
    console.log(`  Switched to ${agentType}`);
    return true;
  } catch (e) {
    console.log(`  Agent type switch error: ${e.message}`);
    return false;
  }
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.setDefaultTimeout(60000);

  // ── Login ──
  console.log('Logging in...');
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  await page.fill('#username', USERNAME);
  await page.fill('#password', PASSWORD);
  await page.click('#Login');
  await page.waitForURL('**/*.salesforce.com/**', { timeout: 60000 });
  await page.waitForTimeout(5000);

  // ── Navigate to Agentforce Studio ──
  console.log('Opening Agentforce Studio...');
  await page.click('[title="App Launcher"]');
  await page.waitForSelector('input[placeholder="Search apps and items..."]', { timeout: 20000 });
  await page.fill('input[placeholder="Search apps and items..."]', 'Agentforce Studio');
  await page.waitForTimeout(2000);
  await page.locator('a:has-text("Agentforce Studio")').first().click();
  await page.waitForTimeout(6000);

  // ════════════════════════════════════════════════════
  // ANALYTICS — Service Agent
  // ════════════════════════════════════════════════════
  console.log('\n=== ANALYTICS: SERVICE AGENT ===');
  await page.locator('text="Analytics"').first().click();
  await page.waitForTimeout(4000);

  // Switch to Service Agent
  await switchAgentType(page, 'Service Agent');

  // Overview > Effectiveness (default)
  await extractLayout(page, 'analytics_sa_effectiveness');
  await shot(page, 'analytics_sa_effectiveness');

  // Overview sub-tabs
  const saTabs = ['Usage', 'Quality', 'Health', 'Trust', 'Voice'];
  for (const tab of saTabs) {
    console.log(`  SA tab: ${tab}`);
    await clickInnerTab(page, tab);
    await extractLayout(page, `analytics_sa_${tab.toLowerCase()}`);
    await shot(page, `analytics_sa_${tab.toLowerCase()}`);
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    await shot(page, `analytics_sa_${tab.toLowerCase()}_scroll`);
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // Performance Insights tab
  console.log('  SA: Performance Insights');
  await page.locator('text="Performance Insights"').first().click();
  await page.waitForTimeout(3000);
  await extractLayout(page, 'analytics_sa_performance_insights');
  await shot(page, 'analytics_sa_perf_insights');

  // ════════════════════════════════════════════════════
  // ANALYTICS — Employee Agent
  // ════════════════════════════════════════════════════
  console.log('\n=== ANALYTICS: EMPLOYEE AGENT ===');
  await page.locator('text="Overview"').first().click();
  await page.waitForTimeout(2000);
  await switchAgentType(page, 'Employee Agent');

  await extractLayout(page, 'analytics_ea_effectiveness');
  await shot(page, 'analytics_ea_effectiveness');

  const eaTabs = ['Usage', 'User Satisfaction', 'Quality', 'Health', 'Trust'];
  for (const tab of eaTabs) {
    console.log(`  EA tab: ${tab}`);
    await clickInnerTab(page, tab);
    await extractLayout(page, `analytics_ea_${tab.toLowerCase().replace(/\s+/g, '_')}`);
    await shot(page, `analytics_ea_${tab.toLowerCase().replace(/\s+/g, '_')}`);
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    await shot(page, `analytics_ea_${tab.toLowerCase().replace(/\s+/g, '_')}_scroll`);
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // EA Performance Insights
  console.log('  EA: Performance Insights');
  await page.locator('text="Performance Insights"').first().click();
  await page.waitForTimeout(3000);
  await extractLayout(page, 'analytics_ea_performance_insights');
  await shot(page, 'analytics_ea_perf_insights');

  // ════════════════════════════════════════════════════
  // OPTIMIZATION > INSIGHTS
  // ════════════════════════════════════════════════════
  console.log('\n=== OPTIMIZATION: INSIGHTS ===');
  try {
    await page.locator('text="Optimization"').first().click();
    await page.waitForTimeout(1500);
  } catch (e) {}
  await page.locator('text="Insights"').first().click();
  await page.waitForTimeout(5000);
  await extractLayout(page, 'optimization_insights');
  await shot(page, 'optimization_insights');
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(400);
  await shot(page, 'optimization_insights_scroll');
  await page.evaluate(() => window.scrollTo(0, 0));

  // ════════════════════════════════════════════════════
  // OPTIMIZATION > SESSIONS & INTENTS
  // ════════════════════════════════════════════════════
  console.log('\n=== OPTIMIZATION: SESSIONS & INTENTS ===');
  await page.locator('text="Sessions & Intents"').first().click();
  await page.waitForTimeout(5000);
  await extractLayout(page, 'sessions_processed');
  await shot(page, 'sessions_processed');

  // Unprocessed tab
  await clickInnerTab(page, 'Unprocessed Sessions');
  await page.waitForTimeout(2000);
  await extractLayout(page, 'sessions_unprocessed');
  await shot(page, 'sessions_unprocessed');

  // ════════════════════════════════════════════════════
  // SCORERS
  // ════════════════════════════════════════════════════
  console.log('\n=== SCORERS ===');
  await page.locator('text="Scorers"').first().click();
  await page.waitForTimeout(3000);
  await extractLayout(page, 'scorers');
  await shot(page, 'scorers');

  // ════════════════════════════════════════════════════
  // ALERTS
  // ════════════════════════════════════════════════════
  console.log('\n=== ALERTS ===');
  try {
    // Try clicking Alerts in the sidebar
    const alertsClicked = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('a, span, div, li'));
      for (const el of items) {
        const text = el.textContent.trim();
        const rect = el.getBoundingClientRect();
        if (text === 'Alerts' && rect.x < 260 && rect.y > 100) {
          el.click();
          return true;
        }
      }
      return false;
    });

    if (!alertsClicked) {
      // Try scrolling sidebar and looking for it
      await page.evaluate(() => {
        const sidebar = document.querySelector('[class*="sidebar"], nav, [role="navigation"]');
        if (sidebar) sidebar.scrollTop = sidebar.scrollHeight;
      });
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('a, span, div, li'));
        for (const el of items) {
          if (el.textContent.trim() === 'Alerts') { el.click(); return true; }
        }
        return false;
      });
    }

    await page.waitForTimeout(5000);
    await extractLayout(page, 'alerts');
    await shot(page, 'alerts');

    // Scroll down to capture full page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    await shot(page, 'alerts_scroll');
    await page.evaluate(() => window.scrollTo(0, 0));

    // Try clicking any tabs/sub-sections within Alerts
    const alertTabs = await page.evaluate(() => {
      const tabs = [];
      document.querySelectorAll('[role="tab"], button').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.x > 260 && rect.y > 100 && rect.y < 400) {
          const text = el.textContent.trim();
          if (text && text.length < 30 && !tabs.includes(text)) tabs.push(text);
        }
      });
      return tabs;
    });

    console.log('  Alerts tabs found:', alertTabs);
    for (const tab of alertTabs.slice(0, 5)) {
      console.log(`  Alerts tab: ${tab}`);
      await clickInnerTab(page, tab);
      await shot(page, `alerts_${tab.toLowerCase().replace(/\s+/g, '_')}`);
    }
  } catch (e) {
    console.log('  Alerts section error:', e.message);
    await shot(page, 'alerts_error_state');
  }

  // ── Save layout data ──
  const layoutFile = path.join(OUT, 'layout-data.json');
  fs.writeFileSync(layoutFile, JSON.stringify(layoutData, null, 2));
  console.log(`\nLayout data saved to: ${layoutFile}`);
  console.log(`Total screenshots: ${idx}`);
  console.log('Done. Screenshots in:', OUT);

  await browser.close();
})();
