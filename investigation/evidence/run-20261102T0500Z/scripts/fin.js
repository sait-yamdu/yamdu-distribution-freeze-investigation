const L=require('./lib');
(async()=>{const {p}=await L.conn();
await p.evaluate(()=>{window.scrollTo(0,0)});await p.mouse.click(1291,36);await p.waitForTimeout(2000);await p.mouse.click(895,224);await p.waitForTimeout(3000);
await p.screenshot({path:L.EV+'/14-final.png'});L.log('closed modal (discard); session last full load ~05:11Z login; no reload since');process.exit(0)})();
