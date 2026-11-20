import base64, html, json, subprocess
from pathlib import Path
from PIL import Image, ImageFont
ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'data.json').read_text(encoding='utf-8'))
ASSET=ROOT/'template-assets'
OUT=ROOT/'png'; OUT.mkdir(exist_ok=True)
WEBP=ROOT.parents[1]/'assets/cf/revisao-guiada/m13'; WEBP.mkdir(parents=True,exist_ok=True)
REG='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'; BOLD='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
logo=base64.b64encode((ASSET/'logo.png').read_bytes()).decode(); mascot=base64.b64encode((ASSET/'mascote.png').read_bytes()).decode()
NAVY='#073d78'; BLUE='#07508a'; YELLOW='#ffd442'
# Four different, chapter-specific pictograms per art. Each symbol is a hand-authored vector, not a repeated decorative sticker.
GLYPHS={
'people':'<circle cx="40" cy="34" r="10"/><circle cx="70" cy="34" r="10"/><path d="M20 78c2-16 10-24 20-24s18 8 20 24M50 78c2-16 10-24 20-24s18 8 20 24"/>',
'dashboard':'<rect x="18" y="20" width="64" height="62" rx="8"/><path d="M32 64V50m18 14V38m18 26V29M30 31h12"/>',
'clipboard':'<rect x="27" y="20" width="47" height="65" rx="5"/><path d="M39 20v-6h23v6M36 41h28M36 52h28M36 63h15m7 10 7 7 13-16"/>',
'no-appeal':'<path d="M50 16 18 31h64L50 16zM24 38h52M27 42v29m15-29v29m16-29v29m15-29v29M20 76h60"/><path d="m29 23 43 54" stroke="#ffd442" stroke-width="7"/>',
'court':'<path d="M50 17 15 32h70L50 17zM22 39h56M25 42v31m16-31v31m18-31v31m16-31v31M19 77h62M14 85h72"/>',
'age':'<circle cx="50" cy="50" r="35"/><path d="M50 27v25l17 11M21 24l-8-8m66 8 8-8"/>',
'senate':'<path d="M50 16 16 32h68L50 16zM22 39h56M27 42v29m16-29v29m16-29v29m16-29v29M20 76h60"/><path d="M37 84h26"/>',
'federal-law':'<path d="M20 25c14-7 25-5 30 2 5-7 16-9 30-2v51c-14-7-25-5-30 2-5-7-16-9-30-2zM50 27v51M28 38h14m-14 9h14m16-9h14m-14 9h14"/>',
'treaty':'<path d="M22 18h56v65H22zM32 34h36M32 46h36M32 58h23"/><path d="m57 71 8 8 16-20"/>',
'government-act':'<path d="M50 16 16 31h68L50 16zM23 39h54M27 42v30m16-30v30m16-30v30m16-30v30M19 77h62"/><path d="m70 18 12 10"/>',
'split-courts':'<circle cx="50" cy="20" r="9"/><circle cx="25" cy="75" r="9"/><circle cx="75" cy="75" r="9"/><path d="M50 29v17m0 0H25v20m25-20h25v20"/>',
'appeal-trap':'<path d="M17 50h65m-11-11 11 11-11 11M83 70H18m11-11L18 70l11 11"/><path d="M26 18 74 82"/>',
'magnifier':'<circle cx="43" cy="42" r="24"/><path d="m61 60 21 22M32 42h22m-11-11v22"/>',
'two-thirds':'<text x="50" y="63" text-anchor="middle" font-size="34" font-weight="700" fill="#fff" stroke="none">2/3</text>',
'presumed':'<path d="m50 15 10 22 24 3-18 16 5 24-21-12-21 12 5-24-18-16 24-3z"/>',
'calendar-law':'<rect x="18" y="24" width="64" height="58" rx="6"/><path d="M31 16v17m38-17v17M19 42h62M32 57h14m8 0h12m-34 12h14"/>',
'work-court':'<path d="M50 18 18 33h64L50 18zM24 40h52M27 43v28m15-28v28m16-28v28m15-28v28M20 76h60"/><path d="M35 29v-7h30v7"/>',
'27':'<text x="50" y="64" text-anchor="middle" font-size="37" font-weight="700" fill="#fff" stroke="none">27</text>',
'regional-court':'<path d="M50 17 16 32h68L50 17zM22 39h56M25 42v30m16-30v30m18-30v30m16-30v30M19 77h62"/><path d="M40 85h20"/>',
'number-trap':'<circle cx="50" cy="50" r="34"/><text x="50" y="63" text-anchor="middle" font-size="40" font-weight="700" fill="#fff" stroke="none">#</text>',
'contract':'<path d="M25 33h50v48H25zM38 33v-9h24v9M36 50h28m-28 11h28m-28 11h18"/>',
'strike':'<path d="M37 79V48c0-5 7-5 7 0V34c0-6 8-6 8 0v13V28c0-6 8-6 8 0v19V34c0-6 8-6 8 0v17l4-8c3-5 10-1 7 4L66 75c-2 4-6 7-12 7H46c-4 0-9-1-9-3z"/>',
'compensation':'<path d="M50 16v55m-20 14h40M50 18 20 34m30-16 30 16M19 36 8 60h23L19 36zm62 0L70 60h23L81 36z"/><path d="M8 63c3 9 19 9 23 0m39 0c4 9 20 9 23 0"/>',
'statute-trap':'<path d="M50 16 87 81H13z"/><path d="M50 38v21m0 11v1" stroke="#fff" stroke-width="7"/>',
'council':'<circle cx="50" cy="28" r="11"/><circle cx="27" cy="39" r="8"/><circle cx="73" cy="39" r="8"/><path d="M28 79c0-17 8-27 22-27s22 10 22 27M12 76c0-13 5-21 15-23m66 23c0-13-5-21-15-23"/>',
'budget':'<path d="M18 79h64M25 69h12V50H25zm21 0h12V33H46zm21 0h12V20H67z"/><path d="m21 38 20-12 15 5 23-20"/>',
'court-levels':'<rect x="19" y="18" width="62" height="22" rx="4"/><rect x="26" y="57" width="48" height="22" rx="4"/><path d="M50 40v17m-6-6 6 6 6-6"/>',
'admin-not-appeal':'<path d="M50 18 20 31v23c0 18 13 28 30 36 17-8 30-18 30-36V31z"/><path d="M36 50h28M50 36v28"/>',
'federal-map':'<path d="m22 23 20-7 18 9 17-5 7 21-10 18 4 22-18 2-12-16-16 5-12-17 4-17z"/><circle cx="60" cy="51" r="5" fill="#ffd442" stroke="none"/>',
'seven':'<circle cx="50" cy="50" r="34"/><text x="50" y="64" text-anchor="middle" font-size="40" font-weight="700" fill="#fff" stroke="none">7</text>',
'court-hierarchy':'<path d="M50 18 18 32h64L50 18zM24 39h52M27 42v28m15-28v28m16-28v28m15-28v28M20 75h60"/><path d="M40 85h20"/>',
'regional-appeal':'<path d="M18 25h63v47H18zM31 41h36M31 53h23"/><path d="M53 83h22m-8-9 9 9-9 9"/>',
'federal-entity':'<path d="M18 29h64v48H18zM29 45h12v16H29zm21 0h12v16H50zm17 0h7v16h-7zM12 84h76"/>',
'exceptions':'<path d="M50 16 86 81H14z"/><path d="M50 37v21m0 11v1" stroke="#fff" stroke-width="7"/>',
'inss-trap':'<path d="M50 16 87 81H13z"/><text x="50" y="65" text-anchor="middle" font-size="32" font-weight="700" fill="#fff" stroke="none">!</text>',
'state-map':'<path d="m19 24 18-7 15 8 17-6 13 12-7 15 7 16-15 17-16-8-13 5-16-17 4-14z"/><circle cx="51" cy="49" r="5" fill="#ffd442" stroke="none"/>',
'capital':'<path d="M50 16 18 32h64L50 16zM24 39h52M27 42v30m15-30v30m16-30v30m15-30v30M20 77h60"/><circle cx="50" cy="26" r="3" fill="#ffd442" stroke="none"/>',
'federal-venue':'<path d="M25 18h50v65H25zM36 34h28M36 46h28M36 58h18"/><path d="m57 72 7 7 13-16"/>',
'brazil-location':'<path d="m50 16 8 8 12 1 4 11 11 6-3 12 6 10-8 8-4 12-13 1-9 9-10-6-12 2-8-10-12-4-1-12-8-9 6-12-1-11 10-6 6-11 13 3z"/><circle cx="59" cy="48" r="5" fill="#ffd442" stroke="none"/>',
'state-court':'<path d="M50 17 16 32h68L50 17zM22 39h56M25 42v31m16-31v31m18-31v31m16-31v31M19 78h62"/>',
'constitution':'<path d="M20 22h60v62H20zM31 38h38M31 50h38M31 62h27"/><path d="m58 70 7 7 13-17"/>',
'state-review':'<circle cx="42" cy="42" r="23"/><path d="m58 59 24 24M32 42h20m-10-10v20"/>',
'single-actor-trap':'<circle cx="50" cy="50" r="34"/><path d="M50 16v68M16 50h68"/>',
'military-court':'<path d="M50 17 16 32h68L50 17zM22 39h56M25 42v30m16-30v30m18-30v30m16-30v30M19 77h62"/><path d="m50 39 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffd442" stroke="none"/>',
'jury':'<path d="M50 16 86 81H14z"/><path d="M31 65h38M37 64l5-17m10 17-5-17m14 17-5-17"/>',
'agrarian-court':'<path d="M15 72h70M20 70l13-20 12 12 13-27 19 35"/><path d="M28 31h49M36 24l-8 7 8 7m33-14 8 7-8 7"/>',
'military-trap':'<path d="M50 16 87 81H13z"/><path d="M50 38v20m0 12v1" stroke="#fff" stroke-width="7"/>'}
GLYPHS['federal-court']=GLYPHS['court']
GLYPHS.update({
'workers':'<circle cx="35" cy="30" r="9"/><circle cx="66" cy="30" r="9"/><path d="M17 77c2-17 8-27 18-27s16 10 18 27m-5 0c2-17 8-27 18-27s16 10 18 27"/>',
'handshake':'<path d="m15 43 17-17 17 7 11-6 16 17-14 15-14-8-9 9-13-10-10 8-11-15z"/><path d="m40 51 14 12m-22-4 10 9m-18-8 8 8"/>',
'justice-scales':'<path d="M50 17v63m-23 5h46M50 23 21 39m29-16 29 16M20 40 8 63h24L20 40zm60 0L68 63h24L80 40z"/><path d="M8 66c3 7 21 7 24 0m36 0c3 7 21 7 24 0"/>',
'market-track':'<path d="M16 30h53a15 15 0 0 1 0 30H35a15 15 0 0 0 0 30h53"/><path d="m62 19 12 11-12 11m-1 8 12 11-12 11"/>',
'consumer-cart':'<path d="M15 24h11l8 42h40l11-31H29"/><circle cx="42" cy="79" r="5"/><circle cx="68" cy="79" r="5"/><path d="M44 45h19m-9-9v18"/>',
'leaf':'<path d="M80 19C43 18 21 29 20 54c-1 18 17 28 33 19 16-9 23-30 27-54z"/><path d="M20 82c11-24 28-38 52-54"/>',
'growth-chart':'<path d="M16 81h70M24 70h12V52H24zm23 0h12V37H47zm23 0h12V22H70z"/><path d="m22 42 20-15 14 7 24-22m-12 0h12v12"/>',
'employment':'<rect x="18" y="35" width="64" height="47" rx="5"/><path d="M36 35v-9h28v9M18 52h64M44 51v9h12v-9"/><circle cx="72" cy="22" r="10"/>',
'store':'<path d="M20 42h60v41H20zM15 42l8-24h58l8 24"/><path d="M15 42c0 10 15 10 15 0 0 10 15 10 15 0 0 10 15 10 15 0 0 10 15 10 15 0M31 83V59h17v24"/>',
'paper-check':'<path d="M24 17h54v67H24zM35 33h32M35 47h32"/><path d="m37 65 8 8 18-20"/>',
'factory':'<path d="M14 82V46l22 13V43l22 16V28h27v54zM64 38h11m-11 11h11M24 69h10m10 0h10"/><path d="M65 28V17h11v11"/>',
'state-shield':'<path d="M50 13 82 25v24c0 19-12 31-32 42-20-11-32-23-32-42V25z"/><path d="m34 51 11 11 22-24"/>',
'monopoly':'<circle cx="50" cy="50" r="32"/><path d="M50 32v36m-18-18h36"/><path d="m26 26 48 48" stroke="#ffd442" stroke-width="7"/>',
'enterprise-gov':'<path d="M17 30h34v29H17zm37 18h29v29H54z"/><path d="M34 59v17m34-28V34m-7 7 7-7 7 7M11 83h77"/>',
'tax-scales':'<path d="M50 17v65m-25-6h50M50 21 19 39m31-18 31 18M18 40 8 61h21L18 40zm64 0L72 61h21L82 40z"/><path d="m36 51 8 8 16-18"/>',
'regulator':'<circle cx="50" cy="50" r="14"/><path d="M50 14v14m0 44v14M14 50h14m44 0h14M25 25l10 10m30 30 10 10m0-50L65 35M35 65 25 75"/><path d="m44 50 5 5 11-13"/>',
'plan-chart':'<rect x="18" y="20" width="64" height="62" rx="6"/><path d="M30 66V53m16 13V42m16 24V31M29 31h13m-5-6 5 6-5 6"/>',
'compass':'<circle cx="50" cy="50" r="35"/><path d="m63 36-8 19-19 9 8-19zM50 15v8m0 54v8m35-35h-8M23 50h-8"/>',
'co-op':'<circle cx="50" cy="50" r="34"/><circle cx="50" cy="31" r="7"/><circle cx="31" cy="60" r="7"/><circle cx="69" cy="60" r="7"/><path d="M46 38 36 53m22-15 10 15m-29 7h22"/>',
'mine':'<path d="M13 78h74M19 70l17-28 14 17 16-37 20 48"/><path d="m44 22 6-8 6 8m-6-7v22"/>',
'oil-drop':'<path d="M50 14s-25 28-25 46a25 25 0 0 0 50 0C75 42 50 14 50 14z"/><path d="M39 62c1 7 6 11 12 12"/>',
'tourism':'<path d="M16 52 50 22l34 30M25 47v35h50V47M43 82V59h15v23"/><circle cx="76" cy="22" r="9"/><path d="M76 10V6m12 16h5M65 14l-4-4"/>',
'foreign-doc':'<path d="M23 17h48l9 10v57H23zM71 17v12h9M34 41h34M34 53h34M34 65h21"/><path d="m58 75 7 6 13-16"/>',
'permit':'<path d="M20 18h60v66H20zM32 34h36M32 47h36"/><path d="m34 66 8 8 19-22"/>',
'property-home':'<path d="M14 49 50 18l36 31M23 43v39h54V43M44 82V57h13v25"/><path d="M33 43h34"/>',
'property-check':'<path d="M50 14 18 42v41h64V42z"/><path d="m34 60 10 10 22-26"/>',
'anti-cartel':'<circle cx="50" cy="50" r="34"/><path d="M32 50h36M50 32v36"/><path d="m27 27 46 46" stroke="#ffd442" stroke-width="7"/>',
'city-hall':'<path d="M50 17 15 33h70L50 17zM22 40h56M26 43v30m16-30v30m16-30v30m16-30v30M18 78h64"/><path d="M43 24h14"/>',
})
GLYPHS.update({
'unlimited-trap':'<path d="M50 14 88 82H12z"/><path d="M50 37v22m0 11v1" stroke="#fff" stroke-width="7"/>',
'owner-limit':'<path d="M50 15 86 81H14z"/><path d="m35 51 10 10 20-23" stroke="#fff" stroke-width="5"/>',
'eco-products':'<path d="M80 18C43 18 21 29 20 54c-1 18 17 28 33 19 16-9 23-30 27-55z"/><path d="M20 82c11-24 28-38 52-54"/>',
'job-creation-limit':'<path d="M50 14 88 82H12z"/><path d="M50 37v22m0 11v1" stroke="#fff" stroke-width="7"/>',
'business-open':'<path d="M20 42h60v41H20zM15 42l8-24h58l8 24"/><path d="M15 42c0 10 15 10 15 0 0 10 15 10 15 0 0 10 15 10 15 0 0 10 15 10 15 0M53 83V58h18v25"/>',
'company-charter':'<path d="M23 17h52v67H23zM34 33h30M34 46h30"/><path d="m35 64 8 8 19-21"/>',
'private-rules':'<path d="M22 23h41l15 16v45H22zM63 23v16h15M34 53h34"/><path d="m37 68 7 7 15-17"/>',
'exclusive-tax-trap':'<path d="M50 17v65m-25-6h50M50 21 19 39m31-18 31 18M18 40 8 61h21L18 40zm64 0L72 61h21L82 40z"/><path d="m34 31 32 34m0-34L34 65" stroke="#ffd442" stroke-width="6"/>',
'planning-switch':'<rect x="17" y="25" width="25" height="48" rx="6"/><rect x="58" y="25" width="25" height="48" rx="6"/><path d="M42 49h16m-7-7 7 7-7 7"/><circle cx="30" cy="39" r="5" fill="#ffd442"/><circle cx="70" cy="59" r="5" fill="#ffd442"/>',
'cooperative-law':'<path d="M21 20h58v64H21zM33 35h34M33 48h34"/><path d="m34 66 8 8 19-22"/>',
'service-contract':'<path d="M23 18h44l11 12v54H23zM67 18v14h11M34 49h34"/><path d="m38 65 8 8 17-20"/>',
'user-rights':'<circle cx="39" cy="33" r="10"/><path d="M18 78c2-15 9-24 21-24s19 9 21 24"/><path d="m62 55 15 6v12c0 8-6 13-15 17-9-4-15-9-15-17V61z"/><path d="m56 71 5 5 10-12"/>',
'delegation-limit':'<rect x="14" y="27" width="28" height="46" rx="4"/><path d="M22 40h12m-12 12h12"/><path d="M45 50h35m-11-11 11 11-11 11"/>',
'land-owner-trap':'<path d="m15 42 35-20 35 20-35 20zM15 58l35 20 35-20"/><path d="m29 27 42 48" stroke="#ffd442" stroke-width="7"/>',
'house-key':'<path d="M14 49 50 18l36 31M23 43v39h54V43M44 82V57h13v25"/><circle cx="69" cy="27" r="9"/><path d="m76 34 10 10m-6-5-5 5"/>',
'scales-work':'<path d="M50 17v63m-23 5h46M50 23 21 39m29-16 29 16M20 40 8 63h24L20 40zm60 0L68 63h24L80 40z"/><path d="M8 66c3 7 21 7 24 0m36 0c3 7 21 7 24 0"/>',
'market-balance':'<path d="M50 17v65m-25-6h50M50 21 19 39m31-18 31 18M18 40 8 61h21L18 40zm64 0L72 61h21L82 40z"/>',
'race-track':'<path d="M16 30h53a15 15 0 0 1 0 30H35a15 15 0 0 0 0 30h53"/><path d="m62 19 12 11-12 11m-1 8 12 11-12 11"/>',
'shopping-shield':'<path d="M15 24h11l8 42h40l11-31H29"/><circle cx="42" cy="79" r="5"/><circle cx="68" cy="79" r="5"/><path d="m45 46 7 7 13-15"/>',
'leaf-industry':'<path d="M18 78V43h18v35m7 0V27h18v51m7 0V50h15v28M12 83h76"/><path d="M26 31c1-14 14-21 29-18-1 14-12 23-29 18z"/>',
'regional-growth':'<path d="M16 81h70M24 70h12V52H24zm23 0h12V37H47zm23 0h12V22H70z"/><path d="m22 42 20-15 14 7 24-22"/>',
'small-store':'<path d="M20 42h60v41H20zM15 42l8-24h58l8 24"/><path d="M15 42c0 10 15 10 15 0 0 10 15 10 15 0 0 10 15 10 15 0 0 10 15 10 15 0M31 83V59h17v24"/>',
'simplified-form':'<rect x="20" y="16" width="60" height="68" rx="6"/><path d="M32 34h36M32 48h36M32 62h14m8 9 7 7 13-16"/>',
'state-factory':'<path d="M14 82V46l22 13V43l22 16V28h27v54zM64 38h11m-11 11h11"/>',
'state-enterprise':'<path d="M50 16 18 31h64L50 16zM22 38h56M26 42v31m16-31v31m16-31v31m16-31v31M18 78h64"/>',
'anti-monopoly':'<circle cx="50" cy="50" r="32"/><path d="M50 32v36m-18-18h36"/><path d="m26 26 48 48" stroke="#ffd442" stroke-width="7"/>',
'company-charter':'<path d="M23 17h52v67H23zM34 33h30M34 46h30"/><path d="m35 64 8 8 19-21"/>',
'private-rules':'<path d="M22 23h41l15 16v45H22zM63 23v16h15M34 53h34"/><path d="m37 68 7 7 15-17"/>',
'exclusive-tax-trap':'<path d="M50 17v65m-25-6h50M50 21 19 39m31-18 31 18M18 40 8 61h21L18 40zm64 0L72 61h21L82 40z"/><path d="m34 31 32 34m0-34L34 65" stroke="#ffd442" stroke-width="6"/>',
'regulator-tools':'<circle cx="50" cy="50" r="14"/><path d="M50 14v14m0 44v14M14 50h14m44 0h14M25 25l10 10m30 30 10 10m0-50L65 35M35 65 25 75"/>',
'public-plan':'<rect x="18" y="20" width="64" height="62" rx="6"/><path d="M30 66V53m16 13V42m16 24V31"/>',
'private-compass':'<circle cx="50" cy="50" r="35"/><path d="m63 36-8 19-19 9 8-19zM50 15v8m0 54v8"/>',
'planning-switch':'<rect x="17" y="25" width="25" height="48" rx="6"/><rect x="58" y="25" width="25" height="48" rx="6"/><path d="M42 49h16m-7-7 7 7-7 7"/>',
'cooperative-circle':'<circle cx="50" cy="50" r="34"/><circle cx="50" cy="31" r="7"/><circle cx="31" cy="60" r="7"/><circle cx="69" cy="60" r="7"/><path d="M46 38 36 53m22-15 10 15"/>',
'cooperative-law':'<path d="M21 20h58v64H21zM33 35h34M33 48h34"/><path d="m34 66 8 8 19-22"/>',
'miners-coop':'<path d="M13 78h74M19 70l17-28 14 17 16-37 20 48"/><path d="m44 22 6-8 6 8m-6-7v22"/>',
'license-still-needed':'<path d="M20 18h60v66H20zM32 34h36"/><path d="m34 66 8 8 19-22"/>',
'public-service':'<path d="M50 17 15 33h70L50 17zM22 40h56M26 43v30m16-30v30m16-30v30m16-30v30M18 78h64"/>',
'service-contract':'<path d="M23 18h44l11 12v54H23zM67 18v14h11M34 49h34"/><path d="m38 65 8 8 17-20"/>',
'user-rights':'<circle cx="39" cy="33" r="10"/><path d="M18 78c2-15 9-24 21-24s19 9 21 24"/><path d="m62 55 15 6v12c0 8-6 13-15 17-9-4-15-9-15-17V61z"/>',
'delegation-limit':'<rect x="14" y="27" width="28" height="46" rx="4"/><path d="M22 40h12m-12 12h12"/><path d="M45 50h35m-11-11 11 11-11 11"/>',
'underground-layers':'<path d="m13 37 37-20 37 20-37 20zM13 54l37 20 37-20M13 69l37 20 37-20"/>',
'union-resources':'<path d="M50 13 82 25v24c0 19-12 31-32 42-20-11-32-23-32-42V25z"/><path d="M35 51h30m-24-9h18"/>',
'mining-permit':'<path d="M20 18h60v66H20zM29 69l14-28 10 18 8-12 13 22"/><path d="m57 25 6 6 12-14"/>',
'land-owner-trap':'<path d="m15 42 35-20 35 20-35 20zM15 58l35 20 35-20"/><path d="m29 27 42 48" stroke="#ffd442" stroke-width="7"/>',
'union-monopoly':'<path d="M50 13 82 25v24c0 19-12 31-32 42-20-11-32-23-32-42V25z"/><circle cx="50" cy="48" r="12"/><path d="M50 41v14m-7-7h14"/>',
'private-contract':'<path d="M23 18h44l11 12v54H23zM67 18v14h11M34 49h34"/><path d="m38 65 8 8 17-20"/>',
'small-business-tourism':'<path d="M16 52 50 22l34 30M25 47v35h50V47M43 82V59h15v23"/><circle cx="76" cy="22" r="9"/>',
'foreign-request-trap':'<path d="M23 17h48l9 10v57H23zM71 17v12h9M34 41h34M34 53h34"/><path d="m28 28 44 44" stroke="#ffd442" stroke-width="7"/>'
})

