const L=require('./lib');
(async()=>{const {p}=await L.conn();
L.log('O1 step2 PENDING create ext contact FRZ-Ext-1104 Probe');
await p.getByText('Add external contact').first().click();await p.waitForTimeout(2000);
await p.fill('#name','FRZ-Ext-1104 Probe');
await p.fill('#positions_input','Electrician').catch(()=>{});await p.keyboard.press('Enter');
await p.fill('#externalcontact_email','frz1104@example.com');
await p.screenshot({path:L.EV+'/05-form.png'});
L.log('O1 step2 form filled');process.exit(0)})().catch(e=>{console.log('ERR',e.message);process.exit(1)});
