setup-repo:
	@pre-commit install

list:
	@echo "====================================================================="
	@echo "Welcome to the monorepo"
	@echo ""
	@echo "Below are all the available CLIs"
	@echo "====================================================================="
	@echo ""
	@bazel query 'kind("alias", //...)'

# Run everytimne you update go.mod
updated-go-deps:
	@bazel run //:gazelle-update-repos
	@bazel run //:gazelle
