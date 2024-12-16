
Process: 
1) Generate self-signed certificates. Alternatives: 

GPT:
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout toDoServer.key -out toDoServer.cert -config san.cnf

Stackoverflow (https://stackoverflow.com/a/60516812/27971560): 
bash generate_certs.sh
Fill relevant info. Supposedly, "common name" must match the domain name in the server (hasn't worked for me)

2) Copy certificate to linux trusted certificates: 
GPT: sudo cp toDoServer.crt /usr/local/share/ca-certificates/
Stackoverflow: sudo cp toDoCA.crt /usr/local/share/ca-certificates/

3) Trust server/CA in the browser: go to chrome://settings/certificates and import it in "Servers" or "Authorities"

4) Uncomment code in http.js (protocol, module.exports.ssl, redirectHTTPToHTTPS) and env variables in the front-end

Troubleshooting:
* Stablish connection with openssl secure client: openssl s_client -connect localhost:1340
* Hit endpoint without postman: curl -k https://localhost:1340/auth/status
* Hit with postman configuring: Settings > Enable SSL certificate verification > FALSE
* Allow invalid certificates in chrome: chrome://flags/#allow-insecure-localhost > Allow invalid certificates for resources loaded from localhost > Enabled
* Delete domani security policies: chrome://net-internals/#hsts > Domain: localhost > Delete
* Just use http locally

Sources: 
https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate
https://stackoverflow.com/questions/46349459/chrome-neterr-cert-authority-invalid-error-on-self-signing-certificate-at-loca
https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/


