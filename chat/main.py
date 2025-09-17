from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from agent import workflow  
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage



CONFIG = {"configurable":{'thread_id':1}}
app = FastAPI()


class Question(BaseModel):
    question:str

@app.get('/')
def home():
    return {"Message":"Fastapi server is Running"}


@app.post('/response')    
async def generate_response(data: Question):
    try:
        input_state = {"messages":[data.question]}
        res = workflow.invoke(input_state, config=CONFIG)
        ans = res['messages'][-1].content

        return JSONResponse(
            status_code=200,
            content={
                'answer':ans
            }
        )
    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.get("/history")
def get_history():
    history_snapshots = list(workflow.get_state_history(config=CONFIG))

    all_messages = history_snapshots[0].values['messages']
    chat_history = []


    question = None
    for msg in all_messages:
        if msg.type == 'human':
            question = msg.content

        elif msg.type == 'ai' and question is not None:
            answer = msg.content
            chat_history.append({'question':question,'answer':answer})
            question = None

    return JSONResponse(status_code=200, content=chat_history)



# @app.get('/history/{thread_id}')
# @app.get("/history")
# def get_history():
#     snapshots = list(workflow.get_state_history(config=CONFIG))  # convert generator → list
    
#     if not snapshots:
#         return JSONResponse(status_code=200, content=[])
    
#     last_snapshot = snapshots[-1]   # take the latest snapshot
#     messages = last_snapshot.values.get("messages", [])

#     history = []
#     q, a = None, None

#     for msg in messages:
#         if isinstance(msg, HumanMessage):
#             q = msg.content
#         elif isinstance(msg, AIMessage):
#             a = msg.content
#             if q:
#                 history.append({"question": q, "answer": a})
#                 q, a = None, None

#     return JSONResponse(status_code=200, content=history)
