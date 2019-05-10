
# Architecture

Domain Driven Design (Specified Clean Architeture) with Atomic Design.

| AtomicDesign	| directory									| CleanArchitecture	|                                                       |
|---------------|-------------------------------------------|-------------------|-------------------------------------------------------|
| atoms			| system/components/`atoms`/xxx.vue			| -					| vuex禁止												|
| molecules		| system/components/`molecules`/xxx.vue		| -					| vuex禁止												|
| organisms		| system/components/`organisms`/xxx.vue		| -					| vuex禁止												|
| templates		| service/presentation/xxx/`view.vue`		| Controllers		| ユーザからの入力をPresenterに渡す。						|
| pages 		| service/presentation/xxx/`presenter.vue`	| Presenters		| Usecaseの結果をViewに反映する。router.jsでRoutingする対象。	|
| -				| service/application/`stores`/xxx.js		| Interactors		| Usecaseを実現する。ApplicationService。					|
| -				| service/domain/`entities`/xxx.js			| Entities			| DomainModel。											|


## Infrastructure

### API Client

#### api.js
axiosをラップしたRESTfulなAPI Client。


# ローカルでの開発について

## 既知のエラー

### ブラウザの開発者ツール上

下記はどちらもローカルでのみ発生する（deploy後のTaschelでは発生していない）ので無視して良いです。

```
Refused to apply style from 'http://localhost:3000/app/styles/app.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
```

```
GET http://localhost:3000/app/images/icon/manifest.json 404 (Not Found)
```