list:
	@echo "====================================================================="
	@echo "Welcome to the monorepo"
	@echo ""
	@echo "Below are all the available CLIs"
	@echo "====================================================================="
	@echo ""
	@bazel query 'kind("alias", //...)'
