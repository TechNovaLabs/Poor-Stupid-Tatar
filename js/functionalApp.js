// Имя друга (можно изменить)
const friendName = "Нищеброд";

// Категории доходов и расходов
const incomeCategories = {
    salary: "Зарплата",
    bonus: "Премия",
    freelance: "Подработка",
    gift: "Подарок",
    other: "Другое"
};

const expenseCategories = {
    rent: "Аренда",
    food: "Еда",
    transport: "Транспорт",
    entertainment: "Развлечения",
    health: "Здоровье",
    resourant: "Кафе, рестораны",
    fitnes: "Спорт-зал",
    taxi: "Такси",
    shoping: "Одежда",
    other: "Другое"
};

// Сообщения для разных категорий
const incomeMessages = {
    salary: `Охуеть ${friendName}, ты получил зарплату, незабудь спустить ее как обычно на бесполезную хуйню`,
    bonus: `Ебать ты молодец ${friendName}, оголял в кабинете жопу что бы ее получить?`,
    freelance: `${friendName}, каким непотребством ты опять занялся что бы получить эти копейки?`,
    gift: `${friendName}, не радуйся, тебе дали их из жалости`,
    other: `${friendName}, тут даже я в ахуе от куда ты их получил`
};

const expenseMessages = {
    rent: `Ранис, твоим предкам стыдно что ты платишь русским за жилье`,
    food: `Ранис, надеюсь оно того стоило? У тебя же бабок дохуя что бы на это тратить`,
    transport: `Ну ебать, ты идиот? не пробовал ходить пешком?`,
    entertainment: `Ранис, я в ахуе, когда ты успел так заебаться?`,
    health: `Ты же еще пиздюк, хули там у тебя может болеть? `,
    resourant: `Ранис, ебать ты дурак! в арсенале уже не обедаем?`,
    fitnes: `Бляяя, ты же видел себя в зеркало? тут поможет только пластический хирург`,
    taxi: `Ранис, тут я могу тебя похвалить! Молодец! Дебил блять`,
    shoping: `Ранис, новые шмотки тебе не помогут, ты и так урод`,
    other: `Ну и нахуя тебе это? купил бы лучше мозги`
};

// Сообщения для накоплений
const savingsMessages = {
    add: `Отлично ${friendName}! Ты стал ближе к своей цели! 💪`,
    withdraw: `Осторожнее ${friendName}... Ты стал дальше от своей цели. 😔`,
    goal: `Отличная цель ${friendName}! Стремись к ней! 🎯`
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function () {
    // Установка имени друга
    document.getElementById('userInfo').textContent = friendName;

    // Установка приветствия
    setGreeting();

    // Загрузка данных из Local Storage
    loadData();

    // Инициализация календаря
    initCalendar();

    // Обновление интерфейса
    updateUI();

    // Настройка обработчиков событий
    setupEventListeners();
});

// Установка приветствия в зависимости от времени суток
function setGreeting() {
    const now = new Date();
    const moscowTime = new Date(now.getTime() + (3 * 60 * 60 * 1000)); // UTC+3 для Москвы

    let greetingText = '';
    const hour = moscowTime.getHours();

    if (hour >= 5 && hour < 12) {
        greetingText = `Доброе утро, ${friendName}`;
    } else if (hour >= 12 && hour < 18) {
        greetingText = `Добрый день, ${friendName}`;
    } else if (hour >= 18 && hour < 23) {
        greetingText = `Добрый вечер, ${friendName}`;
    } else {
        greetingText = `Доброй ночи, ${friendName}`;
    }

    document.getElementById('greetingText').textContent = greetingText;

    // Форматирование даты
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateInfo').textContent = moscowTime.toLocaleDateString('ru-RU', options);
}

// Загрузка данных из Local Storage
function loadData() {
    const storedIncomes = localStorage.getItem('finTrackIncomes');
    const storedExpenses = localStorage.getItem('finTrackExpenses');
    const storedSavings = localStorage.getItem('finTrackSavings');
    const storedSavingsGoal = localStorage.getItem('finTrackSavingsGoal');

    window.finances = {
        incomes: storedIncomes ? JSON.parse(storedIncomes) : [],
        expenses: storedExpenses ? JSON.parse(storedExpenses) : [],
        savings: storedSavings ? JSON.parse(storedSavings) : [],
        savingsGoal: storedSavingsGoal ? parseFloat(storedSavingsGoal) : 0
    };
}

