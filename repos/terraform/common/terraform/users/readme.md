## Create a new user

1.  Create a key pair

    ```
    gpg --gen-key
    gpg --export <key_id> -a > pubkeys/<name>
    ```

2.  Add a new entry to ./main.tf
