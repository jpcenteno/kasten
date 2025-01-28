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
        pnpm = pkgs.pnpm_9.override { inherit nodejs; };
      in {
        devShell = pkgs.mkShell {
          buildInputs = [
            nodejs
            pnpm

            pkgs.typescript-language-server
          ];
        };

        packages.default = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "kasten-cli";
          version = "0.1.0";
          src = ./.;
          nativeBuildInputs = [ nodejs pnpm.configHook ];
          pnpmWorkspaces = [ "kasten" "kasten-cli" ];
          pnpmDeps = pnpm.fetchDeps {
            inherit (finalAttrs) pname version src pnpmWorkspaces;
            hash = "sha256-1vLl/Cnc/h/6zsvlaks5b24jgu8FhFanzosdyY9Okuo=";
          };
          buildPhase = ''
            runHook preBuild
            pnpm --filter=kasten build
            pnpm --filter=kasten-cli build
            runHook postBuild
          '';
          installPhase = let
            inherit (finalAttrs) pname;
          in ''
            mkdir -p $out/bin $out/lib/${pname}
            cp -r packages node_modules $out/lib/${pname}

            # We need to make a wrapper script because TSC doesn't write
            # shebangs.
            cat <<EOF > $out/bin/${pname}
            #! ${pkgs.bash}/bin/bash
            exec ${nodejs}/bin/node ${placeholder "out"}/lib/${pname}/packages/${pname}/dist/index.js "\$@"
            EOF
            chmod +x $out/bin/${pname}
          '';
        });
      }
    );
}
