import io
import sys
import asyncio
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI(title="VanishBG Full-Res AI API")

origins = [
    "http://localhost:3000"
    "https://vanishbg.vercel.app"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API ini sekarang memproses gambar dengan resolusi penuh!"}

@app.post("/remove-background/", response_class=StreamingResponse)
async def remove_background_api(file: UploadFile = File(...)):
    input_image_bytes = await file.read()

    output_image_bytes = remove(input_image_bytes)

    return StreamingResponse(io.BytesIO(output_image_bytes), media_type="image/png")