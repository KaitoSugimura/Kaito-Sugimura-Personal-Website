// Verify day-1: is there ALWAYS at least one affordable item (any), and how often
// is there NO profitable wanted flip on day 1 specifically?
import { readFileSync } from 'fs';
// reuse formulas inline (compact)
const RARITY={common:{greed:0,jit:.1},uncommon:{greed:.05,jit:.14},rare:{greed:.1,jit:.18},legendary:{greed:.16,jit:.22}};
const ITEMS=[["health-potion","Potion",28,"common"],["mana-elixir","Potion",44,"common"],["luck-tonic","Potion",95,"rare"],["silver-ring","Trinket",60,"common"],["jade-pendant","Trinket",115,"uncommon"],["pocket-watch","Trinket",150,"uncommon"],["sapphire-amulet","Trinket",205,"rare"],["iron-dagger","Tool",48,"common"],["hand-axe","Tool",54,"common"],["brass-compass","Tool",120,"uncommon"],["spell-scroll","Scroll",85,"uncommon"],["old-tome","Scroll",135,"uncommon"],["treasure-map","Scroll",165,"rare"],["ruby","Gem",230,"rare"],["sapphire","Gem",215,"rare"],["ancient-coin","Relic",90,"uncommon"],["crystal-skull","Curio",320,"legendary"],["music-box","Curio",175,"rare"],["honey-jar","Food",24,"common"],["cheese-wheel","Food",30,"common"],["gold-bangle","Trinket",130,"uncommon"],["carved-mask","Curio",150,"rare"],["fire-opal","Gem",250,"legendary"]].map(([id,category,base,rarity])=>({id,category,base,rarity}));
const CATEGORIES=[...new Set(ITEMS.map(i=>i.category))];
const round=Math.round,clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function makeRng(seed){let a=seed>>>0;const next=()=>{a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};return{next,int:n=>Math.floor(next()*n),range:(lo,hi)=>lo+next()*(hi-lo),pick:arr=>arr[Math.floor(next()*arr.length)],get state(){return a>>>0}}}
function shuffled(arr,rng){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=rng.int(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function gen(seed){
  let rngState=(seed>>>0)||1;const rng=makeRng(rngState);const day=1;
  let wantCount=clamp(2+rng.int(2),2,3);
  const cheap=["Potion","Food","Tool","Trinket"].filter(c=>CATEGORIES.includes(c));
  let wantCats=[rng.pick(cheap)];
  for(const c of shuffled(CATEGORIES,rng)){if(wantCats.length>=wantCount)break;if(!wantCats.includes(c))wantCats.push(c)}
  const wants=wantCats.map(category=>({category,bonus:round((rng.range(.55,.9))*100)/100}));
  const shelfCount=clamp(5+rng.int(3),5,7);
  const wantedPool=ITEMS.filter(i=>wantCats.includes(i.category));
  const otherPool=ITEMS.filter(i=>!wantCats.includes(i.category));
  const nWanted=Math.min(wantedPool.length,Math.max(2,Math.round(shelfCount*.6)));
  const chosen=[...shuffled(wantedPool,rng).slice(0,nWanted),...shuffled(otherPool,rng).slice(0,shelfCount-nWanted)];
  let uid=1;
  const shelf=shuffled(chosen,rng).map(it=>{const r=RARITY[it.rarity];const value=round(it.base*(1+rng.range(-r.jit,r.jit)));let ask=value*(1.3+r.greed);let floor=value*(1.06+r.greed*.3);floor=Math.max(floor,value*1.03);ask=Math.max(ask,floor+Math.max(2,value*.06));return{id:it.id,category:it.category,value,ask:round(ask),floor:round(floor)}});
  return{wants,shelf};
}
let noAffordableAny=0,noWantedFlip=0,noWantedAffordable=0;
const G=140;
for(let i=0;i<5000;i++){
  const{wants,shelf}=gen(i+1);
  const wantCats=wants.map(w=>w.category);
  const affordableAny=shelf.some(s=>s.floor<=G);
  if(!affordableAny)noAffordableAny++;
  const wantedFlips=shelf.filter(s=>wantCats.includes(s.category)).map(s=>{const w=wants.find(w=>w.category===s.category);return{floor:s.floor,ceil:round(s.value*(1+w.bonus)),aff:s.floor<=G}});
  const profitableAffordable=wantedFlips.filter(f=>f.aff&&f.ceil-f.floor>0);
  if(profitableAffordable.length===0)noWantedFlip++;
  if(wantedFlips.filter(f=>f.aff).length===0)noWantedAffordable++;
}
console.log(`Day 1 over 5000 seeds:`);
console.log(`  runs with NO affordable item at all (floor>140 for every shelf item): ${noAffordableAny} (${(noAffordableAny/5000*100).toFixed(2)}%)`);
console.log(`  runs with NO affordable+profitable WANTED flip: ${noWantedFlip} (${(noWantedFlip/5000*100).toFixed(2)}%)`);
console.log(`  runs with NO affordable wanted item: ${noWantedAffordable} (${(noWantedAffordable/5000*100).toFixed(2)}%)`);
console.log(`  (rent day1 = 45; start gold 140)`);
