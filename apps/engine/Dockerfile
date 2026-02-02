FROM python:3.11-slim

WORKDIR /app

# Install TA-Lib dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install TA-Lib C library
RUN wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz && \
    tar -xzf ta-lib-0.4.0-src.tar.gz && \
    cd ta-lib && \
    ./configure --prefix=/usr && \
    make && \
    make install && \
    cd .. && \
    rm -rf ta-lib ta-lib-0.4.0-src.tar.gz

# Set library path
ENV LD_LIBRARY_PATH=/usr/lib:$LD_LIBRARY_PATH

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY src/ ./src/

# Set Python Path to include src directory
ENV PYTHONPATH=/app/src

# Run
EXPOSE 8000
CMD ["python", "src/main.py"]