{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import (inputs.nixpkgs) { inherit system; });
        nodejs = pkgs.nodejs_23;
        pnpm = pkgs.pnpm.override { inherit nodejs; };
      in {
        devShell = pkgs.mkShell {
          buildInputs = [
            nodejs
            pnpm
          ];
        };
      }
    );
}