ICON_ALIASES={
 'national-shield':'state-shield','open-hand':'federal-law','business-or-regulator':'enterprise-gov',
 'price-cartel':'anti-cartel','tax-parity':'tax-scales',
 'house-key':'property-home','scales-work':'justice-scales','market-balance':'justice-scales',
 'race-track':'market-track','shopping-shield':'consumer-cart','leaf-industry':'leaf','regional-growth':'growth-chart',
 'small-store':'store','simplified-form':'paper-check','permit-check':'permit','state-factory':'factory',
 'state-enterprise':'city-hall','anti-monopoly':'monopoly','company-charter':'paper-check','private-rules':'contract',
 'regulator-tools':'regulator','public-plan':'plan-chart','private-compass':'compass','cooperative-circle':'co-op',
 'miners-coop':'mine','license-still-needed':'permit','public-service':'city-hall','service-contract':'contract',
 'user-rights':'people','underground-layers':'mine','union-resources':'state-shield','mining-permit':'permit',
 'union-monopoly':'monopoly','private-contract':'contract','small-business-tourism':'tourism'
}
for alias,target in ICON_ALIASES.items(): GLYPHS[alias]=GLYPHS[target]

def esc(s): return html.escape(str(s),quote=True)
def wrap(value,font,width):
 lines=[]; cur=''
 for word in str(value).split():
  nxt=(cur+' '+word).strip()
  if cur and font.getlength(nxt)>width: lines.append(cur); cur=word
  else: cur=nxt
 if cur: lines.append(cur)
 return lines
