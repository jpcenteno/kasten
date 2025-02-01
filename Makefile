NIX_SHELL = nix develop --command --

# +----------------------------------------------------------------------------+
# + Dependency management                                                      +
# +----------------------------------------------------------------------------+

.PHONY: deps.install
deps.install:
	$(NIX_SHELL) pnpm install --frozen-lockfile

.PHONY: deps.clean
deps.clean:
	rm -rf ./node_modules/ ./packages/*/node_modules

# +----------------------------------------------------------------------------+
# + Dependency management                                                      +
# +----------------------------------------------------------------------------+

.PHONY: build.lib
build.lib:
	$(NIX_SHELL) pnpm run --filter kasten build 

.PHONY: build.cli
build.cli: build.lib
	$(NIX_SHELL) pnpm run --filter kasten-cli build 

.PHONY: build
build: build.cli

# +----------------------------------------------------------------------------+
# + Tests and checks                                                           +
# +----------------------------------------------------------------------------+

.PHONY: test.lib
test.lib:
	$(NIX_SHELL) pnpm --filter kasten test

test.cli:
	$(NIX_SHELL) pnpm --filter kasten-cli test

.PHONY: test
test: test.lib test.cli

.PHONY: check.format
check.format:
	$(NIX_SHELL) pnpm prettier . --check

.PHONY: check.lint
check.lint:
	$(NIX_SHELL) pnpm eslint .

.PHONY: check
check: test check.lint check.format

# +----------------------------------------------------------------------------+
# + Auto fix                                                                   +
# +----------------------------------------------------------------------------+

.PHONY: fix.format
fix.format:
	$(NIX_SHELL) pnpm prettier . --write

.PHONY: fix.lint
fix.lint:
	$(NIX_SHELL) pnpm eslint --fix .

.PHONY: fix
fix: fix.lint fix.format

# +----------------------------------------------------------------------------+
# + Cleanup                                                                    +
# +----------------------------------------------------------------------------+

.PHONY: clean
clean:
	rm -rf ./packages/kasten/dist/ ./packages/kasten-cli/dist ./result/

clean.all: clean deps.clean
