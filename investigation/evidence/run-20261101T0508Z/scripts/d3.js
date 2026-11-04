const L=require('./lib');(async()=>{const {p}=await L.conn();
await p.waitForTimeout(3000);
L.log('d PENDING sidebar Distribution');await p.mouse.click(96,378);await p.waitForTimeout(4000);
await p.getByText(/^Draft \(\d+\)/).first().click();await p.waitForTimeout(3000);
L.log('draft tab: '+await p.evaluate(()=>(document.body.innerText.match(/Draft \(\d+\)/)||[''])[0]));
await p.screenshot({path:L.EV+'/d3a.png'});process.exit(0)})().catch(e=>{L.log('ERR '+e.message.split('\n')[0]);process.exit(1)})
