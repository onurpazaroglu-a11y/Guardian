import uvicorn
from core.config import settings


def main():
    uvicorn.run(
        "api.server:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=1 if settings.DEBUG else settings.WORKERS
    )


if __name__ == "__main__":
    main()