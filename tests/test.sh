#!/bin/sh

cd $(dirname $BASH_SOURCE)

bash setup.sh

for D in *; do [ -d "${D}" ] && echo "${D}" && node "../src/index.js" "${D}/index.js"; done