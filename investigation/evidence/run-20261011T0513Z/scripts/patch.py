s=open('m1.js').read()
old="  await step('toggle-share-link-email'"
new="""  await step('attach-files-step2',async()=>{ await p.getByRole('button',{name:'Add file from project'}).click({timeout:6000}); await sleep(2000);
     await p.mouse.click(698,552); await sleep(1800); await p.mouse.click(696,200); await sleep(2500);
     for(const [x,y] of [[602,176],[861,176],[1120,176],[602,393]]){ await p.mouse.click(x,y); await sleep(250);}
     await p.screenshot({path:EV+'/m1-pick-c'+c+'.png'});
     await p.getByRole('button',{name:/^Attach \\d+ file/}).click({timeout:5000}); await sleep(2500); return 'attached'; },60000);
  await probe('c'+c+'-attached');
"""
s=s.replace(old,new+old,1)
s=s.replace("await p.keyboard.press('Escape'); await sleep(500); return t; });","await p.getByText('Send at a scheduled time').click({timeout:3000}); await sleep(1500); await p.screenshot({path:EV+'/m1-sched-c'+c+'.png'}); await p.keyboard.press('Escape'); await sleep(600); return t; });")
open('m1.js','w').write(s)
