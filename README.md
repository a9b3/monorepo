# monorepo

## First time setup

All system binaries are managed by nix via shell.nix

1.  Install nix which is used to manage system binaries in a declarative
    way.Check `./flake.nix` for the list of system binaries that are managed by nix.

    ```sh
    curl -L https://nixos.org/nix/install | sh
    nix-env -f ‘<nixpkgs>’ -iA nixUnstable
    mkdir -p ~/.config/nix
    echo 'experimental-features = nix-command flakes' >> ~/.config/nix/nix.conf
    mkdir .direnv
    ```

2.  [Install direnv](https://direnv.net/docs/installation.html) used to
    automatically run commands in project directory. This is used to load the
    nix environment making the system binaries available.

    ```sh
    direnv allow
    ```

3.  [Install docker](https://docs.docker.com/desktop/mac/install/)
