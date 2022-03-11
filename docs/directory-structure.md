# Directory Structure

```
./docs/
./libs/
./common/
./<business entities>
./WORKSPACE
./account.hcl
./flake.lock
./flake.nix
./region.hcl
```

`docs/` - Documents

`libs/` - Common library code

`common/` - Common infrastructure (deployments)

**Business Entities**

Except for `docs/` and `libs/` All other top level directories should be business entities.
This is defined as a set of services and libraries that all belong to one business entity.

The top level business entity directories should follow the following structure.

```
./terraform/
./<service or library>/
```