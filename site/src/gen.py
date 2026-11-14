import re, sys
import os
B=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brand') + '/'
def svg(path, cls='', label=None):
    s=open(B+path).read()
    s=re.sub(r'<metadata>.*?</metadata>','',s,flags=re.S)
    s=re.sub(r'<title>.*?</title>','',s,flags=re.S)
    s=s.replace(' xmlns:c2pa="http://c2pa.org/manifest"','')
    s=re.sub(r'^<svg[^>]*>',lambda m: re.sub(r'\s(width|height)="\d+"','',m.group(0)),s.strip())
    attrs=f' class="{cls}"' if cls else ''
    attrs+= f' role="img" aria-label="{label}"' if label else ' aria-hidden="true" focusable="false"'
    return s.replace('<svg ','<svg'+attrs+' ',1).strip()
# clipPath ids must be unique; none of the used ones have ids except j (skipped)
ICONS=[('icon/a-cracked-c.svg','Cracked C'),('logo/crackheads-logo.svg','Cracked head'),('icon/f-terminal.svg','Terminal'),
 ('icon/k-cracked-star.svg','Cracked star'),('icon/c-ch-monogram.svg','CH monogram'),('icon/g-cracked-chip.svg','Cracked chip'),
 ('icon/i-cracked-smiley.svg','Cracked smiley'),('icon/d-bolt-badge.svg','Bolt badge'),('icon/l-keycap.svg','Keycap'),
 ('icon/m-cracked-crown.svg','Cracked crown'),('icon/n-pixel-c.svg','Pixel C')]
n=len(ICONS)
ring=''.join(f'<div class="card" style="--i:{i}">{svg(p)}</div>' for i,(p,l) in enumerate(ICONS))
TECH=['Claude','ChatGPT','Cursor','GitHub','Figma','Discord']
SEP=['icon/k-cracked-star.svg','icon/d-bolt-badge.svg','icon/a-cracked-c.svg','icon/n-pixel-c.svg','icon/g-cracked-chip.svg','logo/crackheads-logo.svg']
def run():
    return ''.join(f'<span class="tech">{t}</span>{svg(SEP[i],"sep")}' for i,t in enumerate(TECH))
marquee=f'<div class="mq-track"><div class="mq-run">{run()}</div><div class="mq-run" aria-hidden="true">{run()}</div></div>'
mark=open(B+'logo/crackheads-mark-black.svg').read()
P=re.search(r'<path d="([^"]+)"',mark).group(1)
head=lambda c: f'<svg class="{c}" viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="{P}"/></svg>'
banner=svg('banner/crackheads-banner.svg','banner','Crackheads.ai, Get cracked.')
crack='<svg class="crack" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12 14 6 22 14 36 4 48 13 60 7 72 15 84 5 100 11"/></svg>'
DISCORD='https://discord.gg/fGbmwPsM93'
FAV="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='96'/%3E%3Ccircle cx='256' cy='282' r='200' fill='%23fff'/%3E%3Cpath d='M190 50 252 184 182 222 262 390 330 218 270 184 322 50Z'/%3E%3C/svg%3E"
def letters(word, start):
    return ''.join(f'<span class="ch" style="--d:{start+i}">{c}</span>' for i,c in enumerate(word))
NEWS=[('icon/f-terminal.svg','Edge0','Nov 12, 2026','An open 145B agent model built to run on your laptop','Big open weights you can run locally. Worth a build-night test drive if you have the GPU for it.'),
      ('icon/g-cracked-chip.svg','Retell','Nov 13, 2026','Tell-1, a voice model for live contact-center calls','Voice agents keep getting cheaper. Ops and support folks, this one is for you.'),
      ('icon/d-bolt-badge.svg','Meta','Nov 12, 2026','Muse can now place outbound calls to businesses for paid US subscribers','Agents that pick up the phone for you are here. Time to think about what that does to your funnel.')]
