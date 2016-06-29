# proxy-filter
proxy-filter Verify proxy list

```
Usage: pfilter --input <file ...> --output <file ...>

Verify proxy list

Options:

	-h, --help                       output usage information
	-V, --version                    output the version number
	-i, --input <path>               proxy list txt file
	-o, --output <path>              verified proxy list
	-c, --concurrency <concurrency>  concurrency, default 10
	-t, --timeout <n>                timeout(s), default 10s
```

## Example
`pfilter --input list.txt --output valid-proxy.txt`