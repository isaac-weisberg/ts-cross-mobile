.PHONY: build dist

def: quick

quick: sample_proj

sample_proj:
	npx ts-node ./src/index.ts \
		./sample_project/index.ts \
		./build/SampleProjectGenerated.swift \
		./build/SampleProjectGenerated.kt

full: build run_build

build:
	npx tsc --project ./tsconfig.prod.json

run_build: build
	node ./dist/bin/index.js \
		./sample_project/index.ts \
		./build/SampleProjectGenerated.swift \
		./build/SampleProjectGenerated.kt


clean: clean_dist clean_build
	

clean_build:
	-rm -rf ./build/**

clean_dist:
	-rm -rf ./dist/**