// Сохранение данных в Local Storage
function saveData() {
    localStorage.setItem('finTrackIncomes', JSON.stringify(finances.incomes));
    localStorage.setItem('finTrackExpenses', JSON.stringify(finances.expenses));
    localStorage.setItem('finTrackSavings', JSON.stringify(finances.savings));
    localStorage.setItem('finTrackSavingsGoal', finances.savingsGoal.toString());
}

// Инициализация календаря
function initCalendar() {
    const now = new Date();
    window.currentMonth = now.getMonth();
    window.currentYear = now.getFullYear();

    updateCalendar();
}

// Обновление календаря
function updateCalendar() {
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    document.getElementById('currentMonth').textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Корректировка для понедельника как первого дня недели
    const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    // Добавление дней недели
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        dayElement.style.fontWeight = 'bold';
        calendarGrid.appendChild(dayElement);
    });

    // Добавление пустых ячеек для дней предыдущего месяца
    for (let i = 0; i < adjustedStartingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }

    // Добавление дней текущего месяца
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        dayElement.dataset.day = i;
        dayElement.dataset.month = currentMonth;
        dayElement.dataset.year = currentYear;

        // Проверка, является ли день сегодняшним
        if (i === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()) {
            dayElement.classList.add('active');
        }

        // Проверка, есть ли транзакции в этот день
        const hasTransactions = finances.incomes.some(income =>
            new Date(income.date).getDate() === i &&
            new Date(income.date).getMonth() === currentMonth &&
            new Date(income.date).getFullYear() === currentYear
        ) || finances.expenses.some(expense =>
            new Date(expense.date).getDate() === i &&
            new Date(expense.date).getMonth() === currentMonth &&
            new Date(expense.date).getFullYear() === currentYear
        ) || finances.savings.some(saving =>
            new Date(saving.date).getDate() === i &&
            new Date(saving.date).getMonth() === currentMonth &&
            new Date(saving.date).getFullYear() === currentYear
        );

        if (hasTransactions) {
            dayElement.style.backgroundColor = 'var(--primary)';
            dayElement.style.color = 'white';
        }

        dayElement.addEventListener('click', function () {
            showDayTransactions(i, currentMonth, currentYear);
        });

        calendarGrid.appendChild(dayElement);
    }
}

// Показать транзакции за выбранный день
function showDayTransactions(day, month, year) {
    const selectedDate = new Date(year, month, day);
    const formattedDate = selectedDate.toLocaleDateString('ru-RU');

    const dayIncomes = finances.incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getDate() === day &&
            incomeDate.getMonth() === month &&
            incomeDate.getFullYear() === year;
    });

    const dayExpenses = finances.expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getDate() === day &&
            expenseDate.getMonth() === month &&
            expenseDate.getFullYear() === year;
    });

    const daySavings = finances.savings.filter(saving => {
        const savingDate = new Date(saving.date);
        return savingDate.getDate() === day &&
            savingDate.getMonth() === month &&
            savingDate.getFullYear() === year;
    });

    let reportHTML = `<h3>Транзакции за ${formattedDate}</h3>`;

    if (dayIncomes.length === 0 && dayExpenses.length === 0 && daySavings.length === 0) {
        reportHTML += '<p>В этот день не было транзакций</p>';
    } else {
        if (dayIncomes.length > 0) {
            reportHTML += '<h4>Доходы:</h4><ul>';
            dayIncomes.forEach(income => {
                reportHTML += `<li>${incomeCategories[income.category]}: ${income.amount} ₽</li>`;
            });
            reportHTML += '</ul>';
        }

        if (dayExpenses.length > 0) {
            reportHTML += '<h4>Расходы:</h4><ul>';
            dayExpenses.forEach(expense => {
                reportHTML += `<li>${expenseCategories[expense.category]}: ${expense.amount} ₽</li>`;
            });
            reportHTML += '</ul>';
        }

        if (daySavings.length > 0) {
            reportHTML += '<h4>Накопления:</h4><ul>';
            daySavings.forEach(saving => {
                const action = saving.action === 'add' ? '+' : '-';
                reportHTML += `<li>${saving.description || 'Накопления'}: ${action}${saving.amount} ₽</li>`;
            });
            reportHTML += '</ul>';
        }
    }

    document.getElementById('reportData').innerHTML = reportHTML;
}

