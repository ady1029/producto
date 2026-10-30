curl --location --request POST 'http://192.168.208.3:9002/api-updater' \
  --header 'Content-Type: application/json' \
  --data-raw '{"basePath": "/product-resource", "url": "http://192.168.208.85:8080/product-resource/v2/api-docs?group=Version-1.0"}'