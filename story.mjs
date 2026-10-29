// Original interactive microfiction: seven reachable endings.
export const chapters = {
 origin:{world:"Observatory",title:"A signal from tomorrow",text:"At 03:17, a message arrives in your own voice: By sunrise, the city will forget the moon. The message includes coordinates for a door that should not exist.",choices:[["Follow the coordinates","door"],["Broadcast the warning","broadcast"]]},
 door:{world:"World A",title:"A doorway in the rain",text:"Behind a closed laundromat, a circle hangs in the air. Beyond it: the same street, but every window faces inward.",choices:[["Step through the circle","mirror"],["Photograph it first","photo"]]},
 broadcast:{world:"World B",title:"Everybody hears you",text:"The warning plays on every radio at once. A stranger calls: I sent that message. Do not trust your future self.",choices:[["Meet the stranger","stranger"],["Trace the broadcast","tower"]]},
 mirror:{world:"World A1",title:"The other you",text:"You enter a place built from memories you never lived. Another you offers to trade one memory for a map.",choices:[["Trade the memory","archive"],["Refuse the bargain","echo"]]},
 photo:{world:"World A2",title:"The impossible image",text:"The camera reveals a second moon inside the doorway. When you look up, the real moon is already gone.",choices:[["Develop the image","negative"],["Enter before it closes","echo"]]},
 stranger:{world:"World B1",title:"A conversation outside time",text:"The stranger wears a watch with thirteen hands. We do not travel between universes, they say. We remember the one we choose.",choices:[["Ask for proof","proof"],["Steal the watch","loop"]]},
 tower:{world:"World B2",title:"The silent transmitter",text:"An abandoned tower points its antenna into the earth. A heartbeat echoes through the stairs.",choices:[["Descend into the tower","engine"],["Cut the transmission","quiet"]]},
 archive:{world:"Ending · Memory",title:"The museum of almost",text:"You gain the map, but lose the face of someone you love. Every possible life is displayed behind glass. You are the curator of paths not taken.",ending:"The Archivist"},
 echo:{world:"Ending · Paradox",title:"One step away",text:"The wormhole closes with you on both sides of it. Somewhere, another you is certain they made the opposite choice.",ending:"The Echo"},
 negative:{world:"Ending · Light",title:"What the film remembers",text:"In the darkroom the photograph becomes a window. You restore the moon, but not in the universe you started in.",ending:"The Cartographer"},
 proof:{world:"Ending · Knowledge",title:"Proof in the margins",text:"The stranger unfolds tomorrow's newspaper. Its headline is your name. You decide to write a different ending.",ending:"The Revision"},
 loop:{world:"Ending · Time",title:"Thirteen hands",text:"Every clock stops except the stolen watch. You wake at 03:17 with a new sentence waiting: Try again.",ending:"The Loop"},
 engine:{world:"Ending · Connection",title:"The machine beneath",text:"You unplug the engine of tangled possible histories. The city remembers the moon. You remember every version.",ending:"The Keeper"},
 quiet:{world:"Ending · Silence",title:"The beautiful silence",text:"The signal dies. At sunrise everyone forgets the moon. You spend your life painting it on every wall.",ending:"The Witness"}
};
export function checkStory(data=chapters){
 const errors=[];if(!data.origin)errors.push("Missing origin");
 for(const [id,c] of Object.entries(data)){if(!c.title||!c.text)errors.push(id+": incomplete");if(!c.ending&&c.choices?.length!==2)errors.push(id+": expected two choices");
 for(const [,to] of c.choices||[])if(!data[to])errors.push(id+": missing "+to);}
 return errors;
}
export function tracePath(path,data=chapters){
 if(!Array.isArray(path)||path[0]!=="origin")return ["origin"];
 const result=["origin"];
 for(const id of path.slice(1)){if(!data[result.at(-1)]?.choices?.some(([,target])=>target===id))break;result.push(id);}
 return result;
}
