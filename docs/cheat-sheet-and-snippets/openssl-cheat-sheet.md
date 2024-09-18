## OpenSSL

#### OpenSSL - Create a Certificate Signing Request(CSR) - Standard RSA 2048
1. Create a Certificate metadata configuration file. This configuration will be added to CSR and will show in the Certificate also  
In the certified name use the domain you are generating the certificate for
```bash
cat > rsa-certificate-metadata.cnf<<EOF
[req]
distinguished_name = req_distinguished_name
prompt = no

[req_distinguished_name]
C   = US
ST  = CA
L   = Mountain View
O   = Shivam Corp, Inc.
CN  = *.shivamanand.com
EOF
```
2. Use Open SSL to create a CSR
```bash
openssl req -new -newkey rsa:2048 -nodes -keyout rsa-domain-private.key -out rsa-certificate-signing-request-for-certificate-authority.csr -config rsa-certificate-metadata.cnf
```
3. To check your request is correct, you can once again use openssl
```bash
openssl req -noout -text -in rsa-certificate-signing-request-for-certificate-authority.csr
# and
openssl asn1parse -i -in rsa-certificate-signing-request-for-certificate-authority.csr
```
4. Take the `rsa-certificate-signing-request-for-certificate-authority.csr ` file and go to your CA to get a Certificate Chain
5. Once you get the certificate from CA Verifiy all combinations are correct. The CSR, Private key and the certificate all should have the same md5. If the match you have all the correct combination of files.
```bash
# Private Key
openssl rsa -noout -modulus -in rsa-domain-private.key | openssl md5

# CSR 
openssl req -noout -modulus -in rsa-certificate-signing-request-for-certificate-authority.csr | openssl md5

# Certificate from CA (Certificate Chain or Leaf Certificate, both will give same result)
openssl x509 -noout -modulus -in certificate-chain.crt | openssl md5
```
6. Keep the private key very safe

#### OpenSSL - Create an ECDSA Certificate Signing Request(CSR)
1. Create a Certificate metadata configuration file. This configuration will be added to CSR and will show in the Certificate also  
In the certified name use the domain you are generating the certificate for
```bash
cat > ecdsa-certificate-metadata.cnf<<EOF
[req]
distinguished_name = req_distinguished_name
prompt = no

[req_distinguished_name]
C   = US
ST  = CA
L   = Mountain View
O   = Shivam Corp, Inc.
CN  = *.shivamanand.com
EOF
```
2. Create CSR
```bash
openssl req -new -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout ecdsa-domain-private.key -out ecdsa-certificate-signing-request-for-certificate-authority.csr -config ecdsa-certificate-metadata.cnf

# or

openssl ecparam -name secp521r1 -genkey -noout -out ecdsa-domain-private.key
openssl req -new -sha256 -key ecdsa-domain-private.key -out ecdsa-certificate-signing-request-for-certificate-authority.csr -config ecdsa-certificate-metadata.cnf

# or

openssl req -new -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -keyout ecdsa-domain-private.key -out ecdsa-certificate-signing-request-for-certificate-authority.csr -config ecdsa-certificate-metadata.cnf

# or 
# very generic
# Generate ECDSA key. curve is to be replaced with: prime256v1, secp384r1, secp521r1, or any other supported elliptic curve:

openssl ecparam -genkey -name prime256v1 | openssl ec -out ecdsa-domain-private.key
openssl req -new -sha256 -key ecdsa-domain-private.key -out ecdsa-certificate-signing-request-for-certificate-authority.csr -config ecdsa-certificate-metadata.cnf
```

secp256r1 and prime256v1 refer to the same elliptic curve. Both terms are used interchangeably in different contexts, but they describe the same curve parameters.

In summary, these terms describe the same curve, but they come from different naming conventions.  

3. To check your request is correct, you can once again use openssl
```bash
openssl req -noout -text -in ecdsa-certificate-signing-request-for-certificate-authority.csr
# and
openssl asn1parse -i -in ecdsa-certificate-signing-request-for-certificate-authority.csr
```
4. Take the `ecdsa-certificate-signing-request-for-certificate-authority.csr ` file and go to your CA to get a Certificate Chain
5. Once you get the certificate from CA Verifiy all combinations are correct. The CSR, Private key and the certificate all should have the same md5. If the match you have all the correct combination of files.
```bash
# Private Key
openssl ec -in ecdsa-domain-private.key -pubout | openssl md5

# CSR 
openssl req -noout -modulus -in openssl req -in ecdsa-certificate-signing-request-for-certificate-authority.csr -noout -pubkey | openssl md5

# Certificate from CA (Certificate Chain or Leaf Certificate, both will give same result)
openssl x509 -in certificate-chain.crt -pubkey -noout | openssl md5
```
6. Keep the private key very safe
#### OpenSSL - Get Certificate details of a domain 
```bash
openssl s_client -connect shivamanand.com:443 -showcerts </dev/null | openssl x509 -outform pem > public_data
openssl x509 -in public_data -noout -text
```
#### OpenSSL - Get Certificate Expiry 
```bash
HOST='shivamanand.com'
curl --max-time 2 --insecure -v https://$HOST 2>&1 | grep expire
```
```bash
openssl s_client -servername shivamanand.com -connect shivamanand.com:443 < /dev/null | openssl x509 -text  | grep "Not After"
```


#### OpenSSL - Get RAW Certificates and Certificate Chain
```bash
# Get individual certificates
openssl s_client -showcerts -verify 5 -connect shivamanand.com:443 < /dev/null |
   awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/{ if(/BEGIN CERTIFICATE/){a++}; out="cert"a".pem"; print >out}'

# Get raw certificate chain
rm -rf certificate-chain
for cert in *.pem; do 
        cat $cert >> certificate-chain
done

# Rename Files Properly
for cert in *.pem; do 
        newname=$(openssl x509 -noout -subject -in $cert | sed -nE 's/.*CN ?= ?(.*)/\1/; s/[ ,.*]/_/g; s/__/_/g; s/_-_/-/; s/^_//g;p' | tr '[:upper:]' '[:lower:]').pem
        echo "${newname}"; mv "${cert}" "${newname}" 
done
```
#### OpenSSL - Verify combinations
```bash
# Private Key
openssl rsa -noout -modulus -in domain-private-key.key | openssl md5

# CSR 
openssl req -noout -modulus -in certificate-signing-request-for-certificate-authority.csr | openssl md5

# Certificate from CA (Certificate Chain or Leaf Certificate, both will give same result)
openssl x509 -noout -modulus -in certificate-chain.crt | openssl md5
```

