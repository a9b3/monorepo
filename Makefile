# Figure out a better way to do this
# Place to remember bazel commands

list:
	echo "Showing available clis"
	echo ""
	bazelisk query 'kind("alias", devx/...)'
