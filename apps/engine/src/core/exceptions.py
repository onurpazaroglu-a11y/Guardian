class GuardianException(Exception):
    """Base exception"""
    pass


class InvalidSymbolError(GuardianException):
    pass


class InvalidIntervalError(GuardianException):
    pass


class InsufficientDataError(GuardianException):
    pass


class BinanceAPIError(GuardianException):
    pass


class UnauthorizedError(GuardianException):
    pass


class SubscriptionError(GuardianException):
    """Free tier limit exceeded"""
    pass