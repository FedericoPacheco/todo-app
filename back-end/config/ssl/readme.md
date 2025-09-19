Run on Windows Powershell as Administrator:

0. Install chocolatey package manager:  
    [https://chocolatey.org/install#individual](https://chocolatey.org/install#individual)
1. Install tool:  

    ```powershell
    choco install mkcert
    ```

2. Create locally-trusted Certificate Authority:  

    ```powershell
    mkcert -install
    ```

3. Generate certificate signed by the CA:  

    ```powershell
    mkcert -cert-file ./config/ssl/localhost.pem -key-file ./config/ssl/localhost-key.pem localhost 127.0.0.1
    ```

4. Copy CA certificate to back-end and front-end sub-repos:  

    ```powershell
    $ca=( & mkcert -CAROOT ); Copy-Item "$ca\rootCA.pem" ".\config\ssl\rootCA.pem"
    $ca=( & mkcert -CAROOT ); Copy-Item "$ca\rootCA.pem" "..\front-end\ssl\rootCA.pem"
    ```

5. Copy application server certificate and key to front-end sub-repo to also use it on the web server:  

    ```powershell
    Copy-Item ".\config\ssl\localhost.pem" "..\front-end\ssl\localhost.pem"
    Copy-Item ".\config\ssl\localhost-key.pem" "..\front-end\ssl\localhost-key.pem"
    ```

Library source code:  
[https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)
