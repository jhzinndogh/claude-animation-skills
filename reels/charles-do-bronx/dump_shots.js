const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch({ executablePath: process.env.CHROME, args: ['--allow-file-access-from-files'] }); const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/web/index.html');
  const d = await p.evaluate(() => SHOTS.map(s => ({ s: s.start, e: s.end, tr: s.tr })));
  fs.writeFileSync('audio/shots.json', JSON.stringify(d)); console.log(d.length, 'shots'); await b.close(); })();
