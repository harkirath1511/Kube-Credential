#!/bin/bash
backendDir="./backend"

echo "Finding TypeScript files..."
find "$backendDir" -name "*.ts" -type f -not -path "*/node_modules/*" | while read -r file; do
    echo "Processing $file"
    
    temp_file=$(mktemp)
    
    sed -E 's#//.*$##g' "$file" | sed -E ':a;N;$!ba;s#/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/##g' > "$temp_file"
    
    cat -s "$temp_file" > "$file"
    
    # Clean up the temp file
    rm "$temp_file"
done


