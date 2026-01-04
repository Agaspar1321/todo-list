const clearButton = document.getElementById("clearButton");
const submitButton = document.getElementById("submitButton");
const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const displayBox = document.getElementById("displayBox");

function saveTasks(){
    const tasks = [];

    document.querySelectorAll("#displayBox li span").forEach(span => {
        const text = span.textContent.trim();
        if (text !== ""){
             tasks.push(text);
        }});
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(task => {createTaskElement(task);});
}

function createTaskElement(taskText){
    const newListItem = document.createElement("li");

    const textSpan = document.createElement("span");
    textSpan.textContent = taskText;
    newListItem.appendChild(textSpan);

    //Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
        newListItem.remove(); 
        saveTasks();});
        newListItem.appendChild(deleteButton);

    //Move icon
    const moveIcon = document.createElement("span");
    moveIcon.innerHTML = `
<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5L12 19" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 17L12 20L15 17" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 7L12 4L9 7" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12L19 12" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 15L20 12L17 9" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 9L4 12L7 15" stroke="#ffededff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    moveIcon.classList.add("move-Icon");
    newListItem.appendChild(moveIcon);

    //Drag logic
    newListItem.setAttribute("draggable", "true");
    newListItem.addEventListener("dragstart", dragStart);
    newListItem.addEventListener("dragover", dragover);
    newListItem.addEventListener("dragend", dragEnd);

    displayBox.appendChild(newListItem);
}

function submit(event) {        
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if(taskText !== ""){
        createTaskElement(taskText);
        saveTasks();
    }
    //clear input box
    taskInput.value = "";
}


function dragStart(event){
    draggingItem = event.target;
    event.target.classList.add("dragging");
}

function dragover(event){
    event.preventDefault();

    const targetItem = event.target.closest("li");

    if (targetItem && targetItem !== draggingItem){
        const boundingRect = targetItem.getBoundingClientRect();
        const offset = event.clientY - boundingRect.top;

        if (offset > boundingRect.height / 2){
            displayBox.insertBefore(draggingItem, targetItem.nextSibling);
        }else{
            displayBox.insertBefore(draggingItem, targetItem);
        }
    }
}

function dragEnd(event){
    event.target.classList.remove("dragging");
    draggingItem = null;
    saveTasks();
}

function clear(event) {
    displayBox.textContent = "";
    localStorage.removeItem("tasks");
}

//Add task to page
taskForm.addEventListener("submit", submit);
//Clear tasks from page
clearButton.addEventListener("click", clear)

loadTasks();