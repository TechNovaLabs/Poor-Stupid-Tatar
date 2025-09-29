// Загрузка данных и генерация отчета при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadReportData();
});

// Загрузка данных отчета из URL параметров
function loadReportData() {
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('start');
    const endDate = urlParams.get('end');
    const period = urlParams.get('period');
    
    // Загрузка финансовых данных
    const finances = loadFinancesData();
    
    let reportData;
    
    if (period) {
        // Генерация отчета за стандартный период
        reportData = generatePeriodReport(period, finances);
    } else if (startDate && endDate) {
        // Генерация отчета за пользовательский период
        reportData = generateCustomReport(startDate, endDate, finances);
    } else {
        // Отчет за все время
        reportData = generateAllTimeReport(finances);
    }
    
    displayReport(reportData);
}

// Загрузка финансовых данных из Local Storage
function loadFinancesData() {
    const storedIncomes = localStorage.getItem('finTrackIncomes');
    const storedExpenses = localStorage.getItem('finTrackExpenses');
    const storedSavings = localStorage.getItem('finTrackSavings');
    const storedSavingsGoal = localStorage.getItem('finTrackSavingsGoal');
    
    return {
        incomes: storedIncomes ? JSON.parse(storedIncomes) : [],
        expenses: storedExpenses ? JSON.parse(storedExpenses) : [],
        savings: storedSavings ? JSON.parse(storedSavings) : [],
        savingsGoal: storedSavingsGoal ? parseFloat(storedSavingsGoal) : 0
    };
}

// Генерация отчета за стандартный период
function generatePeriodReport(period, finances) {
    const now = new Date();
    let startDate, endDate;
    
    switch(period) {
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
        default:
            return generateAllTimeReport(finances);
    }
    
    return generateCustomReport(
        startDate.toISOString().split('T')[0], 
        endDate.toISOString().split('T')[0], 
        finances
    );
}

// Генерация отчета за пользовательский период
function generateCustomReport(start, end, finances) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Фильтрация данных по периоду
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
    
    return {
        period: `с ${startDate.toLocaleDateString('ru-RU')} по ${endDate.toLocaleDateString('ru-RU')}`,
        startDate: start,
        endDate: end,
        incomes: periodIncomes,
        expenses: periodExpenses,
        savings: periodSavings,
        savingsGoal: finances.savingsGoal
    };
}

// Генерация отчета за все время
function generateAllTimeReport(finances) {
    return {
        period: "за все время",
        startDate: null,
        endDate: null,
        incomes: finances.incomes,
        expenses: finances.expenses,
        savings: finances.savings,
        savingsGoal: finances.savingsGoal
    };
}

// Отображение отчета на странице
function displayReport(reportData) {
    // Установка заголовка периода
    document.getElementById('reportPeriod').textContent = `Отчет ${reportData.period}`;
    document.getElementById('reportDate').textContent = `Сгенерирован: ${new Date().toLocaleDateString('ru-RU')}`;
    
    // Расчет статистики
    const totalIncome = reportData.incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpense = reportData.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalSavingsAdded = reportData.savings
        .filter(s => s.action === 'add')
        .reduce((sum, saving) => sum + parseFloat(saving.amount), 0);
    const totalSavingsWithdrawn = reportData.savings
        .filter(s => s.action === 'withdraw')
        .reduce((sum, saving) => sum + parseFloat(saving.amount), 0);
    const netSavings = totalSavingsAdded - totalSavingsWithdrawn;
    const balance = totalIncome - totalExpense;
    
    // Отображение сводки
    displaySummary(totalIncome, totalExpense, netSavings, balance);
    
    // Отображение таблиц транзакций
    displayIncomeTable(reportData.incomes);
    displayExpenseTable(reportData.expenses);
    displaySavingsTable(reportData.savings);
    
    // Отображение статистики по категориям
    displayCategoryStats(reportData.incomes, reportData.expenses);
}

