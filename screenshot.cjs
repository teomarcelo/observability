const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const LOGIN_URL = 'https://login.salesforce.com/';
const USERNAME  = 'epic.th.fd6dae9c4e75@orgfarm.salesforce.com';
const PASSWORD  = 'orgfarm1234';
const OUT       = path.join(__dirname, 'screenshots3');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let idx = 0;
async function shot(page, name) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
  const file = `${OUT}/${String(idx++).padStart(2,'0')}_${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log('  saved:', path.basename(file));
}

// Click a tab by its visible text inside the main content area (not sidebar)
async function clickInnerTab(page, text) {
  try {
    // Lightning tabs render as <a> inside <li role="tab"> or <lightning-tab>
    // Use JS to find the element by text within the right portion of the page
    const clicked = await page.evaluate(function(tabText) {
      // Find all elements with the tab text that are NOT in the sidebar (x > 260)
      var all = Array.from(document.querySelectorAll('a, [role="tab"], li'));
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
  } catch(e) {
    console.log('  clickInnerTab error: ' + text + ' - ' + e.message);
    return false;
  }
}

// Click Agent Type dropdown and select an option
async function selectAgentType(page, agentType) {
  try {
    // Click the Agent Type combobox button
    await page.locator('button[aria-label="Agent Type"], [title="Agent Type"], span[title="' + agentType + '"]').first().waitFor({ state: 'visible', timeout: 5000 });
  } catch(e) {}
  try {
    // Find the combobox by looking for the dropdown near "Agent Type" label
    const btn = page.locator('span.slds-media__figure.slds-media__figure_reverse').first();
    await btn.click();
    await page.waitForTimeout(1000);
    await page.locator('span[title="' + agentType + '"], lightning-base-combobox-item:has-text("' + agentType + '")').first().click();
    await page.waitForTimeout(3000);
    return true;
  } catch(e) {
    // Try clicking the visible dropdown button text
    try {
      const dropBtn = page.locator('button:has-text("' + agentType === 'Service Agent' ? 'Employee Agent' : 'Service Agent' + '")').first();
      await dropBtn.click();
      await page.waitForTimeout(1000);
      await page.locator('span[title="' + agentType + '"]').first().click();
      await page.waitForTimeout(3000);
      return true;
    } catch(e2) {
      return false;
    }
  }
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const ctx     = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page    = await ctx.newPage();
  page.setDefaultTimeout(60000);

  // Login
  console.log('Logging in...');
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  await page.fill('#username', USERNAME);
  await page.fill('#password', PASSWORD);
  await page.click('#Login');
  await page.waitForURL('**/*.salesforce.com/**', { timeout: 60000 });
  await page.waitForTimeout(5000);

  // App Launcher → Agentforce Studio
  await page.click('[title="App Launcher"]');
  await page.waitForSelector('input[placeholder="Search apps and items..."]', { timeout: 20000 });
  await page.fill('input[placeholder="Search apps and items..."]', 'Agentforce Studio');
  await page.waitForTimeout(2000);
  await page.locator('a:has-text("Agentforce Studio")').first().click();
  await page.waitForTimeout(6000);

  // Analytics
  console.log('\n=== SERVICE AGENT ANALYTICS ===');
  await page.locator('text="Analytics"').first().click();
  await page.waitForTimeout(4000);

  // Switch to Service Agent using the Agent Type dropdown
  // The dropdown button shows the current value
  try {
    // Find the dropdown - it shows "Employee Agent" or "Service Agent"
    const agentTypeDrop = page.locator('button.slds-button.slds-button_reset.slds-global-header__item-action').first();
    // Actually look for the combobox trigger near "Agent Type" text
    await page.evaluate(function() {
      // find the select/combobox near "Agent Type" and click it
      var labels = Array.from(document.querySelectorAll('label, span'));
      for (var i = 0; i < labels.length; i++) {
        if (labels[i].textContent.trim() === 'Agent Type') {
          var parent = labels[i].closest('.slds-form-element, .slds-combobox_container, div');
          if (parent) {
            var btn = parent.querySelector('button') || parent.nextElementSibling && parent.nextElementSibling.querySelector('button');
            if (btn) { btn.click(); return; }
          }
        }
      }
      // fallback: click any button that contains "Employee Agent" or "Service Agent"
      var btns = Array.from(document.querySelectorAll('button'));
      for (var j = 0; j < btns.length; j++) {
        if (btns[j].textContent.includes('Employee Agent') || btns[j].textContent.includes('Service Agent')) {
          btns[j].click(); return;
        }
      }
    });
    await page.waitForTimeout(1500);
    // Click "Service Agent" option
    await page.locator('span[title="Service Agent"], lightning-base-combobox-item:has-text("Service Agent")').first().click();
    await page.waitForTimeout(4000);
    console.log('  Switched to Service Agent');
  } catch(e) {
    console.log('  Agent type switch:', e.message);
  }

  await shot(page, 'sa_effectiveness');

  // Scroll down and take another shot to get the full content
  await page.evaluate(function() { window.scrollTo(0, 500); });
  await page.waitForTimeout(500);
  await shot(page, 'sa_effectiveness_bottom');
  await page.evaluate(function() { window.scrollTo(0, 0); });

  // SA inner tabs
  var saTabs = ['Usage', 'Quality', 'Health', 'Trust', 'Voice'];
  for (var i = 0; i < saTabs.length; i++) {
    console.log('  SA tab: ' + saTabs[i]);
    var ok = await clickInnerTab(page, saTabs[i]);
    if (!ok) console.log('    (tab click may have failed)');
    await shot(page, 'sa_' + saTabs[i].toLowerCase());
    // Scroll to capture more
    await page.evaluate(function() { window.scrollTo(0, 500); });
    await page.waitForTimeout(400);
    await shot(page, 'sa_' + saTabs[i].toLowerCase() + '_scroll');
    await page.evaluate(function() { window.scrollTo(0, 0); });
  }

  // SA Performance Insights (top-level tab)
  console.log('  SA tab: Performance Insights');
  await page.locator('text="Performance Insights"').first().click();
  await page.waitForTimeout(3000);
  await shot(page, 'sa_performance_insights');

  // ── Employee Agent ──
  console.log('\n=== EMPLOYEE AGENT ANALYTICS ===');
  // Go back to Overview tab
  await page.locator('text="Overview"').first().click();
  await page.waitForTimeout(2000);

  // Switch to Employee Agent
  try {
    await page.evaluate(function() {
      var btns = Array.from(document.querySelectorAll('button'));
      for (var j = 0; j < btns.length; j++) {
        if (btns[j].textContent.includes('Service Agent')) {
          btns[j].click(); return;
        }
      }
    });
    await page.waitForTimeout(1500);
    await page.locator('span[title="Employee Agent"], lightning-base-combobox-item:has-text("Employee Agent")').first().click();
    await page.waitForTimeout(4000);
    console.log('  Switched to Employee Agent');
  } catch(e) {
    console.log('  EA switch error:', e.message);
  }

  await shot(page, 'ea_effectiveness');
  await page.evaluate(function() { window.scrollTo(0, 500); });
  await page.waitForTimeout(400);
  await shot(page, 'ea_effectiveness_bottom');
  await page.evaluate(function() { window.scrollTo(0, 0); });

  var eaTabs = ['Usage', 'User Satisfaction', 'Quality', 'Health', 'Trust'];
  for (var j = 0; j < eaTabs.length; j++) {
    console.log('  EA tab: ' + eaTabs[j]);
    await clickInnerTab(page, eaTabs[j]);
    await shot(page, 'ea_' + eaTabs[j].toLowerCase().replace(/\s+/g,'_'));
    await page.evaluate(function() { window.scrollTo(0, 500); });
    await page.waitForTimeout(400);
    await shot(page, 'ea_' + eaTabs[j].toLowerCase().replace(/\s+/g,'_') + '_scroll');
    await page.evaluate(function() { window.scrollTo(0, 0); });
  }

  // EA Performance Insights
  await page.locator('text="Performance Insights"').first().click();
  await page.waitForTimeout(3000);
  await shot(page, 'ea_performance_insights');

  // ── Optimization: Insights ──
  console.log('\n=== OPTIMIZATION ===');
  // Make sure Optimization is expanded
  try {
    await page.locator('text="Optimization"').first().click();
    await page.waitForTimeout(1500);
  } catch(e) {}

  await page.locator('text="Insights"').first().click();
  await page.waitForTimeout(5000);
  await shot(page, 'optimization_insights');

  // ── Sessions & Intents ──
  await page.locator('text="Sessions & Intents"').first().click();
  await page.waitForTimeout(5000);
  await shot(page, 'sessions_intents');

  // Try Processed / Unprocessed tabs
  await clickInnerTab(page, 'Processed Sessions');
  await page.waitForTimeout(2000);
  await shot(page, 'sessions_processed');

  await clickInnerTab(page, 'Unprocessed Sessions');
  await page.waitForTimeout(2000);
  await shot(page, 'sessions_unprocessed');

  // ── Scorers ──
  await page.locator('text="Scorers"').first().click();
  await page.waitForTimeout(3000);
  await shot(page, 'scorers');

  console.log('\nDone. Screenshots in:', OUT);
  await browser.close();
})();
