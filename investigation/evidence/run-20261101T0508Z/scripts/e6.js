const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('PENDING Confirm dialog');
await p.getByRole('button',{name:'Confirm'}).click();await p.waitForTimeout(5000);
await p.screenshot({path:L.EV+'/09-after-confirm.png'});
L.log('COMPLETED confirm; has new contact in DOM: '+await p.evaluate(()=>document.body.innerText.includes('FRZ-Ext-1101')));
process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