// Отображение сводки
function displaySummary(income, expense, savings, balance) {
    const summaryHTML = `
        <div class="summary-card income">
            <div>Общий доход</div>
            <div class="summary-value amount-positive">+${income.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div class="summary-card expense">
            <div>Общий расход</div>
            <div class="summary-value amount-negative">-${expense.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div class="summary-card savings">
            <div>Накопления</div>
            <div class="summary-value ${savings >= 0 ? 'amount-positive' : 'amount-negative'}">
                ${savings >= 0 ? '+' : ''}${savings.toLocaleString('ru-RU')} ₽
            </div>
        </div>
        <div class="summary-card balance">
            <div>Баланс</div>
            <div class="summary-value ${balance >= 0 ? 'amount-positive' : 'amount-negative'}">
                ${balance >= 0 ? '+' : ''}${balance.toLocaleString('ru-RU')} ₽
            </div>
        </div>
    `;
    
    document.getElementById('reportSummary').innerHTML = summaryHTML;
}

// Отображение таблицы доходов
function displayIncomeTable(incomes) {
    const tbody = document.querySelector('#incomeTable tbody');
    tbody.innerHTML = '';
    
    if (incomes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Нет данных о доходах</td></tr>';
        return;
    }
    
    // Сортировка по дате (новые сверху)
    const sortedIncomes = [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedIncomes.forEach(income => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(income.date).toLocaleDateString('ru-RU')}</td>
            <td>${getIncomeCategory(income.category)}</td>
            <td>${income.description || '-'}</td>
            <td class="amount-positive">+${parseFloat(income.amount).toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(row);
    });
}

// Отображение таблицы расходов
function displayExpenseTable(expenses) {
    const tbody = document.querySelector('#expenseTable tbody');
    tbody.innerHTML = '';
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Нет данных о расходах</td></tr>';
        return;
    }
    
    // Сортировка по дате (новые сверху)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(expense.date).toLocaleDateString('ru-RU')}</td>
            <td>${getExpenseCategory(expense.category)}</td>
            <td>${expense.description || '-'}</td>
            <td class="amount-negative">-${parseFloat(expense.amount).toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(row);
    });
}

// Отображение таблицы накоплений
function displaySavingsTable(savings) {
    const tbody = document.querySelector('#savingsTable tbody');
    tbody.innerHTML = '';
    
    if (savings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Нет данных о накоплениях</td></tr>';
        return;
    }
    
    // Сортировка по дате (новые сверху)
    const sortedSavings = [...savings].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedSavings.forEach(saving => {
        const row = document.createElement('tr');
        const actionText = saving.action === 'add' ? 'Пополнение' : 'Снятие';
        const amountClass = saving.action === 'add' ? 'amount-positive' : 'amount-negative';
        const amountSign = saving.action === 'add' ? '+' : '-';
        
        row.innerHTML = `
            <td>${new Date(saving.date).toLocaleDateString('ru-RU')}</td>
            <td>${actionText}</td>
            <td>${saving.description || '-'}</td>
            <td class="${amountClass}">${amountSign}${parseFloat(saving.amount).toLocaleString('ru-RU')} ₽</td>
        `;
        tbody.appendChild(row);
    });
}

