import { createStore, combineReducers } from 'redux';
import uuid from 'uuid';



//--- Actions

// ADD_EXPENSE
const addExpense =(
    {
        description='',
        note='',
        amount = 0,
        createdAt=0
     } = {}
    ) => ({
    type: 'ADD_EXPENSE',
    expense:{
        id: uuid(),
        description,
        note,
        amount,
        createdAt
    }
})

// REMOVE_EXPENSE
const removeExpense =({ id }={}) =>({
    type: 'REMOVE_EXPENSE',
    id
    // expense:{
    //     id
    // }
})
// EDIT_EXPENSE
const editExpense = (id, updates) => ({
    type:'EDIT_EXPENSE',
    id,
    updates
})

// SET_TEXT_FILTER
const setTextFilter = (text ='') => ({
    type: 'SET_TEXT_FILTER',
    text
})
// SORT_BY DATE
const sortByDate = () => ({
    type: 'SORT_BY_DATE',
})
// SORT_BY_AMOUNT
const sortByAmount = () => ({
    type: 'SORT_BY_AMOUNT',
})
// SET_START_DATE
const setStartDate = (startDate) => ({
    type: 'SET_START_DATE',
    startDate
})
// SET_END_DATE
const setEndDate = (endDate) =>({
    type: 'SET_END_DATE',
    endDate
})

// Expenses Reducer
const expensesReducerDefaultState = [];

const expensesReducer = (state = expensesReducerDefaultState, action) => {
    switch(action.type){
        case 'ADD_EXPENSE':
            return [
                ...state,
                action.expense
            ];
        case 'REMOVE_EXPENSE':
            return state.filter(({ id }) => id !== action.id)
        case 'EDIT_EXPENSE':
            return state.map((expense)=>{
                if(expense.id === action.id){
                    return {
                        ...expense,
                        ...action.updates
                    };
                } else {
                    return expense;
                }
            });
        default:
            return state;
    }
};

// Filters Reducers
const filterstReducerDefaultState={
    text: '',
    sortBy: 'date',
    startDate: undefined,
    endDate: undefined
};

const filtersReducer = (state = filterstReducerDefaultState, action)=>{
    switch(action.type){
        case 'SET_TEXT_FILTER':
            return {
                ...state,
                text: action.text
            }
        case 'SORT_BY_DATE':
            return {
                ...state,
                sortBy: 'amount'
            }
        case 'SORT_BY_AMOUNT':
            return {
                ...state,
                sortBy: 'date'
            }
        case 'SET_START_DATE':
            return {
                ...state,
                startDate: action.startDate
            }
        case 'SET_END_DATE':
            return {
                ...state,
                endDate: action.endDate
            }
        default:
            return state;
    }
};

// Get Visable expenses
const getVisableExpenses = (expenses, {text, sortBy, startDate, endDate }) => {
    return expenses.filter((expense) => {
        const startDateMatch = typeof startDate !== 'number' || expense.createdAt >= startDate;
        const endDateMatch = typeof endDate !== 'number' || expense.createdAt <= endDate;
        const textMatch = expense.description.toLowerCase().includes(text.toLowerCase());


        return startDateMatch && endDateMatch && textMatch;
    }).sort((a,b)=>{
        if (sortBy === 'date'){
            return a.createdAt < b.createdAt ? 1 : -1;
        }else if(sortBy === 'amount'){
            return a.amount < b.amount ? 1: -1;
        }
    });
};

// Store Creation. This is using combinedReducers so we can have multiple reducers.
const store = createStore(
    combineReducers({
        expenses: expensesReducer,
        filters: filtersReducer
    })
);

store.subscribe(()=> {
    const state = store.getState();
    const visableExpenses = getVisableExpenses(state.expenses, state.filters);
    console.log(visableExpenses);
 });

 const expense01 = store.dispatch(addExpense({ description:'Rent', amount: 100, createdAt: 1000 }));
 const expense02 = store.dispatch(addExpense({ description:'Coffee', amount: 300, createdAt: -200 }));
 const expense03 = store.dispatch(addExpense({ description:'Hat', amount: 500, createdAt: 800 }));

// store.dispatch(removeExpense({id:expense01.expense.id}));
// store.dispatch(editExpense(expense02.expense.id, { amount: 500 }))

//store.dispatch(setTextFilter('e'));
// store.dispatch(setTextFilter());

store.dispatch(sortByAmount('amount'));
store.dispatch(sortByDate('date'));

// store.dispatch(setStartDate(-2000));
// store.dispatch(setStartDate());
// store.dispatch(setEndDate(900));

//console.log(expense01.expense.id)

const demoState = {
    expenses:[{
        id: '1234',
        description: 'Rent',
        note: 'this is a note',
        amount: 54500,
        createdAt: 0
    }],
    filters: {
        text: 'rent',
        sortBy: 'amount',// date or amount
        startDate: undefined,
        endDate: undefined
    }
};