#!/bin/sh

while IFS= read -r line
do
    code=$(echo "$line" | sed -n 's/^[[:space:]]*"\([^"]*\)":[[:space:]]*".*$/\1/p')
    name=$(echo "$line" | sed -n 's/^[[:space:]]*"[^"]*":[[:space:]]*"\([^"]*\)".*$/\1/p')

    [ -z "$code" ] && continue

    newname=$(echo "$name" | tr -d ' ')

    if [ -f "${code}.png" ]; then
        mv "${code}.png" "${newname}.png"
        echo "${code}.png -> ${newname}.png"
    fi
done < countries.json

