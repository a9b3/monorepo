{
  description = "Development shell for this repository.";

  # See link for inputs schema
  # https://nixos.wiki/wiki/Flakes#Basic_project_usage
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };

  # arguments are defined by inputs above
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system}; in
        {
          devShell = pkgs.mkShell {
            shellHook = ''
              echo "---------------------------------------------"
              echo "Welcome to the monorepo"
              echo $0
              echo ""
              echo "---------------------------------------------"
            '';
            buildInputs = let

            in
            [
              # A wrapper around bazel that will invoke the version specified in
              # the .bazelversion file in your project directory.
              # https://github.com/bazelbuild/bazelisk
              pkgs.bazelisk
              # gpg cli
              pkgs.gnupg
              pkgs.awscli2
              pkgs.terraform
              pkgs.terragrunt
              pkgs.kubectx
              pkgs.grpcurl
            ];
          };
        }
      );
}
