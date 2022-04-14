# Figure out a better way to do this
# Place to remember bazel commands

list:
	echo "Showing available clis"
	echo ""
	bazelisk query 'kind("alias", devx/...)'

k8s-exec-shell:
	kubectl run -i --tty busybox --image=busybox --restart=Never -- sh

update-proto-source:
	bazel run //orgs/examples/proto:assets
