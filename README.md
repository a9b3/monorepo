# monorepo-2

## Getting Started

All system binaries are managed by nix via shell.nix

1.  Install nix. Make sure flakes is enabled.

    ```
    $ curl -L https://nixos.org/nix/install | sh
    $ nix-env -f ‘<nixpkgs>’ -iA nixUnstable
    $ nix --version
    nix (Nix) 2.4pre20210802_47e96bb
    $ mkdir -p ~/.config/nix
    $ echo 'experimental-features = nix-command flakes' >> ~/.config/nix/nix.conf
    $ mkdir .direnv
    ```

2.  [Install direnv](https://direnv.net/docs/installation.html)

    ```
    direnv allow
    ```

3.  [Install docker](https://docs.docker.com/desktop/mac/install/)
