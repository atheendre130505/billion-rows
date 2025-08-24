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

# Copy the execution script into the container and make it executable
COPY runner/execute.sh /usr/local/bin/execute
RUN chmod +x /usr/local/bin/execute

# Set up a non-root user for added security.
# Running processes as a non-root user is a critical security best practice.
RUN useradd -m -s /bin/bash sandboxuser
USER sandboxuser

# Set the working directory for the user's code
# Set the entrypoint to our execution script
ENTRYPOINT ["execute"]