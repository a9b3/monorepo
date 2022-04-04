load("@bazel_gazelle//:deps.bzl", "go_repository")

def go_dependencies():
    go_repository(
        name = "com_github_code_hex_go_wordwrap",
        importpath = "github.com/Code-Hex/go-wordwrap",
        sum = "h1:yl5fLyZEz3+hPGbpTRlTQ8mQJ1HXWcTq1FCNR1ch6zM=",
        version = "v1.0.0",
    )
    go_repository(
        name = "com_github_code_hex_neo_cowsay_v2",
        importpath = "github.com/Code-Hex/Neo-cowsay/v2",
        sum = "h1:y80Hd9hmB+rsEH/p4c5ti5PbO0PhBmxw4NgbpFZvoHg=",
        version = "v2.0.4",
    )
    go_repository(
        name = "com_github_google_go_cmp",
        importpath = "github.com/google/go-cmp",
        sum = "h1:BKbKCqvP6I+rmFHt06ZmyQtvB8xAkWdhFyr0ZUNZcxQ=",
        version = "v0.5.6",
    )
    go_repository(
        name = "com_github_mattn_go_runewidth",
        importpath = "github.com/mattn/go-runewidth",
        sum = "h1:lTGmDsbAYt5DmK6OnoV7EuIF1wEIFAcxld6ypU4OSgU=",
        version = "v0.0.13",
    )
    go_repository(
        name = "com_github_rivo_uniseg",
        importpath = "github.com/rivo/uniseg",
        sum = "h1:S1pD9weZBuJdFmowNwbpi7BJ8TNftyUImj/0WQi72jY=",
        version = "v0.2.0",
    )
    go_repository(
        name = "org_golang_x_xerrors",
        importpath = "golang.org/x/xerrors",
        sum = "h1:go1bK/D/BFZV2I8cIQd1NKEZ+0owSTG1fDTci4IqFcE=",
        version = "v0.0.0-20200804184101-5ec99f83aff1",
    )
