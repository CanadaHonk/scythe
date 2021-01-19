#!/bin/sh

cd $(dirname $BASH_SOURCE)
cd ..

rm -rf tests/scythe/*
cp -r src/* tests/scythe/