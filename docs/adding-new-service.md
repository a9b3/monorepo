# Adding New Service

1. Create your repository in the /repos directory.
2. Add the k8s directory k8s/base k8s/local with k8s manifests that run your
   service.
3. Create a oci_image target that runs your service.
4. Add an oci_tarball target to project root's BUILD.bazel file.
5. Add the new target to /skaffold.yaml
