import { ADD_TODO, DELETE_TODO, CHANGE_STATE_TODO, GET_ALL_TODOS, SET_ALL_TODOS } from './actions';

const DEFAULT_STATE = {
    list: {},
    nextSeq: 0,
};

export const todosReducer = (state = DEFAULT_STATE, action) => {
    
    switch (action.type) {
        case GET_ALL_TODOS: {
            return state;
        }
        case SET_ALL_TODOS: {
            return action.payload.todos;
        }
        case ADD_TODO: {
            return {
                list: {
                    ...state.list,
                    [state.nextSeq]: {
                        ...action.payload.todo,
                        id: state.nextSeq,
                    },
                },
                nextSeq: state.nextSeq + 1,
            };
        } 
        case DELETE_TODO: {
            const newTodosList = { ...state.list };
            if (newTodosList[action.payload.id]) {
                delete newTodosList[action.payload.id];
            }
            return {
                list: newTodosList, 
                nextSeq: state.nextSeq,
            };
        } 
        case CHANGE_STATE_TODO: {
            return {
                list: {
                    ...state.list,
                    [action.payload.id]: {
                        ...state.list[action.payload.id],
                        state: action.payload.newTodoState,
                    },
                },
                nextSeq: state.nextSeq,
            };      
        } 
        default: {
            return state;  
        }
    }
};
