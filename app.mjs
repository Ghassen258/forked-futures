import { chapters, tracePath, checkStory } from "./story.mjs";
import { availableForks, compareTimelines } from "./compare.mjs";
if(checkStory().length)throw Error("Invalid story graph");
const $=id=>document.getElementById(id),NS="http://www.w3.org/2000/svg",KEY="forked-futures-v1";
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));return {path:tracePath(s.path),endings:Array.isArray(s.endings)?s.endings.filter(id=>chapters[id]?.ending):[]};}catch{return {path:["origin"],endings:[]};}}
let state=load();
const levels=[["origin"],["door","broadcast"],["mirror","photo","stranger","tower"],["archive","echo","negative","proof","loop","engine","quiet"]];
const positions=new Map();levels.forEach((layer,x)=>layer.forEach((id,i)=>positions.set(id,{x:28+x*104,y:25+((i+.5)*320/layer.length)})));
function svgEl(tag,attributes={}){const e=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attributes))e.setAttribute(key,String(value));return e;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function jump(id){state.path=state.path.slice(0,state.path.indexOf(id)+1);render();}
function draw(){
 const root=$("map"),svg=svgEl("svg",{viewBox:"0 0 380 380",role:"img","aria-label":"Branching timeline map"});root.replaceChildren();
 const route=new Set(state.path.slice(1).map((id,i)=>state.path[i]+":"+id));
 for(const [id,c] of Object.entries(chapters)){const a=positions.get(id);for(const [,to] of c.choices||[]){const b=positions.get(to);svg.append(svgEl("path",{d:`M${a.x} ${a.y} C${a.x+48} ${a.y} ${b.x-48} ${b.y} ${b.x} ${b.y}`,class:route.has(id+":"+to)?"active":""}));}}
 for(const [id,p] of positions){const visited=state.path.includes(id),current=state.path.at(-1)===id;
 const g=svgEl("g",{class:(current?"current ":visited?"visited ":"")+(visited?"interactive":"")});
 if(visited){g.setAttribute("tabindex","0");g.setAttribute("role","button");g.setAttribute("aria-label","Return to "+chapters[id].title);g.addEventListener("click",()=>jump(id));g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();jump(id);}});}
 g.append(svgEl("circle",{cx:p.x,cy:p.y,r:current?9:6}));const t=svgEl("text",{x:p.x,y:p.y+19,"text-anchor":"middle"});t.textContent=id==="origin"?"START":id.slice(0,5).toUpperCase();g.append(t);svg.append(g);}
 root.append(svg);
}
function choose(index){const next=chapters[state.path.at(-1)].choices?.[index]?.[1];if(next){state.path.push(next);render();}}
function render(){const id=state.path.at(-1),c=chapters[id];if(c.ending&&!state.endings.includes(id))state.endings.push(id);
 $("world").textContent=c.world.toUpperCase();$("step").textContent=String(state.path.length).padStart(2,"0");$("title").textContent=c.title;$("text").textContent=c.text;
 const choices=$("choices");choices.replaceChildren();
 if(c.ending){const notice=document.createElement("div");notice.className="ending";notice.textContent="✦ ENDING DISCOVERED: "+c.ending;choices.append(notice);}
 else c.choices.forEach(([label],i)=>{const b=document.createElement("button");b.className="choice";b.type="button";const number=document.createElement("b"),caption=document.createElement("span"),arrow=document.createElement("span");number.textContent="0"+(i+1);caption.textContent=label;arrow.textContent="↗";b.append(number,caption,arrow);b.addEventListener("click",()=>choose(i));choices.append(b);});
 $("back").disabled=state.path.length===1;$("realities").textContent=String(state.path.length).padStart(2,"0");$("endings").textContent=String(new Set(state.endings).size).padStart(2,"0")+"/07";draw();save();
}
$("back").addEventListener("click",()=>{if(state.path.length>1){state.path.pop();render();}});
$("restart").addEventListener("click",()=>{state.path=["origin"];render();});
document.addEventListener("keydown",e=>{if($("compare-dialog").open||e.altKey||e.ctrlKey||e.metaKey||["INPUT","TEXTAREA","BUTTON"].includes(document.activeElement?.tagName))return;if(e.key==="1"||e.key==="2")choose(Number(e.key)-1);if(e.key==="Backspace"){$("back").click();e.preventDefault();}});

const dialog=$("compare-dialog");
let forkIndex;
function showRoute(id,path,changedAt,playedLength,primary){
 const list=$(id);list.replaceChildren();
 path.forEach((node,i)=>{
  const li=document.createElement("li");if(i>=changedAt)li.classList.add("different");
  const title=document.createElement("strong");title.textContent=chapters[node].title;
  const description=document.createElement("small");
  const parent=i?chapters[path[i-1]]:null;
  description.textContent=i===0?"The beginning":parent?.choices?.find(([,next])=>next===node)?.[0]??"Ending";
  if(primary&&i>=playedLength)description.textContent+=" · projected";
  li.append(title,description);list.append(li);
 });
}
function renderComparison(){
 const forks=availableForks(state.path);
 if(!forks.some(f=>f.index===forkIndex))forkIndex=forks.at(-1).index;
 const select=$("fork-point");select.replaceChildren();
 forks.forEach(f=>{const option=document.createElement("option");option.value=String(f.index);option.textContent="Choice "+(f.index+1)+" · "+f.title;select.append(option);});
 select.value=String(forkIndex);
 const result=compareTimelines(state.path,forkIndex);
 const a=chapters[result.primary.path.at(-1)],b=chapters[result.alternate.path.at(-1)];
 $("compare-summary").textContent=result.isPreview?"Preview the two first possible futures.":"You chose “"+result.originalChoice+"”. What if you chose “"+result.alternateChoice+"”?";
 $("primary-status").textContent=result.primary.projected?"YOUR TIMELINE · PROJECTED":"YOUR TIMELINE · REACHED";
 $("primary-ending").textContent=a.ending;$("alternate-ending").textContent=b.ending;
 $("primary-description").textContent=a.text;$("alternate-description").textContent=b.text;
 showRoute("primary-route",result.primary.path,result.forkIndex+1,state.path.length,true);
 showRoute("alternate-route",result.alternate.path,result.forkIndex+1,state.path.length,false);
 $("compare-insight").textContent=result.sameEnding?"PARADOX · "+result.changedScenes+" scenes change, but both paths share the same ending.":"BUTTERFLY EFFECT · "+result.changedScenes+" scenes differ. One decision changes the ending from “"+result.primary.ending+"” to “"+result.alternate.ending+"”.";
}
$("compare").addEventListener("click",()=>{forkIndex=undefined;renderComparison();dialog.showModal();});
$("compare-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
$("fork-point").addEventListener("change",e=>{forkIndex=Number(e.target.value);renderComparison();});

render();
