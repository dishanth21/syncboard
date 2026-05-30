import { useEffect, useState } from "react";
import api from "../services/api";

import {
DragDropContext,
Droppable,
Draggable
} from "@hello-pangea/dnd";

import {
connectSocket,
disconnectSocket
} from "../services/socket";

function Dashboard() {

const [boards,setBoards]=useState([]);
const [columns,setColumns]=useState([]);

const [selectedBoard,setSelectedBoard]=
useState("");

const [search,setSearch]=
useState("");

const [connected,setConnected]=
useState(false);

const [boardName,setBoardName]=
useState("");

const [columnName,setColumnName]=
useState("");

const [taskTitle,setTaskTitle]=
useState("");

const [taskDesc,setTaskDesc]=
useState("");

const [priority,setPriority]=
useState("HIGH");

const [taskColumn,setTaskColumn]=
useState("");

const [editingTask,setEditingTask]=
useState(null);

useEffect(()=>{

loadBoards();

connectSocket(()=>{

setConnected(true);

loadColumns();

});

return ()=>{

disconnectSocket();

};

},[]);

async function loadBoards(){

const response =
await api.get("/boards");

setBoards(response.data);

if(response.data.length>0){

setSelectedBoard(
response.data[0].id
);

loadColumns();

}

}

async function loadColumns(){

const response =
await api.get("/columns");

setColumns(response.data);

if(response.data.length>0){

setTaskColumn(
response.data[0].id
);

}

}

async function createBoard(){

await api.post(

"/boards",

{

name:boardName,

description:"Created From UI"

}

);

setBoardName("");

loadBoards();

}

async function createColumn(){

await api.post(

"/columns",

{

name:columnName,

board:{
id:Number(selectedBoard)
}

}

);

setColumnName("");

loadColumns();

}

async function createTask(){

await api.post(

"/tasks",

{

title:taskTitle,

description:taskDesc,

priority,

column:{
id:Number(taskColumn)
}

}

);

setTaskTitle("");
setTaskDesc("");

loadColumns();

}

async function deleteTask(id){

try{

await api.delete(
`/tasks/${id}`
);

loadColumns();

}catch{

alert(
"Delete Failed"
);

}

}

async function onDragEnd(result){

if(!result.destination){

return;

}

await api.put(

`/tasks/${result.draggableId}/move/${result.destination.droppableId}`

);

loadColumns();

}

function logout(){

localStorage.clear();

window.location="/";

}

const totalTasks =

columns.reduce(

(sum,col)=>

sum+

(col.tasks?.length||0),

0

);

return(

<div style={{

display:"flex",

background:"#0f172a",

color:"white",

minHeight:"100vh"

}}>

<div style={{

width:"320px",

padding:"20px",

background:"#111827"

}}>

<h1>

SyncBoard

</h1>

<p>

Realtime:

{

connected ?

" 🟢 Connected"

:

" 🔴 Offline"

}

</p>

<input

placeholder="Search Task"

value={search}

onChange={(e)=>

setSearch(
e.target.value
)

}

style={styleInput}

/>

<h3>

Analytics

</h3>

<Card
title="Boards"
value={boards.length}
/>

<Card
title="Tasks"
value={totalTasks}
/>

<hr/>

<input
placeholder="Board Name"
value={boardName}
onChange={(e)=>
setBoardName(
e.target.value
)}
style={styleInput}
/>

<button
onClick={createBoard}
style={styleBtn}
>

Create Board

</button>

<select
value={selectedBoard}
onChange={(e)=>
setSelectedBoard(
e.target.value
)}
style={styleInput}
>

{

boards.map(

(board)=>(

<option
key={board.id}
value={board.id}
>

{board.name}

</option>

)

)

}

</select>

<input
placeholder="Column Name"
value={columnName}
onChange={(e)=>
setColumnName(
e.target.value
)}
style={styleInput}
/>

<button
onClick={createColumn}
style={styleBtn}
>

Create Column

</button>

<hr/>

<input
placeholder="Task Title"
value={taskTitle}
onChange={(e)=>
setTaskTitle(
e.target.value
)}
style={styleInput}
/>

<textarea
placeholder="Description"
value={taskDesc}
onChange={(e)=>
setTaskDesc(
e.target.value
)}
style={styleInput}
/>

<select
value={priority}
onChange={(e)=>
setPriority(
e.target.value
)}
style={styleInput}
>

<option>HIGH</option>
<option>MEDIUM</option>
<option>LOW</option>

</select>

<select
value={taskColumn}
onChange={(e)=>
setTaskColumn(
e.target.value
)}
style={styleInput}
>

{

columns.map(

(col)=>(

<option
key={col.id}
value={col.id}
>

{col.name}

</option>

)

)

}

</select>

<button
onClick={createTask}
style={styleBtn}
>

Create Task

</button>

<button
onClick={logout}
style={logoutBtn}
>

Logout

</button>

</div>

<div style={{

flex:1,

padding:"25px",

overflowX:"auto"

}}>

<DragDropContext
onDragEnd={onDragEnd}
>

<div style={{

display:"flex",

gap:"20px"

}}>

{

columns.map(

(column)=>(

<Droppable

key={column.id}

droppableId={
String(column.id)
}

>

{

(provided)=>(

<div

ref={
provided.innerRef
}

{...provided.droppableProps}

style={{

background:"#1e293b",

padding:"20px",

width:"320px",

borderRadius:"15px",

minHeight:"500px"

}}

>

<h2>

{column.name}

</h2>

{

column.tasks

?.filter(

(task)=>

task.title

.toLowerCase()

.includes(

search

.toLowerCase()

)

)

.map(

(task,index)=>(

<Draggable

key={task.id}

draggableId={
String(task.id)
}

index={index}

>

{

(provided)=>(

<div

ref={
provided.innerRef
}

{...provided.draggableProps}

{...provided.dragHandleProps}

style={{

background:"#334155",

padding:"15px",

marginTop:"15px",

borderRadius:"12px",

...provided
.draggableProps
.style

}}

>

<h4>

{task.title}

</h4>

<p>

{task.description}

</p>

<small>

{task.priority}

</small>

<br/>

<button

onClick={()=>{

setEditingTask(
task
);

}}

style={smallBtn}

>

Edit

</button>

<button

onClick={()=>

deleteTask(
task.id
)

}

style={deleteBtn}

>

Delete

</button>

</div>

)

}

</Draggable>

)

)

}

{provided.placeholder}

</div>

)

}

</Droppable>

)

)

}

</div>

</DragDropContext>

</div>

</div>

);

}

function Card({title,value}){

return(

<div style={{

background:"#1e293b",

padding:"15px",

marginBottom:"10px",

borderRadius:"10px"

}}>

<h4>

{title}

</h4>

<h2>

{value}

</h2>

</div>

);

}

const styleInput={
width:"100%",
padding:"12px",
marginBottom:"12px",
borderRadius:"8px"
};

const styleBtn={
width:"100%",
padding:"12px",
background:"#2563eb",
border:"none",
color:"white",
borderRadius:"8px",
marginBottom:"10px"
};

const logoutBtn={
...styleBtn,
background:"#dc2626"
};

const smallBtn={
marginTop:"10px",
marginRight:"8px"
};

const deleteBtn={
background:"red",
color:"white"
};

export default Dashboard;