NEWS_URL='https://explainx.ai/catch-up-on-ai/2026-11-13'
news=''.join(f'''<article class="news-card">
  <div class="news-top">{svg(ic,"news-ic")}<div class="news-meta"><span>{src}</span><span>{d}</span></div></div>
  <h3>{h}</h3>
  <p>{take}</p>
  <a class="news-link" href="{NEWS_URL}" target="_blank" rel="noopener">Read the story<span aria-hidden="true"> ↗</span></a>
</article>''' for ic,src,d,h,take in NEWS)
RULES=[('icon/m-cracked-crown.svg','Know a lot? Invest in the group.','If you know a lot, it’s your job to help the people around you level up.'),
       ('icon/l-keycap.svg','New to this? Come ready to learn.','If you don’t know anything yet, it’s your job to show up curious and ask.'),
       ('icon/i-cracked-smiley.svg','Keep it fun.','Real work, no suits. If you’re dressing up for this, it’s probably not your event.')]
rules=''.join(f'<li>{svg(ic,"rule-ic")}<div><b>{t}</b><span>{d}</span></div></li>' for ic,t,d in RULES)

FL=[('icon/a-cracked-c.svg','4%','62%','8vw','-12deg',.6,''),
 ('icon/f-terminal.svg','40%','5%','6vw','14deg',.5,'hide-sm'),
 ('icon/c-ch-monogram.svg','66%','14%','7.5vw','9deg',.8,'hide-sm'),
 ('icon/d-bolt-badge.svg','86%','34%','10vw','-8deg',1.2,''),
 ('icon/i-cracked-smiley.svg','30%','48%','6vw','-16deg',1,''),
 ('icon/m-cracked-crown.svg','72%','48%','6.5vw','12deg',.9,'hide-sm'),
 ('icon/g-cracked-chip.svg','88%','70%','7vw','14deg',.7,''),
 ('icon/k-cracked-star.svg','56%','66%','5vw','22deg',1.1,'hide-sm'),
 ('icon/l-keycap.svg','18%','80%','5vw','-8deg',.8,'hide-sm'),
 ('icon/n-pixel-c.svg','46%','86%','4.5vw','10deg',.6,'hide-sm')]
floats=''.join(f'<div class="float {c}" style="--x:{x};--y:{y};--s:{sz};--r:{r};--k:{k};--i:{i}" aria-hidden="true"><div class="bob">{svg(p)}</div></div>' for i,(p,x,y,sz,r,k,c) in enumerate(FL))
CL='0,0 253,0 271,150 223,197 271,249 248,295 252,352 256,512 0,512'
CR='253,0 512,0 512,512 256,512 252,352 248,295 271,249 223,197 271,150'
split=f'<svg viewBox="0 0 512 512" focusable="false"><defs><clipPath id="hl"><polygon points="{CL}"/></clipPath><clipPath id="hr"><polygon points="{CR}"/></clipPath></defs><g class="half l"><path clip-path="url(#hl)" d="{P}"/></g><g class="half r"><path clip-path="url(#hr)" d="{P}"/></g></svg>'
tpl=open(sys.argv[1]).read()
out=(tpl.replace('{{RING}}',ring).replace('{{N}}',str(n)).replace('{{MARQUEE}}',marquee).replace('{{BANNER}}',banner)
 .replace('{{NEWS}}',news).replace('{{RULES}}',rules).replace('{{DISCORD}}',DISCORD).replace('{{FAV}}',FAV)
 .replace('{{CRACK}}',crack).replace('{{H_GET}}',letters('Get',0)).replace('{{H_CRACKED}}',letters('cracked',3))
 .replace('{{HEAD_LOGO}}',head('mark')).replace('{{HEAD_DOT}}',head('dot')).replace('{{HEAD_GHOST}}',head('ghost-mark')).replace('{{FLOATS}}',floats).replace('{{HEAD_SPLIT}}',split).replace('{{HEAD_BIG}}',head('big')).replace('{{ICON_ROW}}',''.join(svg(x) for x in ['logo/crackheads-logo.svg','icon/a-cracked-c.svg','icon/f-terminal.svg','icon/g-cracked-chip.svg','icon/k-cracked-star.svg','icon/m-cracked-crown.svg'])))
assert '{{' not in out, re.findall(r'\{\{\w+\}\}',out)
open(sys.argv[2],'w').write(out)
print(len(out))
