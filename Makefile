# Figure out a better way to do this
# Place to remember bazel commands

list:
	@echo "====================================================================="
	@echo "Welcome to the monorepo"
	@echo ""
	@echo "Below are all the available CLIs"
	@echo "====================================================================="
	@echo ""
	@bazelisk query 'kind("alias", //...)'

k8s-exec-shell:
	kubectl run -i --tty busybox --image=busybox --restart=Never -- sh

update-proto-source:
	bazel run //orgs/examples/proto:assets

lint:
	pre-commit run --all-files

# To add a new go dep.
#
# 	go get "<dep>" && make update-go-deps
#
update-go-deps:
	go mod tidy
	go mod verify
	bazel run //:gazelle-update-repos

update-js-deps:
	npx pnpm import
