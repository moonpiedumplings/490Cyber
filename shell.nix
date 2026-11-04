{ pkgs ? import <nixpkgs> { } }:

let

  my-python-packages = ps: with ps; [
    django_6
  ];
  #vagrantPackage = if builtins.pathExists /etc/wsl.conf then "" else "vagrant";
  vagrantDefaultProvider = if builtins.pathExists /etc/wsl.conf then "virtualbox" else "libvirt";

in
with pkgs;
mkShell {
  buildInputs = [
    (pkgs.python312.withPackages my-python-packages)
    django-upgrade

    pkgs.nodejs
  ];
}
