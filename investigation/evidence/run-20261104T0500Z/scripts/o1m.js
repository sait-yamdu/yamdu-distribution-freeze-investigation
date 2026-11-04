const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step12 PENDING Confirm delete (Remove from project and store in company database)');
await p.mouse.click(1036,348);await p.waitForTimeout(5000);await p.screenshot({path:L.EV+'/16-deleted.png'});
L.log('O1 step12 DONE');
// reopen draft from Distribution > Draft
L.log('O1 step13 PENDING Distribution>Draft>open FRZ O1 draft');
await p.mouse.click(96,378);await p.waitForTimeout(4000);
await p.getByText('Draft (',{exact:false}).first().click();await p.waitForTimeout(3000);
await p.screenshot({path:L.EV+'/17-drafts.png'});
L.log('O1 step13 DONE url '+p.url());process.exit(0)})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
