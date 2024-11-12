import { ADD_TODO, DELETE_TODO, CHANGE_STATE_TODO } from './actions';
import { PENDING, COMPLETED } from './constants';

/* const DEFAULT_STATE = {
    list: {},
    nextSeq: 0,
}; */
const DEFAULT_STATE = {
    list: {
        0: {id: 0, text: "Leer libros de sw eng", state: COMPLETED},
        1: {id: 1, text: "Convertirme en fullstack", state: COMPLETED},
        2: {id: 2, text: "Ser founder", state: PENDING},
        3: {id: 3, text: "Ganar en grande", state: PENDING},
    },
    nextSeq: 4,
};

export const todosReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case ADD_TODO: {
            return {
                list: {
                    ...state.list,
                    [state.nextSeq]: {
                        id: state.nextSeq,
                        text: action.payload.text,
                        state: action.payload.state,
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