def text(value,x,y,size,bold=False,color='#111419',width=None,line=1.16,anchor='start',max_lines=None):
 font=ImageFont.truetype(BOLD if bold else REG,size); lines=wrap(value,font,width) if width else [str(value)]
 if max_lines and len(lines)>max_lines: raise ValueError(f'{len(lines)} lines exceed {max_lines}: {value}')
 spans=''.join(f'<tspan x="{x}" dy="{0 if i==0 else size*line:.1f}">{esc(v)}</tspan>' for i,v in enumerate(lines))
 return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Liberation Sans,Arial,sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{spans}</text>'
def fit(value,width,start,minimum=22,bold=True):
 face=BOLD if bold else REG
 for size in range(start,minimum-1,-1):
  if ImageFont.truetype(face,size).getlength(value)<=width:return size
 return minimum
def icon(code,x,y):
 if code not in GLYPHS: raise ValueError(f'Unknown semantic icon {code}')
 return f'<g transform="translate({x} {y})" aria-label="{esc(code)}"><title>{esc(code)}</title><circle cx="55" cy="55" r="53" fill="{NAVY}"/><g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">{GLYPHS[code]}</g></g>'
def build(item):
 s=['''<svg xmlns="http://www.w3.org/2000/svg" width="1229" height="1536" viewBox="0 0 1229 1536">
<defs><linearGradient id="navy" x1="0" x2="1"><stop stop-color="#005399"/><stop offset=".6" stop-color="#073d78"/><stop offset="1" stop-color="#00569d"/></linearGradient><linearGradient id="cyan" x1="0" x2="1"><stop stop-color="#0bc9df"/><stop offset="1" stop-color="#00b8d7"/></linearGradient><linearGradient id="pale" x1="0" x2="1"><stop stop-color="#c2e7fb"/><stop offset="1" stop-color="#c8edff"/></linearGradient><linearGradient id="center" x1="0" x2="1"><stop stop-color="#d0edfa"/><stop offset="1" stop-color="#92d4f0"/></linearGradient><linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f4fcff"/></linearGradient><linearGradient id="tip" x1="0" x2="1"><stop stop-color="#e5f9ff"/><stop offset="1" stop-color="#c6efff"/></linearGradient></defs><rect width="1229" height="1536" fill="#fff"/>''']
 s.append(f'<image x="160" y="0" width="910" height="172" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{logo}"/>')
 s.append(f'<image x="0" y="228" width="355" height="580" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{mascot}"/>')
 s.append('<rect x="261" y="176" width="836" height="105" rx="52" fill="#07508a"/>')
 s.append(text('Constituição Federal',679,247,66,True,'#fff',780,1.06,'middle'))
 s.append('<rect x="447" y="266" width="449" height="80" rx="40" fill="url(#cyan)"/>')
 s.append(text(f'Capítulo {item["chapter"]}',671.5,322,51,True,'#041d3a',420,1.04,'middle'))
 s.append('<rect x="341" y="352" width="845" height="70" rx="35" fill="url(#pale)"/>')
 size=fit(item['title'],805,36,22)
 s.append(text(item['title'],763.5,397,size,True,'#081a32',805,1.03,'middle',2))
 s.append('<rect x="380" y="475" width="676" height="262" rx="34" fill="#fff" stroke="#0b477f" stroke-width="4"/><rect x="489" y="435" width="454" height="68" rx="34" fill="url(#center)"/>')
 s.append('<g transform="translate(540 445)" fill="none" stroke="#063c78" stroke-width="4" stroke-linejoin="round"><path d="M4 8c11-5 19-4 26 1v34c-7-5-15-6-26-1zM56 8c-11-5-19-4-26 1v34c7-5 15-6 26-1z"/><path d="M11 15h12M11 22h12M37 15h12M37 22h12" stroke-width="3" stroke-linecap="round"/></g>')
 s.append(text('Ponto central',742,482,42,True,'#062b5c',275,1.04,'middle'))
 s.append(text(item['central'],416,550,31,False,'#090d14',604,1.16,'start',5))
 s.append('<rect x="616" y="728" width="5" height="71" rx="3" fill="#0b477f"/>')
 spots=[(28,805),(623,805),(28,1048),(623,1048)]
 for idx,((heading,body),(x,y),code) in enumerate(zip(item['cards'],spots,item['icons'])):
  s.append(f'<rect x="{x}" y="{y}" width="578" height="220" rx="29" fill="url(#card)" stroke="#19afe0" stroke-width="3"/><path d="M{x+168} {y+20}v180" stroke="#1eb6e2" stroke-width="4"/>')
  s.append(icon(code,x+28,y+45)); tx=x+183; tw=375
  hs=fit(heading,tw-14,29,20); hw=min(tw,ImageFont.truetype(BOLD,hs).getlength(heading)+26)
  s.append(f'<rect x="{tx}" y="{y+18}" width="{hw:.1f}" height="{hs+9}" rx="20" fill="{YELLOW}"/>')
  s.append(text(heading,tx+13,y+18+hs+1,hs,True,'#12110e',tw-16,1.03,'start',1))
  s.append(text(body,tx,y+18+hs+33,22,False,'#111419',tw,1.13,'start',5))
 s.append('<rect x="19" y="1308" width="1191" height="211" rx="48" fill="url(#tip)"/><path d="M19 1356a48 48 0 0 1 48-48h314v211H67a48 48 0 0 1-48-48z" fill="url(#navy)"/><g transform="translate(68 1379)" fill="none" stroke="#ffd829" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4a19 19 0 0 0-11 34c3 3 5 7 5 11h20c0-4 2-8 5-11A19 19 0 0 0 17 4z"/><path d="M12 54h20M15 61h14M17 14v12M17 33v1" stroke="#fff" stroke-width="4"/></g>')
 s.append(text('Dica de',247,1406,41,True,'#fff',170,1.03,'middle')); s.append(text('Prova',247,1454,41,True,'#fff',170,1.03,'middle'))
 s.append('<path d="M381 1331v165" stroke="#073f76" stroke-width="4"/>')
 for i,tip in enumerate(item['tips']):
  y=1371+i*70; s.append(text('✓',417,y,36,True,'#07508a',34,1.05)); s.append(text(tip,465,y-2,27,True,'#111820',708,1.13,'start',2))
 s.append(text('BASE COMPLETA · REVISÃO GUIADA · CF M13',1200,1520,12,False,'#527089',500,1.08,'end')); s.append('</svg>')
 return ''.join(s)
for item in DATA['chapters']:
 stem=f'CF-M13-C{item["chapter"]:02d}'; svg=ROOT/(stem+'.svg'); svg.write_text(build(item),encoding='utf-8')
 png=OUT/(stem+'.png'); run=subprocess.run(['inkscape',str(svg),'--export-filename='+str(png),'--export-width=1229','--export-height=1536'],capture_output=True,text=True); svg.unlink(missing_ok=True)
 if run.returncode: raise RuntimeError(run.stderr or run.stdout)
 with Image.open(png) as im:
  if im.size!=(1229,1536): raise RuntimeError(f'Wrong dimensions: {stem} {im.size}')
  im.convert('RGB').save(png,format='PNG',optimize=True)
  im.convert('RGB').save(WEBP/(stem+'.webp'),format='WEBP',quality=88,method=6)
print(f'Rendered {len(DATA["chapters"])} PNG and WebP arts.')
