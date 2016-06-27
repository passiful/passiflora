# passiful/passiflora


## Genearte SSL Keys

【重要】デフォルトでは、 `config/ssl/` に、仮のSSL鍵がコミットされています。
使用前に必ず正規の鍵を再生成してください。

```
$ npm run ssl-key-gen
```

or

```
$ openssl genrsa -aes128 -out config/ssl/server.key 2048
$ openssl req -new -key config/ssl/server.key -sha256 -out config/ssl/server.csr
$ openssl x509 -in config/ssl/server.csr -days 365 -req -signkey config/ssl/server.key -sha256 -out config/ssl/server.crt
```

or

`config/default.json` の *sslOption* に `.key` と `.crt` のパスをセットします。

## Starting Server

```
$ npm start
```
アプリケーションをスタートします。

SSLのパスフレーズを聞かれます。鍵の生成時に指定したパスフレーズを入力してください。

サンプルの仮鍵のパスフレーズは `passiflora` です。


## for developer

```
$ npm run up
```
サーバーを起動します。(`npm start` と同じ)

```
$ npm run dev
```
サーバー起動、ブラウザ起動、 `gulp watch` を同時に実行します。

```
$ npm run test
```
テストスクリプトを実行します。


## ライセンス - License

Copyright (c)2016 Tomoya Koyanagi, and Passiful Project<br />
MIT License https://opensource.org/licenses/mit-license.php


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