// Обновление интерфейса
function updateUI() {
    // Расчет общих сумм
    const totalIncome = finances.incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpense = finances.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalSavings = finances.savings.reduce((sum, saving) => {
        return saving.action === 'add' ? sum + parseFloat(saving.amount) : sum - parseFloat(saving.amount);
    }, 0);
    const totalAmount = totalIncome - totalExpense;

    // Обновление сумм на экране
    document.getElementById('totalAmount').textContent = `${totalAmount.toLocaleString('ru-RU')} ₽`;
    document.getElementById('incomeAmount').textContent = `${totalIncome.toLocaleString('ru-RU')} ₽`;
    document.getElementById('expenseAmount').textContent = `${totalExpense.toLocaleString('ru-RU')} ₽`;
    document.getElementById('savingsAmount').textContent = `${totalSavings.toLocaleString('ru-RU')} ₽`;

    // Обновление прогресса накоплений
    updateSavingsProgress(totalSavings);

    // Обновление списков транзакций
    updateTransactionLists();
}

// Обновление прогресса накоплений
function updateSavingsProgress(currentSavings) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (finances.savingsGoal > 0) {
        const progress = Math.min((currentSavings / finances.savingsGoal) * 100, 100);
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    } else {
        progressFill.style.width = '0%';
        progressText.textContent = 'Цель не установлена';
    }
}

// Обновление списков транзакций
function updateTransactionLists() {
    const incomeList = document.getElementById('incomeList');
    const expenseList = document.getElementById('expenseList');
    const savingsList = document.getElementById('savingsList');

    // Очистка списков
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
    savingsList.innerHTML = '';

    // Добавление доходов (последние 5)
    const recentIncomes = finances.incomes.slice(-5).reverse();
    recentIncomes.forEach(income => {
        const item = createTransactionItem(income, 'income');
        incomeList.appendChild(item);
    });

    // Добавление расходов (последние 5)
    const recentExpenses = finances.expenses.slice(-5).reverse();
    recentExpenses.forEach(expense => {
        const item = createTransactionItem(expense, 'expense');
        expenseList.appendChild(item);
    });

    // Добавление накоплений (последние 5)
    const recentSavings = finances.savings.slice(-5).reverse();
    recentSavings.forEach(saving => {
        const item = createTransactionItem(saving, 'savings');
        savingsList.appendChild(item);
    });
}

// Создание элемента транзакции
function createTransactionItem(transaction, type) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.dataset.id = transaction.id;
    item.dataset.type = type;

    let categoryText = '';
    let amountText = '';

    if (type === 'income') {
        categoryText = incomeCategories[transaction.category];
        amountText = `+${parseFloat(transaction.amount).toLocaleString('ru-RU')} ₽`;
    } else if (type === 'expense') {
        categoryText = expenseCategories[transaction.category];
        amountText = `-${parseFloat(transaction.amount).toLocaleString('ru-RU')} ₽`;
    } else if (type === 'savings') {
        categoryText = transaction.description || 'Накопления';
        const sign = transaction.action === 'add' ? '+' : '-';
        amountText = `${sign}${parseFloat(transaction.amount).toLocaleString('ru-RU')} ₽`;
    }

    item.innerHTML = `
        <div class="transaction-category">${categoryText}</div>
        <div class="transaction-amount ${type}">${amountText}</div>
    `;

    // Добавляем обработчик для редактирования
    item.addEventListener('click', function () {
        openEditModal(transaction, type);
    });

    return item;
}

