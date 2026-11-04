const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step5 PENDING Files > card > doc > select multiple');
await p.getByText('Files & Documents',{exact:true}).first().click();await p.waitForTimeout(4000);
await p.mouse.click(795,590);await p.waitForTimeout(3500);
await p.mouse.click(385,400);await p.waitForTimeout(4000);
await p.getByText('Select multiple').first().click().catch(e=>L.log('nosel '+e.message.slice(0,60)));await p.waitForTimeout(1500);
await p.screenshot({path:L.EV+'/08-files.png'});L.log('O1 step5 DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
