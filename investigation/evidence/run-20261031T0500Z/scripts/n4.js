const {conn,log,EV}=require('./lib');
(async()=>{const {b,p}=await conn();p.setDefaultTimeout(8000);
const cnt=async()=>await p.getByText(/^Recipients \(\d+\)/).first().innerText();
await p.mouse.click(400,215);await p.waitForTimeout(1500);   // Select all
log('after select all: '+await cnt());
await p.getByText(/^Recipients \(\d+\)/).first().click();await p.waitForTimeout(800);
await p.getByText('Add new e-mail address').first().click();await p.waitForTimeout(800);
const inp=p.getByPlaceholder(/Enter new email/i).first();
await inp.click();await inp.fill('qa.ext.'+Date.now()+'@mailinator.com');
await p.getByRole('button',{name:'Add',exact:true}).first().click();await p.waitForTimeout(1000);
log('after external: '+await cnt());
await p.screenshot({path:EV+'/n4.png'});
process.exit(0);})().catch(e=>{console.log('ERR',e.message.slice(0,300));process.exit(1)});
