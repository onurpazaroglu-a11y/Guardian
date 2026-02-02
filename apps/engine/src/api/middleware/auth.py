from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from core.config import settings

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify JWT token from Supabase
    For development, if token is 'dev-token', allow bypass.
    """
    token = credentials.credentials
    
    if settings.DEBUG and token == "dev-token":
        return {"sub": "dev-user", "email": "dev@example.com", "tier": "pro"}

    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_aud": False} # Supabase tokens might have different audience
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
