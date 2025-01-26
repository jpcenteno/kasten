# Kasten

## TODO

- [ ] Main entities.
  - [ ] Zettelkasten (In progress)
  - [ ] Zettel
    - [ ] Note
      - [ ] Use MDX format.
      - [ ] Parse metadata.
    - [ ] Reference
    - [ ] Attachment

- [ ] Make the CLI skeleton
  - [ ] Note
    - [x] `new`: Create a new note.
    - [x] `list`: Get a list of note paths and their titles.
  - [ ] Reference
    - New
    - View
    - Search
    - List
  - [ ] Attachments

- [ ] Features after the basics are covered:
  - [ ] Allow the user to create notes from templates.
  - [ ] Generate a graph of links between notes.
  - [ ] Refactor the library into a clean architecture:
    - [ ] Convert `Zettelkasten` into an interface.
    - [ ] Make the `Zettelkasten` implementations independent of storage backend.

- [x] Bootstrap the development environment
  - [x] Flake skeleton.
  - [x] JS runtime (node, pnpm)
  - [x] Testing (Jest)
  - [x] Linting (Eslint)
  - [x] Formatting (Prettier)
  - [x] Typescript compiler (TSC)
  - [x] Gitignore.
  - [x] Package the CLI (Nix Flakes).
