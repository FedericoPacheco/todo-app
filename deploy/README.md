# Deployment Notes

## Server setup

- Use Ubuntu 24.04 LTS for the AWS Lightsail instance: <https://docs.aws.amazon.com/lightsail/latest/userguide/compare-options-choose-lightsail-instance-image.html>
- Install docker and docker compose. See: <https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository>
- Clone the repository inside the home directory:

    ```bash
    git clone https://github.com/FedericoPacheco/todo-app.git
    ```

## Networking

- Ensure the following ports are open on the server's firewall:
  - HTTP: 80
  - HTTPS: 443
  - SSH: 22

- Ensure the server has a static public IP address. Otherwise DNS will fail.

- Ensure there's a DNS A record in Porkbun pointing to the server's static IP.
See: <https://kb.porkbun.com/article/231-how-to-add-dns-records-on-porkbun>

## Nginx static files serving + reverse proxy

This is already done in the `docker-compose.prod.yaml` and `nginx/nginx.conf` files.
Sources:

- <https://www.digitalocean.com/community/tutorials/how-to-run-nginx-in-a-docker-container-on-ubuntu-22-04>
- <https://www.digitalocean.com/community/tutorials/understanding-the-nginx-configuration-file-structure-and-configuration-contexts>
- <https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04>
- <https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04>
- <https://github.com/typicode/json-server>
- <https://hub.docker.com/r/clue/json-server>

## SSL Certificate Setup (acme.sh + Let's Encrypt)

Source: <https://www.endpointdev.com/blog/2024/06/docker-nginx-acme/>

1. Install acme.sh inside server:

    ```bash
    curl https://get.acme.sh | sh -s email=federico.ignacio.pacheco.pilan@gmail.com
    source ~/.bashrc # Reload shell
    ```

2. Set Let's Encrypt as CA:

    ```bash
    acme.sh --set-default-ca --server letsencrypt
    ```

3. Start nginx first (needed for webroot validation):

    ```bash
    sudo docker compose -f docker-compose.prod.yaml up -d
    ```

4. Issue certificate for subdomain:

    ```bash
    acme.sh --issue -d todo.federicopacheco.dev -w ~/todo-app/deploy/nginx/dist --keylength 4096 --force
    ```

5. Install certificate and set auto-reload:

    ```bash
    acme.sh --install-cert -d todo.federicopacheco.dev --key-file ~/todo-app/deploy/nginx/ssl/key.pem --fullchain-file ~/todo-app/deploy/nginx/ssl/cert.pem --reloadcmd "sudo docker exec todo-nginx nginx -s reload"
    ```

6. After updating nginx.conf with SSL config, restart:

    ```bash
    sudo docker compose -f docker-compose.prod.yaml down
    sudo docker compose -f docker-compose.prod.yaml up -d
    ```

### Troubleshooting

- Check nginx config is valid:

    ```bash
    sudo docker exec todo-nginx nginx -t
    ```

- Check nginx logs:

    ```bash
    sudo docker compose -f docker-compose.prod.yaml logs todo-nginx
    ```

- Verify certificate files exist in the container:

    ```bash
    sudo docker exec todo-nginx ls -la /etc/nginx/ssl/
    ```

- Check certificate location in server:

    ``` bash
    acme.sh --info -d todo.federicopacheco.dev
    ```

## Environment Variables

- Do NOT use special characters on `DATABASE_PASSWORD` nor `SESSION_PASSWORD`. They need to be URL encoded, otherwise they trigger A LOT of errors. Use a password manager's generator excluding special characters instead.

- Generate crypto-secure random string for `SESSION_SECRET`:

    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```

- Production environment variables are stored as secrets on GitHub Actions, as well as in my own password manager. `.env` files are disregarded.
