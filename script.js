let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;
let scheduleByDate = {};
let todos = []; // 'const' 대신 'let' 사용
const holidays = ['2024-01-01', '2023-12-25'];

// 이전 달과 다음 달로 이동하는 함수
function goToPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    createCalendar();
}

function goToNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar();
}

// 달력 생성 함수
function createCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const calendarHeader = document.getElementById('calendar-header');
    calendarHeader.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = '< 이전';
    prevButton.onclick = goToPreviousMonth;
    calendarHeader.appendChild(prevButton);

    const monthYearLabel = document.createElement('span');
    monthYearLabel.textContent = `${currentYear}년 ${currentMonth + 1}월`;
    calendarHeader.appendChild(monthYearLabel);

    const nextButton = document.createElement('button');
    nextButton.textContent = '다음 >';
    nextButton.onclick = goToNextMonth;
    calendarHeader.appendChild(nextButton);

    const dayHeaders = document.getElementById('day-headers');
    dayHeaders.innerHTML = '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeaders.appendChild(dayHeader);
    });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        calendar.appendChild(document.createElement('div'));
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = i;

        const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
        if (dayOfWeek === 0) {
            dayCell.classList.add('sunday');
        } else if (dayOfWeek === 6) {
            dayCell.classList.add('saturday');
        }

        const formattedDate = `${currentYear}-${currentMonth + 1}-${i}`;
        if (holidays.includes(formattedDate)) {
            dayCell.classList.add('holiday');
        }

        if (i === new Date().getDate() && currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()) {
            dayCell.classList.add('current-day');
        }
        dayCell.addEventListener('click', function() {
            selectDate(new Date(currentYear, currentMonth, i));
        });
        calendar.appendChild(dayCell);
    }
}

// 날짜 선택 함수
function selectDate(date) {
    selectedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    showScheduleForDate(selectedDate);
}

// 오늘의 일정 보여주기 함수
function showScheduleForDate(date) {
    const todaySchedule = document.getElementById('today-schedule');
    todaySchedule.innerHTML = '';

    const dateHeader = document.createElement('h3');
    dateHeader.id = 'dateHeader'; // ID 설정
    dateHeader.textContent = `Today is: ${date}`;
    todaySchedule.appendChild(dateHeader);


    if (scheduleByDate[date]) {
        scheduleByDate[date].forEach((event, index) => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';

            const checkboxLabel = document.createElement('label');
            checkboxLabel.className = 'checkbox-container';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const customCheckbox = document.createElement('span');
            customCheckbox.className = 'custom-checkbox';

            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(customCheckbox);

            eventItem.appendChild(checkboxLabel);

            const newEvent = document.createElement('p');
            newEvent.textContent = event;
            newEvent.classList.add('todo-text');
            newEvent.addEventListener('click', toggleFullText);
            eventItem.appendChild(newEvent);

            const editBtn = document.createElement('button');
            editBtn.textContent = '편집';
            editBtn.classList.add('today-schedule-edit-btn');
            editBtn.onclick = function() {
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = event;
                const saveBtn = document.createElement('button');
                saveBtn.textContent = '저장';
                saveBtn.onclick = function() {
                    scheduleByDate[date][index] = editInput.value;
                    saveSchedule();
                    showScheduleForDate(date);
                };
                eventItem.innerHTML = '';
                eventItem.appendChild(editInput);
                eventItem.appendChild(saveBtn);
            };
            eventItem.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.classList.add('today-schedule-delete-btn');
            deleteBtn.onclick = function() {
                scheduleByDate[date].splice(index, 1);
                showScheduleForDate(date);
                saveSchedule();
            };
            eventItem.appendChild(deleteBtn);

            todaySchedule.appendChild(eventItem);
        });
    }
}

// 텍스트 전체 보기/숨기기 기능
function toggleFullText(event) {
    const element = event.target;
    element.classList.toggle('full-text');
}

