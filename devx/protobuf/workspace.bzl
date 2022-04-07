load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

def setup_protobuf_workspace():
    """Only used in WORKSPACE to setup protobuf environment"""
    protobuf_deps()
