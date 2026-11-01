const {chromium}=require('playwright-core');
(async()=>{const c=await chromium.launchPersistentContext('/tmp/claude-0/prof',{headless:false,executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',args:['--remote-debugging-port=9222','--no-sandbox'],viewport:{width:1400,height:900}});
const p=c.pages()[0]||await c.newPage();await p.goto('https://scotty.yamdu.com/#5551/announcements:files:filedistribution');console.log('ok',p.url(),await c.browser().version());setInterval(()=>{},1e6)})();
