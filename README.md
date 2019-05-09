
# Architecture

Domain Driven Design (Specified Clean Architeture) with Atomic Design.

| AtomicDesign	| directory									| CleanArchitecture	|
|---------------|-------------------------------------------|-------------------|-------------------------------------------------------|
| atoms			| system/components/`atoms`/xxx.vue			| -					| vuex禁止												|
| molecules		| system/components/`molecules`/xxx.vue		| -					| vuex禁止												|
| organisms		| system/components/`organisms`/xxx.vue		| -					|														|
| templates		| service/presentation/xxx/`view.vue`		| Controllers		| ユーザからの入力をPresenterに渡す。						|
| pages 		| service/presentation/xxx/`presenter.vue`	| Presenters		| Usecaseの結果をViewに反映する。router.jsでRoutingする対象。	|
| -				| service/application/`stores`/xxx.js		| Interactors		| Usecaseを実現する。ApplicationService。					|
| -				| service/domain/`entities`/xxx.js			| Entities			| DomainModel。											|


## Infrastructure

### API Client

#### api.js
axiosをラップしたRESTfulなAPI Client。