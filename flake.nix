{
  description = "Development shell for this repository.";

  # See link for inputs schema
  # https://nixos.wiki/wiki/Flakes#Basic_project_usage
  inputs = {
    # Use unstable channel for nixpkgs. This channel gets version bumps
    # automatically, keeps the system tools updated but might cause versioning
    # issues.
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  # arguments are defined by inputs above
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system}; in
        {
          devShell = pkgs.mkShell {
            buildInputs = let
              # The version of skaffold in nixpkg is old. This creates a custom derivation
              # to download the latest skaffold binary.
              skaffold = let
                systemKey = with pkgs; {
                  "x86_64-darwin" = {
                    "key" = "darwin-amd64";
                    "sha256" = "872897d78a17812913cd6e930c5d1c94f7c862381db820815c4bffc637c28b88";
                  };
                  "x86_64-linux" = {
                    "key" = "linux-amd64";
                    "sha256" = "3c347c9478880f22ebf95807c13371844769c625cf3ea9c987cd85859067503c";
                  };
                  "aarch64-darwin" = {
                    "key" = "darwin-arm64";
                    "sha256" = "e47329560a557f0f01d7902eae01ab8d40210b40644758f957f071ab8df2ac44";
                  };
                }."${stdenv.system}";
                key = systemKey.key;
                sha256 = systemKey.sha256;
                version = "v1.38.0";
              in
              with pkgs; stdenv.mkDerivation rec {
                name = "skaffold";
                # Need to provide a custom builder since the default assumes there's a
                # makefile in the source
                builder = pkgs.writeText "builder.sh" ''
                  source $stdenv/setup
                  mkdir -p $out/bin
                  cp $src $out/bin/skaffold
                  chmod +x $out/bin/skaffold
                '';
                src = fetchurl {
                  url = "https://github.com/GoogleContainerTools/skaffold/releases/download/${version}/skaffold-${key}";
                  sha256 = "${sha256}";
                };
              };
              sqlc = with pkgs; stdenv.mkDerivation rec {
                name = "sqlc";
                # Need to provide a custom builder since the default assumes there's a
                # makefile in the source
                builder = pkgs.writeText "builder.sh" ''
                  source $stdenv/setup
                  mkdir -p $out/bin
                  cp $src/sqlc $out/bin/sqlc
                  chmod +x $out/bin/sqlc
                '';
                src = fetchzip {
                  url = "https://github.com/kyleconroy/sqlc/releases/download/v1.13.0/sqlc_1.13.0_darwin_amd64.zip";
                  sha256 = "sha256-izOrdNg8ZxXMwSEA0dv5IKOap+POwsM94+Eu9T1Xco4=";
                };
              };
              terraform = with pkgs; stdenv.mkDerivation rec {
                name = "terraform";
                # Need to provide a custom builder since the default assumes there's a
                # makefile in the source
                builder = pkgs.writeText "builder.sh" ''
                  source $stdenv/setup
                  mkdir -p $out/bin
                  cp $src/terraform $out/bin/terraform
                  chmod +x $out/bin/terraform
                '';
                src = fetchzip {
                  url = "https://releases.hashicorp.com/terraform/1.3.2/terraform_1.3.2_darwin_arm64.zip";
                  sha256 = "sha256-KzKA/ORUui/0GHvTO2ox0EV6MM9QWV9n1Lw5OdgP4C4=";
                };
              };
            in
            [
              # A wrapper around bazel that will invoke the version specified in
              # the .bazelversion file in your project directory.
              # https://github.com/bazelbuild/bazelisk
              pkgs.bazelisk
              pkgs.bazel-buildtools

              # cli
              pkgs.gnupg
              pkgs.awscli2
              terraform
              pkgs.terragrunt
              pkgs.kubectx
              pkgs.grpcurl
              pkgs.fd
              pkgs.sd

              # A tool for exploring each layer in a docker image
              pkgs.dive

              # linters
              pkgs.sqlfluff
              pkgs.yamllint

              # go tools
              pkgs.go-migrate
              sqlc

              # source management
              # pkgs.pre-commit

              # skaffold
              skaffold
              pkgs.kubectl
              pkgs.minikube
            ];
            shellHook = ''
              echo "----------------------------------------------------------"
              echo "Run the following to setup dev environment."
              echo "make devenv"
              echo "----------------------------------------------------------"
            '';
          };
        }
      );
}
