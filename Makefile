.PHONY: build dist

def: quick

quick: sample_proj

sample_proj:
	npx ts-node ./src/index.ts \
		./sample_project/src/index.ts \
		./sample_project/build/SampleProjectGenerated.swift \
		./sample_project/build/SampleProjectGenerated.kt

full: build run_build

build:
	npx tsc --project ./tsconfig.prod.json

run_build: build
	node ./dist/bin/index.js \
		./sample_project/src/index.ts \
		./sample_project/build/SampleProjectGenerated.swift \
		./sample_project/build/SampleProjectGenerated.kt


clean: clean_dist clean_sample_build

clean_sample_build:
	-rm -rf ./sample_project/build/**

clean_dist:
	-rm -rf ./dist/**
