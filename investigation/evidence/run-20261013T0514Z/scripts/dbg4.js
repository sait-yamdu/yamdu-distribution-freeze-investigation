const {conn,EV,sleep}=require('./lib.js');(async()=>{const {p}=await conn();
 await p.locator('a:visible',{hasText:'Distribution'}).first().click(); await sleep(2500);
 await p.getByText(/^Draft/).first().click(); await sleep(2500); await p.locator('tr:has-text("M1 explore")').first().click(); await sleep(3500);
 await p.getByRole('button',{name:/^Check recipients/}).click(); await sleep(2500);
 await p.evaluate(()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/^\s*Next\s*$/.test(b.innerText||'')).sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); bs[0].click();}); await sleep(3000);
 await p.mouse.click(1299,716); await sleep(900); await p.getByText('Send at a scheduled time').click(); await sleep(1200);
 console.log(await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='Choose when this distribution should be sent.'); let d=h; for(let i=0;i<8&&d;i++){d=d.parentElement; if(d&&d.querySelectorAll('input').length) break;} return JSON.stringify(d?{cls:d.className.slice(0,60),role:d.getAttribute('role'),inputs:[...d.querySelectorAll('input')].map(i=>[i.type,i.value,i.readOnly,i.className.slice(0,50)])}:null);}));
 process.exit(0)})()