// Открытие модального окна редактирования
function openEditModal(transaction, type) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');
    const title = document.getElementById('editModalTitle');
    const categorySelect = document.getElementById('editCategory');

    // Заполняем заголовок
    title.textContent = `Редактировать ${type === 'income' ? 'доход' : type === 'expense' ? 'расход' : 'накопление'}`;

    // Заполняем форму данными
    document.getElementById('editId').value = transaction.id;
    document.getElementById('editType').value = type;
    document.getElementById('editAmountInput').value = transaction.amount;
    document.getElementById('editDate').value = transaction.date;
    document.getElementById('editDescription').value = transaction.description || '';

    // Заполняем категории
    categorySelect.innerHTML = '';

    if (type === 'income') {
        for (const [key, value] of Object.entries(incomeCategories)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value;
            option.selected = key === transaction.category;
            categorySelect.appendChild(option);
        }
    } else if (type === 'expense') {
        for (const [key, value] of Object.entries(expenseCategories)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value;
            option.selected = key === transaction.category;
            categorySelect.appendChild(option);
        }
    } else {
        // Для накоплений скрываем выбор категории
        categorySelect.style.display = 'none';
        document.querySelector('label[for="editCategory"]').style.display = 'none';
    }

    modal.style.display = 'flex';
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки добавления доходов и расходов
    document.getElementById('addIncomeBtn').addEventListener('click', () => {
        document.getElementById('incomeModal').style.display = 'flex';
        document.getElementById('incomeDate').valueAsDate = new Date();
    });

    document.getElementById('addExpenseBtn').addEventListener('click', () => {
        document.getElementById('expenseModal').style.display = 'flex';
        document.getElementById('expenseDate').valueAsDate = new Date();
    });

    // Кнопка управления накоплениями
    document.getElementById('manageSavingsBtn').addEventListener('click', () => {
        document.getElementById('savingsModal').style.display = 'flex';
    });

    // Кнопки действий с накоплениями
    document.querySelectorAll('.savings-action-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.dataset.action;
            setupSavingsForm(action);
        });
    });

    // Закрытие модальных окон
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Формы
    document.getElementById('incomeForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addIncome();
    });

    document.getElementById('expenseForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addExpense();
    });

    document.getElementById('savingsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        manageSavings();
    });

    document.getElementById('editForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveEdit();
    });

    document.getElementById('deleteBtn').addEventListener('click', function () {
        deleteTransaction();
    });

    // Кнопки навигации по календарю
    document.getElementById('prevMonthBtn').addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonthBtn').addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    // Кнопки отчетов
    document.querySelectorAll('.report-filters .btn').forEach(btn => {
        if (btn.id !== 'customPeriodBtn') {
            btn.addEventListener('click', function () {
                const period = this.dataset.period;
                generateReport(period);
            });
        }
    });

    document.getElementById('customPeriodBtn').addEventListener('click', function () {
        document.getElementById('customPeriodModal').style.display = 'flex';
    });

    document.getElementById('customPeriodForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (startDate && endDate) {
            generateCustomReport(startDate, endDate);
            document.getElementById('customPeriodModal').style.display = 'none';
        }
    });

    // Добавляем кнопки экспорта отчетов в блок отчетов
    const reportFilters = document.querySelector('.report-filters');
    const exportButtons = `
    <button class="btn" id="viewFullReportBtn">📊 Полный отчет</button>
    <button class="btn" id="exportPDFBtn">📄 PDF отчет</button>`;

    reportFilters.insertAdjacentHTML('afterend', exportButtons);

    // Обработчики для кнопок экспорта
    document.getElementById('viewFullReportBtn').addEventListener('click', function () {
        // Открываем полный отчет в той же вкладке
        window.location.href = '../pages/report.html';
    });

    document.getElementById('exportPDFBtn').addEventListener('click', function () {
        // Генерируем PDF отчет за текущий месяц в той же вкладке
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        window.location.href = `../pages/report.html?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`;
    });
}

