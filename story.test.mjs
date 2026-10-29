import test from "node:test";
import assert from "node:assert/strict";
import {chapters,checkStory,tracePath} from "./story.mjs";
test("every branch points to a valid chapter",()=>assert.deepEqual(checkStory(),[]));
test("all seven endings are reachable",()=>{const visited=new Set(),queue=["origin"];while(queue.length){const id=queue.shift();if(visited.has(id))continue;visited.add(id);queue.push(...(chapters[id].choices||[]).map(c=>c[1]));}assert.equal(Object.values(chapters).filter(c=>c.ending).length,7);assert.equal(visited.size,Object.keys(chapters).length);});
test("saved paths cannot jump between realities",()=>{assert.deepEqual(tracePath(["origin","door","mirror"]),["origin","door","mirror"]);assert.deepEqual(tracePath(["origin","tower"]),["origin"]);assert.deepEqual(tracePath(["bad"]),["origin"]);});
