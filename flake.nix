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
            buildInputs =
              let
                sqlc = with pkgs; stdenv.mkDerivation {
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
                terraform = with pkgs; stdenv.mkDerivation {
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
                pkgs.tree

                # A tool for exploring each layer in a docker image
                pkgs.dive

                # linters
                pkgs.sqlfluff
                pkgs.yamllint

                # go tools
                pkgs.gopls
                pkgs.go-migrate
                sqlc

                # source management
                pkgs.pre-commit

                pkgs.skaffold
                pkgs.kubectl
                pkgs.minikube

                # ---------------------------------------------------------------
                # Lang Support
                # ---------------------------------------------------------------
                pkgs.go
                pkgs.nodejs_20
                pkgs.nodejs_20.pkgs.pnpm
              ];
            shellHook = ''
              echo "----------------------------------------------------------"
              echo "Run the following to setup dev environment."
              echo "make devenv"
              echo "----------------------------------------------------------"


              eval $(minikube docker-env)
            '';
          };
        }
      );
}
