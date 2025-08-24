# Use a minimal, secure base image
FROM debian:bullseye-slim

# Install necessary dependencies including compilers for Java, C, C++, and Python
# - `openjdk-17-jdk`: Java Development Kit
# - `gcc`: C compiler
# - `g++`: C++ compiler
# - `python3`: Python interpreter
# - `time`: For accurately measuring execution time
# `procps`: Provides `ps` and other utilities, useful for monitoring
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-17-jdk \
    gcc \
    g++ \
    python3 \
    time \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire build context to a temporary directory
COPY . /tmp/buildcontext

# Move the execution script to its final destination and make it executable
RUN mv /tmp/buildcontext/runner/execute.sh /usr/local/bin/execute
RUN chmod +x /usr/local/bin/execute

# Create the application directory
RUN mkdir /app

# List the contents of the build context for debugging
RUN ls -R /tmp/buildcontext
# Move the Python server script to its final destination
RUN mv /tmp/buildcontext/runner/server.py /app/server.py

# Set up a non-root user for added security.
# Running processes as a non-root user is a critical security best practice.
RUN useradd -m -s /bin/bash sandboxuser
USER sandboxuser

# Set the entrypoint to run the Python server
# The Python server will call the execute.sh script
ENTRYPOINT ["python3", "/app/server.py"]