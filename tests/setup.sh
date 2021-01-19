#!/bin/sh

cd $(dirname $BASH_SOURCE)
cd ..

rm -rf examples/scythe/*
cp -r src examples/scythe/