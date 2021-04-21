const toggleTheme = document.querySelector('#toggle');
toggleTheme.addEventListener('change', switchTheme, false);

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }    
}
let form = document.querySelector('.task-input')
let taskInput = document.getElementById('task-new')

let tasksUl = document.querySelector('.task-list')
let taskTotal = document.getElementById('task-total')
let allBtn = document.getElementById('all')
let activeBtn = document.getElementById('active')
let completedBtn = document.getElementById('completed')
let clearTasksBtn = document.getElementById('task-clear')
let tasks = JSON.parse(localStorage.getItem('tasks'))

allBtn.classList.add('active')
allBtn.addEventListener('click', () =>{taskOption('all')})
activeBtn.addEventListener('click', () =>{taskOption('active')})
completedBtn.addEventListener('click', () =>{taskOption('completed')})
clearTasksBtn.addEventListener('click', clearCompleted)

if (tasks) {
    tasks.forEach(task => addTask(task))
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    addTask()
})

function addTask(task) {
    let taskText = taskInput.value
    completed = false;

    if (task) {
        taskText = task.text
        if (task.completed == true) {
            completed = true;
        }
    }

    if (taskText) {
        let taskNewEl = document.createElement('li')
        taskNewEl.classList.add('task')
        taskNewEl.setAttribute('draggable', true)
        let taskIcon = document.createElement('span')
        let taskInnerText = document.createElement('span')
        let taskDelBtn = document.createElement('span')
        taskIcon.classList.add('task-icon')
        taskInnerText.classList.add('task-text')
        taskDelBtn.classList.add('task-remove')
        taskInnerText.innerText = taskText
        taskNewEl.appendChild(taskIcon)
        taskNewEl.appendChild(taskInnerText)
        taskNewEl.appendChild(taskDelBtn)
        if (completed == true) {
            taskNewEl.classList.add('complete')
        }

        tasksUl.appendChild(taskNewEl)

        taskIcon.addEventListener('click', finishTask)
        taskDelBtn.addEventListener('click', deleteTask)
    }
    taskInput.value = ''
    updateLocalStorage()
    updateNumber()
}

function finishTask(e) {
    let parentLi = e.target.parentNode
    parentLi.classList.toggle('complete')
    updateLocalStorage()
}

function deleteTask(e) {
    let parentLi = e.target.parentNode
    parentLi.remove()
    updateLocalStorage()
    updateNumber()
}

function updateNumber() {
    let allTasks = document.querySelectorAll('.task').length
    if (allTasks > 1) {
        taskTotal.innerText = `${allTasks} items left`
    } else if ( allTasks === 0){
        taskTotal.innerText = `No tasks`
    } else {
        taskTotal.innerText = `${allTasks} item left`
    }
}

function taskOption(option) {
    let taskElems = document.querySelectorAll('.task')
    allBtn.classList.remove('active')
    activeBtn.classList.remove('active')
    completedBtn.classList.remove('active')

    if (option == 'all') {
        taskElems.forEach(task => {
            if (task.classList.contains('hide')) {
                task.classList.remove('hide')
            }
        })
        allBtn.classList.add('active')

    } else if(option == 'active') {
        taskElems.forEach(task => {
            if (task.classList.contains('complete')) {
                task.classList.add('hide')
            } else {
                task.classList.remove('hide')
            }
        })
        activeBtn.classList.add('active')
        
    } else if (option == 'completed'){
        taskElems.forEach(task => {
            if (!task.classList.contains('complete')) {
                task.classList.add('hide')
            } else {
                task.classList.remove('hide')
            }
        })
        completedBtn.classList.add('active')
    }
}

function clearCompleted() {
    let taskLis = document.querySelectorAll('.task')
    taskLis.forEach(taskLi => {
        if (taskLi.classList.contains('complete')) {
            taskLi.remove()
            updateLocalStorage()
            updateNumber()
        }
    })
}

function updateLocalStorage() {
    const tasks = []
    let taskLis = document.querySelectorAll('.task')
    taskLis.forEach(taskLi => {
        let tText = taskLi.children[1].innerText;
        tasks.push({
            text: tText,
            completed: taskLi.classList.contains('complete')
        })
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function drag() {
    let items = document.querySelectorAll('.task');
    let current = null;

    items.forEach( item => {
        
        item.draggable = true;
        
        item.addEventListener("dragstart", function () {
          current = this;
        });

        item.addEventListener("dragover", function (e) {
          e.preventDefault();
        });
     
        item.addEventListener("drop", function (e) {
          e.preventDefault();

          if (this != current) {
            let prevPosition = 0, newPosition = 0;

            for (let i=0; i < items.length; i++) {
              if (current == items[i]) { prevPosition = i; }
              if (this == items[i]) { newPosition = i; }
            }
            if (prevPosition < newPosition) { 
              this.parentNode.insertBefore(current, this);
              updateLocalStorage()
              console.log(current.innerText, prevPosition, newPosition, this.innerText);
            } else {
              this.parentNode.insertBefore(current.previousSibling,this);
              updateLocalStorage()
              console.log(current.innerText, prevPosition, newPosition, this);
            }
          }
        });
      })
}
drag()
