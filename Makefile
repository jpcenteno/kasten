NIX_SHELL = nix develop --command --

.PHONY: build.lib
build.lib:
	$(NIX_SHELL) pnpm run --filter kasten build 

.PHONY: build.cli
build.cli: build.lib
	$(NIX_SHELL) pnpm run --filter kasten-cli build 

.PHONY: build
build: build.cli

.PHONY: clean
clean:
	rm -rf ./packages/kasten/dist/ ./packages/kasten-cli/dist