// Настройка формы накоплений
function setupSavingsForm(action) {
    const form = document.getElementById('savingsForm');
    const amountLabel = document.getElementById('savingsAmountLabel');
    const goalGroup = document.getElementById('goalGroup');
    const submitBtn = document.getElementById('savingsSubmitBtn');

    form.style.display = 'block';

    if (action === 'add') {
        amountLabel.textContent = 'Сумма для добавления';
        goalGroup.style.display = 'none';
        submitBtn.textContent = 'Добавить';
    } else if (action === 'withdraw') {
        amountLabel.textContent = 'Сумма для снятия';
        goalGroup.style.display = 'none';
        submitBtn.textContent = 'Снять';
    } else if (action === 'setGoal') {
        amountLabel.textContent = 'Текущая сумма накоплений';
        goalGroup.style.display = 'block';
        submitBtn.textContent = 'Установить цель';

        // Заполняем текущую цель если есть
        document.getElementById('savingsGoalInput').value = finances.savingsGoal || '';
    }

    form.dataset.action = action;
}

// Управление накоплениями
function manageSavings() {
    const action = document.getElementById('savingsForm').dataset.action;
    const amount = parseFloat(document.getElementById('savingsAmountInput').value);
    const description = document.getElementById('savingsDescription').value;

    if (action === 'setGoal') {
        const goal = parseFloat(document.getElementById('savingsGoalInput').value);
        finances.savingsGoal = goal;
        showNotification(savingsMessages.goal);
    } else {
        const saving = {
            id: Date.now(),
            amount: amount,
            action: action,
            date: new Date().toISOString().split('T')[0],
            description: description,
            timestamp: new Date().toISOString()
        };

        finances.savings.push(saving);

        if (action === 'add') {
            showNotification(savingsMessages.add);
        } else if (action === 'withdraw') {
            showNotification(savingsMessages.withdraw);
        }
    }

    saveData();
    updateUI();
    updateCalendar();

    document.getElementById('savingsModal').style.display = 'none';
    document.getElementById('savingsForm').reset();
    document.getElementById('savingsForm').style.display = 'none';
}

// Добавление дохода
function addIncome() {
    const amount = document.getElementById('incomeAmountInput').value;
    const category = document.getElementById('incomeCategory').value;
    const date = document.getElementById('incomeDate').value;
    const description = document.getElementById('incomeDescription').value;

    const income = {
        id: Date.now(),
        amount: parseFloat(amount),
        category,
        date,
        description,
        timestamp: new Date().toISOString()
    };

    finances.incomes.push(income);
    saveData();
    updateUI();
    updateCalendar();

    // Показать уведомление
    showNotification(incomeMessages[category]);

    // Закрыть модальное окно и сбросить форму
    document.getElementById('incomeModal').style.display = 'none';
    document.getElementById('incomeForm').reset();
}

// Добавление расхода
function addExpense() {
    const amount = document.getElementById('expenseAmountInput').value;
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    const description = document.getElementById('expenseDescription').value;

    const expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        category,
        date,
        description,
        timestamp: new Date().toISOString()
    };

    finances.expenses.push(expense);
    saveData();
    updateUI();
    updateCalendar();

    // Показать уведомление
    showNotification(expenseMessages[category]);

    // Закрыть модальное окно и сбросить форму
    document.getElementById('expenseModal').style.display = 'none';
    document.getElementById('expenseForm').reset();
}

// Сохранение изменений
function saveEdit() {
    const id = parseInt(document.getElementById('editId').value);
    const type = document.getElementById('editType').value;
    const amount = parseFloat(document.getElementById('editAmountInput').value);
    const category = document.getElementById('editCategory').value;
    const date = document.getElementById('editDate').value;
    const description = document.getElementById('editDescription').value;

    let collection;
    if (type === 'income') {
        collection = finances.incomes;
    } else if (type === 'expense') {
        collection = finances.expenses;
    } else {
        collection = finances.savings;
    }

    const index = collection.findIndex(item => item.id === id);
    if (index !== -1) {
        collection[index].amount = amount;
        collection[index].date = date;
        collection[index].description = description;

        if (type !== 'savings') {
            collection[index].category = category;
        }

        saveData();
        updateUI();
        updateCalendar();

        showNotification('Изменения сохранены!');
    }

    document.getElementById('editModal').style.display = 'none';
}

