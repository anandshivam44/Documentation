## OpenSSL

#### OpenSSL - Create a Certificate Signing Request(CSR) - Standard RSA 2048
1. Create a Certificate metadata configuration file. This configuration will be added to CSR and will show in the Certificate also  
In the certified name use the domain you are generating the certificate for
```bash
cat > certificate-metadata.cnf<<EOF
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
openssl req -new -newkey rsa:2048 -nodes -keyout domain-private-key.key -out certificate-signing-request-for-certificate-authority.csr -config certificate-metadata.cnf
```
3. To check your request is correct, you can once again use openssl
```bash
openssl req -noout -text -in certificate-signing-request-for-certificate-authority.csr
# and
openssl asn1parse -i -in certificate-signing-request-for-certificate-authority.csr
```
3. Take the `certificate-signing-request-for-certificate-authority.csr ` file and go to your CA to get a Certificate Chain
4. Keep the private key very safe

#### OpenSSL - Create an ECDSA Certificate Signing Request(CSR)
```bash
openssl req -new -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout ecdsa-domain-private.key -out ecdsa-certificate-signing-request-for-certificate-authority.csr -config certificate-metadata.cnf
# or
openssl ecparam -name secp521r1 -genkey -noout -out ecdsa-domain-private.key
openssl req -new -sha256 -key ecdsa-domain-private.key -out ecdsa-certificate-signing-request-for-certificate-authority.csr -config certificate-metadata.cnf
# or
openssl req -new -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -keyout ecdsa-domain-private.key -out ecdsa-certificate-signing-request-for-certificate-authority.csr -config certificate-metadata.cnf
```
secp256r1 and prime256v1 refer to the same elliptic curve. Both terms are used interchangeably in different contexts, but they describe the same curve parameters.

In summary, these terms describe the same curve, but they come from different naming conventions.
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

