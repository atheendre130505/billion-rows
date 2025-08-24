#!/bin/bash

# A script to securely compile and execute user-submitted code in a temporary environment.
#
# Arguments:
#   $1: The programming language (e.g., "java", "python", "c", "cpp").
#   $2: The source code, encoded in base64.
#
# Output:
#   A single JSON object to stdout with the following keys:
#   - "time":   The execution time in seconds (e.g., "0.04"). "0.00" on error.
#   - "output": The standard output produced by the user's code.
#   - "error":  The standard error output (compilation or runtime errors).

set -e

# --- Helper Function ---
# Safely escapes a string for use in a JSON object.
# Handles backslashes, quotes, and control characters.
json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g; s/\r/\\r/g; s/\t/\\t/g'
}

# --- 1. Argument Validation ---
if [ "$#" -ne 2 ]; then
  ERROR_MSG=$(json_escape "Invalid arguments: Language and base64 code are required.")
  echo "{\"time\": \"0.00\", \"output\": \"\", \"error\": \"$ERROR_MSG\"}"
  exit 1
fi

LANGUAGE=$1
ENCODED_CODE=$2
FILENAME=""
EXEC_CMD=""

# --- 2. Create Secure Temporary Directory ---
# `mktemp -d` creates a unique, private directory.
# The `trap` command ensures this directory is automatically cleaned up when the script exits,
# whether it succeeds, fails, or is interrupted.
TEMP_DIR=$(mktemp -d)
trap 'rm -rf -- "$TEMP_DIR"' EXIT
cd "$TEMP_DIR" || exit 1

# --- 3. Decode Code and Set Language-Specific Commands ---
# We store the compile and execution commands in variables to be run later.
# This allows us to handle both compiled and interpreted languages uniformly.
case "$LANGUAGE" in
  "java")
    FILENAME="Solution.java"
    echo "$ENCODED_CODE" | base64 --decode > "$FILENAME"
    # Exit if the decode fails or results in an empty file
    [ -s "$FILENAME" ] || { json_escape "Decoded code is empty." > errors.txt; }
    COMPILE_CMD="javac $FILENAME"
    EXEC_CMD="java Solution"
    ;;
  "python")
    FILENAME="solution.py"
    echo "$ENCODED_CODE" | base64 --decode > "$FILENAME"
    [ -s "$FILENAME" ] || { json_escape "Decoded code is empty." > errors.txt; }
    EXEC_CMD="python3 $FILENAME"
    ;;
  "c")
    FILENAME="solution.c"
    echo "$ENCODED_CODE" | base64 --decode > "$FILENAME"
    [ -s "$FILENAME" ] || { json_escape "Decoded code is empty." > errors.txt; }
    COMPILE_CMD="gcc -O2 $FILENAME -o solution"
    EXEC_CMD="./solution"
    ;;
  "cpp")
    FILENAME="solution.cpp"
    echo "$ENCODED_CODE" | base64 --decode > "$FILENAME"
    [ -s "$FILENAME" ] || { json_escape "Decoded code is empty." > errors.txt; }
    COMPILE_CMD="g++ -O2 $FILENAME -o solution"
    EXEC_CMD="./solution"
    ;;
  *)
    ERROR_MSG=$(json_escape "Unsupported language: $LANGUAGE")
    echo "{\"time\": \"0.00\", \"output\": \"\", \"error\": \"$ERROR_MSG\"}"
    exit 1
    ;;
esac

# --- 4. Compile and Run with Timing ---
# This block conditionally executes the compile and run commands based on the language.
# - If a compile command exists, it's run first, and if successful, the execution command runs.
# - If no compile command exists (interpreted language), only the execution command runs.
# - The user code's stdout is redirected to `output.txt`.
# - The user code's stderr (compilation or runtime errors) is redirected to `errors.txt`.
# - The `time` command itself prints to stderr. We wrap the entire execution in braces `{...}`
#   and redirect its stderr (`2>&1`) to be captured by the `TIME_RESULT` variable.
if [ -n "$COMPILE_CMD" ]; then
  # For compiled languages: compile then execute
  TIME_RESULT=$({ /usr/bin/time -f "%e" bash -c "$COMPILE_CMD && $EXEC_CMD" > output.txt 2> errors.txt; } 2>&1)
else
  # For interpreted languages: just execute
  TIME_RESULT=$({ /usr/bin/time -f "%e" bash -c "$EXEC_CMD" > output.txt 2> errors.txt; } 2>&1)
fi
# --- 5. Read Results ---
OUTPUT=$(cat output.txt)
ERROR_OUTPUT=$(cat errors.txt)
EXEC_TIME="$TIME_RESULT"

# If an error occurred (errors.txt is not empty), the time measurement is not meaningful.
if [ -s errors.txt ]; then
    EXEC_TIME="0.00"
fi

# --- 6. Cleanup ---
# The `trap` command at the beginning handles all cleanup automatically.

# --- 7. Print Final JSON Output ---
JSON_OUTPUT=$(json_escape "$OUTPUT")
JSON_ERROR=$(json_escape "$ERROR_OUTPUT")
JSON_TIME=$(json_escape "$EXEC_TIME")

printf '{"time": "%s", "output": "%s", "error": "%s"}\n' "$JSON_TIME" "$JSON_OUTPUT" "$JSON_ERROR"
