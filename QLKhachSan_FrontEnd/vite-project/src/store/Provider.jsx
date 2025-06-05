import { use, useReducer } from "react";
import { TodoContext } from "./context";
import { TodoReducer } from "./Reducer";
import { initialState } from "./Constants";

const TodoProvider = ({children}) => {

    const [state,dispatch] = useReducer(TodoReducer, initialState)
    console.log(state)
    return <TodoContext.Provider>
        {children}
    </TodoContext.Provider>
};
export{TodoProvider}