"""
Main entry point for the DAO Treasury Management system.
"""

import uvicorn

def main():
    """Run the FastAPI application"""
    uvicorn.run(
        "src.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    main() 