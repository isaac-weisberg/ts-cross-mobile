def: sample_proj

sample_proj:
	npx ts-node ./src/index.ts \
		./sample_project/index.ts \
		./build/SampleProjectGenerated.swift \
		./build/SampleProjectGenerated.kt
