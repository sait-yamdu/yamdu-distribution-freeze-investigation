const {chromium}=require('playwright');
(async()=>{const c=await chromium.launchPersistentContext('/tmp/claude-0/prof2',{headless:false,executablePath:'/usr/bin/google-chrome',viewport:null,args:['--no-sandbox','--remote-debugging-port=9222','--window-size=1392,900','--window-position=0,0']});
const p=c.pages()[0]||await c.newPage();await p.goto('https://scotty.yamdu.com');console.log('up',await p.title());setInterval(()=>{},1e6)})();
