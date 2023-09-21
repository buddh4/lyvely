#!/bin/bash

# Function to list files with execute permissions, excluding node_modules
list_executable_files() {
  local dir="$1"

  # Use find to locate files with execute permissions but exclude node_modules
 find "$dir" \( -type d -name "node_modules" -o -type d -name ".git" -o -type d -name "docker" -o -type d -name "dist" \) -prune -o -type f -executable -print
}

# Check if a directory path is provided as an argument
if [ $# -ne 1 ]; then
  echo "Usage: $0 /path/to/start/directory"
  exit 1
fi

# Get the directory path from the argument
start_directory="$1"

# Check if the provided path is a directory
if [ ! -d "$start_directory" ]; then
  echo "Error: '$start_directory' is not a directory."
  exit 1
fi

# List files with execute permissions (excluding node_modules) recursively
list_executable_files "$start_directory"

