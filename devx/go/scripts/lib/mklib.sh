#!/bin/bash
set -eu

NAME="$1"
OUTPUT_DIR="$BUILD_WORKING_DIRECTORY/$NAME"

mkdir "$OUTPUT_DIR"
cp "devx/go/scripts/lib/lib.go" "$OUTPUT_DIR/$NAME.go"
cp "devx/go/scripts/lib/lib_test.go" "$OUTPUT_DIR/${NAME}_test.go"

sed -i "s/foo/$NAME/g" "$OUTPUT_DIR/$NAME.go"
sed -i "s/foo/$NAME/g" "$OUTPUT_DIR/${NAME}_test.go"

cd "$OUTPUT_DIR"
bazelisk run //:gazelle
