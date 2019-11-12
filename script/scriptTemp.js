'use strict';

let start = document.getElementById('start'),
    cancel = document.getElementById('cancel');

let btnPlus = document.getElementsByTagName('button'),
    incomePlus = btnPlus[0], 
    expensesPlus = btnPlus[1],
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    depositCheck = document.querySelector('#deposit-check'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
	expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
	additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
	additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
	incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    //cashIncome = document.querySelector('.income-amount'),
    expensesTitle = document.querySelector('.expenses-title'),
    targetAmount = document.querySelector('.target-amount'),
    additionalExpenses = document.querySelector('.additional_expenses'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    periodSelect = document.querySelector('.period-select'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    incomeItems = document.querySelectorAll('.income-items'),
    periodAmount = document.querySelector('.period-amount'),
    inputsLeft = document.querySelectorAll('.data input[type="text"]'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent');

    class AppData{
        constructor (){
            this.budget = 0;
            this.budgetDay = 0;
            this.budgetMonth = 0;
            this.income = {};
            this.incomeMonth = 0;
            this.addIncome = [];
            this.expenses = {};
            this.expensesMonth = 0;
            this.addExpenses = [];
            this.deposit = false;
            this.percentDeposit = 0;
            this.moneyDeposit = 0;
            this.eventsListeners = function(){
                start.addEventListener('click', appData.start.bind(appData));
                cancel.addEventListener('click', appData.resetAll);
                expensesPlus.addEventListener('click', this.cloneBlocks.bind(this, 1));
                incomePlus.addEventListener('click', this.cloneBlocks.bind(this));
                periodSelect.addEventListener('input', appData.rangeChange);
            };
        }
    
start(){
    if (salaryAmount.value === '') {
        return false;
    }
    
    this.budget = +salaryAmount.value;

    this.getExpInc();
    this.getExpensesMonth();
    this.getAddValues();
    this.getAddValues(1);
    this.getInfoDeposit();
    this.getStatusIncome();
    this.getBudget();
    this.showResult();
    this.changeBtn();
}

showResult(){
    const _this = this;
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(',');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = Math.ceil(this.getTargetMonth());
    incomePeriodValue.value = this.calcPeriod();
    periodSelect.addEventListener('input', function(){
        incomePeriodValue.value = _this.calcPeriod();
    });
}

cloneBlocks(key){
    if(key === 1){
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
            cloneExpensesItem.children[0].value = '';
            cloneExpensesItem.children[1].value = '';
            expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
            expensesItems = document.querySelectorAll('.expenses-items');
            
            if (expensesItems.length >= 3) {
                expensesPlus.style.display = 'none';
            } 
    }
    else {
        const cloneIncomeItem = incomeItems[0].cloneNode(true);
            cloneIncomeItem.children[0].value = '';
            cloneIncomeItem.children[1].value = '';
            incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
            incomeItems = document.querySelectorAll('.income-items');
        
            if (incomeItems.length >= 3) {
                incomePlus.style.display = 'none';
            }
    }
}

getInfoDeposit(){
    if (this.deposit) {
        this.percentDeposit = depositPercent.value;
        this.moneyDeposit = depositAmount.value;
    }
}

getExpInc(){
    const count = item =>{
        const startStr = item.className.split('-')[0];
        const itemTitle = item.querySelector(`.${startStr}-title`).value;
        const itemAmount = item.querySelector(`.${startStr}-amount`).value;
        if(itemTitle !== '' && itemAmount !== ''){
            this[startStr][itemTitle] = itemAmount;
        }
    };

    expensesItems.forEach(count);
    incomeItems.forEach(count);

    for(let key in this.income){
        this.incomeMonth += +this.income[key];
    }
}

getAddValues(key){
    const _this = this;
    if(key === 1){
        const addExpensesValue = additionalExpensesValue.value.split(',');
        addExpensesValue.forEach(function(item){
            item = item.trim();
            if(item != ''){
                _this.addExpenses.push(item);
            }
        });
    }else{
        additionalIncomeItem.forEach(function(item){
            const itemValue = item.value.trim();
            if (itemValue != '') {
                _this.addIncome.push(itemValue);
            }
        });
    }
}

getAddIncome(){
    const _this = this;
    additionalIncomeItem.forEach(function(item){
        let itemValue = item.value.trim();
        if (itemValue !== '') {
            _this.addIncome.push(itemValue);
        }
    });
}

getExpensesMonth(){
    for (let key in this.expenses) {
            this.expensesMonth += +this.expenses[key];
        }
}

getBudget() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + (this.moneyDeposit * this.percentDeposit)/12;
    this.budgetDay = Math.floor(this.budgetMonth/30);
}

getTargetMonth() {
    return targetAmount.value/this.budgetMonth;
}

calcPeriod(){
    return this.budgetMonth * periodSelect.value;
}

rangeChange(){
    periodAmount.innerHTML = periodSelect.value;
}

getStatusIncome(){
    if (this.budgetDay >= 800) {
        return ("Высокий уровень дохода");
    }else if (this.budgetDay >= 300 && this.budgetDay < 800){
        return ("Средний уровень дохода");
    }else if (this.budgetDay >= 0 && this.budgetDay < 300){
        return ("Низский уровень дохода");
    }else{
        return ("Что то пошло не так");
    }
}

changeBtn(){
        let inputLeft = document.querySelectorAll('.data input[type="text"]');
        inputLeft.forEach(function(item){
            item.disabled = true;
            });
        start.style.display = 'none';
        cancel.style.display = 'block';
}

resetAll(){
    let inputsAll = document.querySelectorAll('input[type="text"]');
        inputsAll.forEach(function(item){
            item.value = '';
            item.disabled = false;
            });
        start.style.display = 'block';
        cancel.style.display = 'none';
    
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.expensesMonth = 0;
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    }
}
// eventsListeners(){
//     start.addEventListener('click', appData.start.bind(appData));
//     cancel.addEventListener('click', appData.resetAll);
//     expensesPlus.addEventListener('click', this.cloneBlocks.bind(this, 1));
//     incomePlus.addEventListener('click', this.cloneBlocks.bind(this));
//     periodSelect.addEventListener('input', appData.rangeChange);
//     }

depositCheck.addEventListener('change', function(){
    if (depositCheck.checked) {
        depositBank.style.display = 'inline-block';
        depositAmount.style.display = 'inline-block';
        appData.deposit = 'true';
        depositBank.addEventListener('change', function(){
            let selectIndex = this.options[this.selectedIndex].value;
            if (selectIndex === 'other'){
                depositPercent.style.display = 'inline-block';
                depositPercent.value = '';
                depositPercent.disabled = false;
            }else{
                depositPercent.style.display = 'none';
                depositPercent.value = selectIndex;
            }
        });
    }else{
        depositBank.style.display = 'none';
        depositAmount.style.display = 'none';
        depositAmount.value = '';
        appData.deposit = 'false';
    }
});


const appData = new AppData();
appData.eventsListeners();