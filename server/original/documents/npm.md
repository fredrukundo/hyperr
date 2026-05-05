# How global install works

npm install -g nodemon

You are telling npm:

“Install this package in a global system location so I can use it everywhere.”

# Where it gets installed

# Linux / macOS:

Usually here:

/usr/local/lib/node_modules/

# Windows:

C:\Users\<you>\AppData\Roaming\npm\node_modules\

# And executables go into:

/usr/local/bin/

# Check global packages

npm list -g

Shows all globally installed tools.

npm list -g --depth=0

“Show only the top-level (direct) global packages, not their dependencies.”

# --depth=0

Without --depth=0, npm shows a full tree:

nodemon
 ├── chokidar
 ├── debug
 ├── semver
 └── ...

With --depth=0, it shows only:

nodemon

# depth controls how many levels of that tree you want to see.




