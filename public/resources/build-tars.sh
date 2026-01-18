#!/bin/bash

# Script to build tar files for all stack directories
# Each tar file contains all files needed for Docker image building

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building tar files for all stacks in: $SCRIPT_DIR"
echo "========================================"

# Loop through all directories in the resources folder
for dir in "$SCRIPT_DIR"/*/ ; do
    # Skip if not a directory
    [ -d "$dir" ] || continue
    
    # Get the directory name without the path
    dirname=$(basename "$dir")
    
    echo ""
    echo "Processing: $dirname"
    
    # Change to the directory
    cd "$dir"
    
    # Remove old tar file if it exists
    if [ -f "${dirname}.tar" ]; then
        echo "  - Removing old ${dirname}.tar"
        rm "${dirname}.tar"
    fi
    
    # Get all files (excluding the tar file itself and hidden files)
    files=$(ls -A | grep -v "^${dirname}.tar$" | grep -v "^\..*")
    
    if [ -z "$files" ]; then
        echo "  - No files found in $dirname, skipping..."
        continue
    fi
    
    # Build the tar file with all files
    echo "  - Creating ${dirname}.tar with files:"
    for file in $files; do
        echo "    * $file"
    done
    
    tar -cvf "${dirname}.tar" $files > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Successfully created ${dirname}.tar"
    else
        echo "  ✗ Failed to create ${dirname}.tar"
    fi
done

echo ""
echo "========================================"
echo "Done! All tar files have been built."
