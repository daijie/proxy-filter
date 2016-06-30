# proxy-filter
proxy-filter Verify proxy list

## Installation
`npm i proxy-filter -g`

## Usage
```
  Usage: index --input <file ...> --output <file ...>

  Verify proxy list

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -i, --input <path>               proxy list txt file
    -o, --output <path>              verified proxy list
    -c, --concurrency <concurrency>  concurrency, default 10
    -t, --timeout <n>                timeout(s), default 10s
    -s, --socks5                     default socks5, if ignore protocol
```

## Example
`pfilter --input list.txt --output valid-proxy.txt`

## Supported proxy protocol
If not specified a protocol, it would be http proxy. Otherwise it's a socks5 proxy.

list.txt could be:

```
127.0.0.1:8080
http://127.0.0.1:8080
http://use:password@127.0.0.1:8080
```

If you specified --socks5 option, default protocol would be socks5. (supported in version 1.1.x)

```
127.0.0.1:1080
```

## Unix pipeline example
```
cat list.txt | pfilter > out.txt
```