const {conn,log,EV,sleep,probe}=require('./lib.js');
(async()=>{const {p}=await conn();
 await p.getByText(/^Draft \(/).first().click(); await sleep(3000); await p.screenshot({path:EV+'/d3-drafts.png'});
 const row=p.getByText('G1 test').first(); log({a:'reopen draft',pending:true,rows:await row.count()});
 await row.click(); await sleep(5000); await probe(p,'draft reopened'); await p.screenshot({path:EV+'/d4-reopened.png'});
 const ed=p.locator('.mantine-RichTextEditor-content .tiptap').first(); log({editors:await ed.count()});
 await ed.click(); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('Dear Andreas,',{delay:40}); await p.keyboard.press('Enter'); await p.keyboard.press('Enter');
 await probe(p,'draft reopened + Enter x3'); await p.screenshot({path:EV+'/d5-after.png'}); log({a:'reopen draft',done:true}); process.exit(0);})().catch(e=>{log({fatal:e.message.slice(0,300)});process.exit(1)});
