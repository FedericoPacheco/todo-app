######################
# Become a Certificate Authority
######################

CA=toDoCA
# Generate private key
openssl genrsa -des3 -out $CA.key 2048
# Generate root certificate
openssl req -x509 -new -nodes -key $CA.key -sha256 -days 825 -out $CA.pem

######################
# Create CA-signed certs
######################

NAME=toDoServer # Use your own domain name
# Generate a private key
openssl genrsa -out $NAME.key 2048
# Create a certificate-signing request
openssl req -new -key $NAME.key -out $NAME.csr
# Create a config file for the extensions
>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $NAME # Be sure to include the domain name here because Common Name is not so commonly honoured by itself
EOF
# Create the signed certificate
openssl x509 -req -in $NAME.csr -CA $CA.pem -CAkey $CA.key -CAcreateserial \
-out $NAME.crt -days 825 -sha256 -extfile $NAME.ext