// 할 일 목록 관련 함수
function addTodo() {
    const todoText = document.getElementById('new-todo-item').value;
    if (todoText.trim() !== '') {
        todos.push(todoText); // 전역 변수에 추가
        saveTodos(); // 저장
        updateTodoListUI(); // UI 업데이트
        document.getElementById('new-todo-item').value = ''; // 초기화
    }
}

function updateTodoListUI() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // 초기화

    todos.forEach((todoText, index) => {
        const newItem = document.createElement('li');
        newItem.className = 'todo-item'; // 할 일 항목에 클래스 추가

        // 여기에 체크박스를 추가합니다.
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const customCheckbox = document.createElement('span');
        customCheckbox.className = 'custom-checkbox';

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(customCheckbox);

        newItem.appendChild(checkboxLabel);

        // 나머지 할 일 항목 관련 코드
        const textSpan = document.createElement('span');
        textSpan.textContent = todoText;
        textSpan.classList.add('todo-text');
        textSpan.addEventListener('click', toggleFullText);
        newItem.appendChild(textSpan);

        const editBtn = document.createElement('button');
        editBtn.textContent = '편집';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = function() {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = todoText;
            const saveBtn = document.createElement('button');
            saveBtn.textContent = '저장';
            saveBtn.onclick = function() {
                const newText = editInput.value;
                textSpan.textContent = newText;
                newItem.replaceChild(textSpan, editInput);
                newItem.replaceChild(editBtn, saveBtn);
                todos[index] = newText; // 전역 변수 업데이트
                saveTodos(); // 변경된 할 일 목록을 localStorage에 저장
            };

            newItem.replaceChild(editInput, textSpan);
            newItem.replaceChild(saveBtn, editBtn);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = function() {
            todoList.removeChild(newItem);
            todos.splice(index, 1); // 전역 변수에서 삭제
            saveTodos(); // 변경된 할 일 목록을 localStorage에 저장
        };

        newItem.appendChild(editBtn);
        newItem.appendChild(deleteBtn);
        todoList.appendChild(newItem);
    });
}


function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
        todos = storedTodos; // 이제 'todos'에 새 값을 할당할 수 있습니다.
        updateTodoListUI();
    }
}

// 오늘의 일정 추가 함수
function addTodaySchedule() {
    const eventText = document.getElementById('today-schedule-input').value;
    if (eventText.trim() !== '' && selectedDate) {
        if (!scheduleByDate[selectedDate]) {
            scheduleByDate[selectedDate] = [];
        }
        scheduleByDate[selectedDate].push(eventText);
        showScheduleForDate(selectedDate);
        document.getElementById('today-schedule-input').value = '';
        saveSchedule();
    }
}
// localStorage에서 저장된 일정 불러오기
function loadSchedule() {
    const storedSchedule = JSON.parse(localStorage.getItem('scheduleByDate'));
    if (storedSchedule) {
        for (const date in storedSchedule) {
            if (storedSchedule.hasOwnProperty(date)) {
                scheduleByDate[date] = storedSchedule[date];
            }
        }
    }
}
// localStorage에 일정 저장
function saveSchedule() {
    localStorage.setItem('scheduleByDate', JSON.stringify(scheduleByDate));
}

// 페이지 로드 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    createCalendar();

    // 현재 날짜 선택 및 일정 표시
    const today = new Date();
    selectDate(today); // 현재 날짜를 선택합니다.

    loadTodos();
    loadSchedule();

    // 이벤트 리스너 설정
    document.getElementById('add-todo-button').addEventListener('click', addTodo);
    document.getElementById('new-todo-item').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { addTodo(); }
    });

    document.getElementById('add-today-schedule').addEventListener('click', addTodaySchedule);
    document.getElementById('today-schedule-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { addTodaySchedule(); }
    });
    
    // 현재 날짜의 일정 표시
    showScheduleForDate(selectedDate);
});
