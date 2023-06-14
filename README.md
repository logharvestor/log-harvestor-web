<p align="center"><a href="https://www.logharvestor.com" target="_blank" rel="noopener" referrerpolicy='origin'><img src="https://i.ibb.co/gwFL3jk/logo-drk.png" alt="LogHarvestor Logo"></a></p>


<p align="center">
  <a href="https://www.linkedin.com/company/log-harvestor" rel="nofollow">
    <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Log Harvestor - LinkedIn"> 
  </a> &nbsp; 
  <a href="https://twitter.com/LogHarvestor" rel="nofollow">
    <img src="https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white" alt="LogHarvestor - Twitter">
  </a> &nbsp; 
  <a href="https://www.youtube.com/channel/UCS9BdZPla9UbUQ3AZJEzVvw" rel="nofollow">
    <img src="https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white" alt="Log Harvestor - You Tube">
  </a>
</p>

# log-harvestor-web

## Documentation
See [API Docs](https://www.logharvestor.com/docs/api) for Log-Harvestor.

This package is specific to `browsers`. Please see our docs for other supported languages and frameworks, or use standard HTTP requests.

## Getting Started
_____________
This package requires that you have a **Log Harvestor** account, and *Forwarder's* created.
If you have not done this yet:
1. Go to [LogHarvestor.com](https://www.logharvestor.com)
2. Register for a new Account (This is free) [Register](https://app.logharvestor.com/register)  
3. Create a new Forwarder - [Link](https://app.logharvestor.com/forwarder)
4. Generate a Forwarder Token


## Adding the script
______________
Now you can use this forwarder token to send logs, by adding providing the token to the script like this.
```Html
<script data-fwd-token="YOUR_TOKEN_HERE" type="module" src="https://unpkg.com/log-harvestor-web@latest" id="log-harvestor" defer></script>
```


## Google Tags
_____________
If you're adding Log Harvestor via Google Tags, add the following script:

```Html
<script data-fwd-token="YOUR_TOKEN_HERE" type="text/javascript" src="https://unpkg.com/log-harvestor-web@latest" id="log-harvestor" defer></script>
```

## Script options
______________
| key | type | description |
| --- | --- |  ---|
| data-fwd-token | *string* |  A token that you have created for your forwarder | 
| data-api-url | *string* | The url that the logs are being sent to **Development purposes**|
| data-debug | *string* | Logs all the events to the console **Development purposes** |



<p align="center"><a href="https://www.logharvestor.com" target="_blank" rel="noopener" referrerpolicy='origin'><img width="100" src="https://i.ibb.co/80sThNP/icon-drk.png" alt="LogHarvestor Logo"></a></p>
