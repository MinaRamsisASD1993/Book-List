//Init variables
const form = document.getElementById("task-form");
const newTaskInput = document.querySelector("#task");
const filterTaskInput = document.getElementById("filter");
const ulList = document.querySelector("ul.collection");
const clearTasksButton = document.querySelector(".clear-tasks");


//form EventListener
form.addEventListener('submit', formEventListener);

function formEventListener(e) {
    newTaskInputValue = newTaskInput.value;
    //Create an li element from scratch
    if (newTaskInputValue !== "") {
        let li = document.createElement("li");
        li.classList = "collection-item";
        li.innerHTML = `${newTaskInputValue}<a href="#" class="delete-item secondary-content"><i class="fa fa-remove"></i></a>`;
        ulList.appendChild(li);

        //LOCAL STORAGE STUFF
        storeTaskInLocalStorage(newTaskInputValue);
    }
    e.preventDefault();
}

function storeTaskInLocalStorage(newTaskInputValue) {
    let tasks;
    //Nothing in the local storage
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } //If there is an array in the Local Storage 
    else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(newTaskInputValue);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//once the document is loaded bring the local storage data
document.addEventListener('DOMContentLoaded', getTasks);

function getTasks() {
    let tasks;
    //Nothing in the local storage
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } //If there is an array in the Local Storage 
    else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    for (let i = 0; i < tasks.length; i++) {
        let li = document.createElement("li");
        li.classList = "collection-item";
        li.innerHTML = `${tasks[i]}<a href="#" class="delete-item secondary-content"><i class="fa fa-remove"></i></a>`;
        ulList.appendChild(li);
    }
}

//ul collection event listener.. as a parent for listening 
//to one of children (EVENT DELEGATION) .. ""if it's the target""

document.addEventListener('click', deleteListItem);

function deleteListItem(e) {
    if (e.target.parentElement.classList.contains('delete-item')) {

        if (confirm("Are You Sure?")) {
            e.target.parentElement.parentElement.remove();
            //Remove from LS
            removeFromLS(e.target.parentElement.parentElement.textContent);
        }

    }

}

function removeFromLS(target) {
    let tasks;
    //Nothing in the local storage
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } //If there is an array in the Local Storage 
    else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i] === target) {
            tasks.splice(i, 1); //Remove this element from array
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//ClearTasks EventLisetner

clearTasksButton.addEventListener('click', clearTasks);

function clearTasks(e) {
    ulList.innerHTML = '';
    clearLS();
}

function clearLS() {
    localStorage.clear();
}

//filterTaskInput EventListener
filterTaskInput.addEventListener('keyup', filterTask);

function filterTask(e) {
    let filterInput = e.target.value.toLowerCase();
    const listItem = document.querySelectorAll("li");
    for (let i = 0; i < listItem.length; i++) {
        if (listItem[i].textContent.toLowerCase().includes(filterInput)) {
            listItem[i].style.display = 'block';
        } else {
            listItem[i].style.display = 'none';
        }
    }

    e.preventDefault();
}