// Отображение статистики по категориям
function displayCategoryStats(incomes, expenses) {
    const container = document.getElementById('categoryStats');
    
    // Статистика по доходам
    const incomeStats = {};
    incomes.forEach(income => {
        const category = getIncomeCategory(income.category);
        incomeStats[category] = (incomeStats[category] || 0) + parseFloat(income.amount);
    });
    
    // Статистика по расходам
    const expenseStats = {};
    expenses.forEach(expense => {
        const category = getExpenseCategory(expense.category);
        expenseStats[category] = (expenseStats[category] || 0) + parseFloat(expense.amount);
    });
    
    let statsHTML = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">';
    
    // Доходы по категориям
    statsHTML += '<div>';
    statsHTML += '<h3>Доходы по категориям</h3>';
    if (Object.keys(incomeStats).length > 0) {
        statsHTML += '<ul>';
        for (const [category, amount] of Object.entries(incomeStats)) {
            statsHTML += `<li>${category}: <span class="amount-positive">+${amount.toLocaleString('ru-RU')} ₽</span></li>`;
        }
        statsHTML += '</ul>';
    } else {
        statsHTML += '<p>Нет данных</p>';
    }
    statsHTML += '</div>';
    
    // Расходы по категориям
    statsHTML += '<div>';
    statsHTML += '<h3>Расходы по категориям</h3>';
    if (Object.keys(expenseStats).length > 0) {
        statsHTML += '<ul>';
        for (const [category, amount] of Object.entries(expenseStats)) {
            statsHTML += `<li>${category}: <span class="amount-negative">-${amount.toLocaleString('ru-RU')} ₽</span></li>`;
        }
        statsHTML += '</ul>';
    } else {
        statsHTML += '<p>Нет данных</p>';
    }
    statsHTML += '</div>';
    
    statsHTML += '</div>';
    container.innerHTML = statsHTML;
}

// Вспомогательные функции для получения названий категорий
function getIncomeCategory(key) {
    const categories = {
        salary: "Зарплата",
        bonus: "Премия",
        freelance: "Подработка",
        gift: "Подарок",
        other: "Другое"
    };
    return categories[key] || key;
}

function getExpenseCategory(key) {
    const categories = {
        rent: "Аренда",
        food: "Еда",
        transport: "Транспорт",
        entertainment: "Развлечения",
        health: "Здоровье",
        other: "Другое"
    };
    return categories[key] || key;
}

// Функции экспорта
function printReport() {
    window.print();
}

function exportToPDF() {
    // Используем html2pdf.js для создания PDF
    const element = document.querySelector('.report-container');
    
    // Проверяем, подключена ли библиотека html2pdf
    if (typeof html2pdf === 'undefined') {
        // Динамически загружаем библиотеку
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => generatePDF(element);
        document.head.appendChild(script);
    } else {
        generatePDF(element);
    }
}

function generatePDF(element) {
    const opt = {
        margin: 10,
        filename: `financial_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

function exportToExcel() {
    const finances = loadFinancesData();
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('start');
    const endDate = urlParams.get('end');
    const period = urlParams.get('period');
    
    let reportData;
    if (period) {
        reportData = generatePeriodReport(period, finances);
    } else if (startDate && endDate) {
        reportData = generateCustomReport(startDate, endDate, finances);
    } else {
        reportData = generateAllTimeReport(finances);
    }
    
    // Создаем CSV содержимое
    let csvContent = "Финансовый отчет\n\n";
    csvContent += `Период: ${reportData.period}\n`;
    csvContent += `Дата генерации: ${new Date().toLocaleDateString('ru-RU')}\n\n`;
    
    // Доходы
    csvContent += "Доходы\n";
    csvContent += "Дата,Категория,Описание,Сумма\n";
    reportData.incomes.forEach(income => {
        csvContent += `${new Date(income.date).toLocaleDateString('ru-RU')},${getIncomeCategory(income.category)},${income.description || ''},+${income.amount}\n`;
    });
    
    csvContent += "\nРасходы\n";
    csvContent += "Дата,Категория,Описание,Сумма\n";
    reportData.expenses.forEach(expense => {
        csvContent += `${new Date(expense.date).toLocaleDateString('ru-RU')},${getExpenseCategory(expense.category)},${expense.description || ''},-${expense.amount}\n`;
    });
    
    csvContent += "\nНакопления\n";
    csvContent += "Дата,Тип операции,Описание,Сумма\n";
    reportData.savings.forEach(saving => {
        const action = saving.action === 'add' ? 'Пополнение' : 'Снятие';
        const sign = saving.action === 'add' ? '+' : '-';
        csvContent += `${new Date(saving.date).toLocaleDateString('ru-RU')},${action},${saving.description || ''},${sign}${saving.amount}\n`;
    });
    
    // Создаем и скачиваем файл
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}