// Удаление транзакции
function deleteTransaction() {
    const id = parseInt(document.getElementById('editId').value);
    const type = document.getElementById('editType').value;

    let collection;
    if (type === 'income') {
        collection = finances.incomes;
    } else if (type === 'expense') {
        collection = finances.expenses;
    } else {
        collection = finances.savings;
    }

    const index = collection.findIndex(item => item.id === id);
    if (index !== -1) {
        collection.splice(index, 1);
        saveData();
        updateUI();
        updateCalendar();

        showNotification('Транзакция удалена!');
    }

    document.getElementById('editModal').style.display = 'none';
}

// Показать уведомление
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Генерация отчета за период
function generateReport(period) {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
        case 'day':
            startDate = new Date(now);
            endDate = new Date(now);
            break;
        case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay() + 1); // Понедельник
            endDate = new Date(now);
            endDate.setDate(startDate.getDate() + 6); // Воскресенье
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
    }

    generateCustomReport(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
}

// Генерация отчета за пользовательский период
function generateCustomReport(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const periodIncomes = finances.incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate >= startDate && incomeDate <= endDate;
    });

    const periodExpenses = finances.expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });

    const periodSavings = finances.savings.filter(saving => {
        const savingDate = new Date(saving.date);
        return savingDate >= startDate && savingDate <= endDate;
    });

    const totalIncome = periodIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpense = periodExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalSavingsAdded = periodSavings
        .filter(s => s.action === 'add')
        .reduce((sum, saving) => sum + parseFloat(saving.amount), 0);
    const totalSavingsWithdrawn = periodSavings
        .filter(s => s.action === 'withdraw')
        .reduce((sum, saving) => sum + parseFloat(saving.amount), 0);
    const balance = totalIncome - totalExpense;

    // Группировка по категориям
    const incomeByCategory = {};
    periodIncomes.forEach(income => {
        if (!incomeByCategory[income.category]) {
            incomeByCategory[income.category] = 0;
        }
        incomeByCategory[income.category] += parseFloat(income.amount);
    });

    const expenseByCategory = {};
    periodExpenses.forEach(expense => {
        if (!expenseByCategory[expense.category]) {
            expenseByCategory[expense.category] = 0;
        }
        expenseByCategory[expense.category] += parseFloat(expense.amount);
    });

    let reportHTML = `<h3>Отчет за период: ${startDate.toLocaleDateString('ru-RU')} - ${endDate.toLocaleDateString('ru-RU')}</h3>`;
    reportHTML += `<p><strong>Общий доход:</strong> ${totalIncome.toLocaleString('ru-RU')} ₽</p>`;
    reportHTML += `<p><strong>Общий расход:</strong> ${totalExpense.toLocaleString('ru-RU')} ₽</p>`;
    reportHTML += `<p><strong>Баланс:</strong> ${balance.toLocaleString('ru-RU')} ₽</p>`;
    reportHTML += `<p><strong>Добавлено в накопления:</strong> ${totalSavingsAdded.toLocaleString('ru-RU')} ₽</p>`;
    reportHTML += `<p><strong>Снято с накоплений:</strong> ${totalSavingsWithdrawn.toLocaleString('ru-RU')} ₽</p>`;

    reportHTML += '<h4>Доходы по категориям:</h4>';
    if (Object.keys(incomeByCategory).length > 0) {
        reportHTML += '<ul>';
        for (const category in incomeByCategory) {
            reportHTML += `<li>${incomeCategories[category]}: ${incomeByCategory[category].toLocaleString('ru-RU')} ₽</li>`;
        }
        reportHTML += '</ul>';
    } else {
        reportHTML += '<p>Нет доходов за выбранный период</p>';
    }

    reportHTML += '<h4>Расходы по категориям:</h4>';
    if (Object.keys(expenseByCategory).length > 0) {
        reportHTML += '<ul>';
        for (const category in expenseByCategory) {
            reportHTML += `<li>${expenseCategories[category]}: ${expenseByCategory[category].toLocaleString('ru-RU')} ₽</li>`;
        }
        reportHTML += '</ul>';
    } else {
        reportHTML += '<p>Нет расходов за выбранный период</p>';
    }

    document.getElementById('reportData').innerHTML = reportHTML;
}