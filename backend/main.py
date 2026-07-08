from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from engine import generate_narration_script

app = FastAPI()

# Allow CORS for the frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RolesConfig(BaseModel):
    Percival: bool = False
    Morgana: bool = False
    Mordred: bool = False
    Oberon: bool = False

@app.post("/api/generate-script")
def get_script(roles: RolesConfig):
    # Convert Pydantic model to dictionary
    roles_dict = roles.model_dump()
    # Generate the script based on the roles
    script = generate_narration_script(roles_dict)
    return {"script": script}
