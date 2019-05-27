
# Environment

| product   | version               |
|-----------|-----------------------|
| NodeJS    | v10.15.3 ***must**    | 
| npm       | 6.4.1                 |
| yarn      | 1.15.2                |

IDEは Visual Studio Code。

## VisualStudioCode

### vue
Vueのハイライトに[vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)が必要。
設定については[こちら](https://vuejs.github.io/vetur/linting-error.html#error-checking)。

### eslint

VisualStudioCodeに以下のpluginsが必要。
- [vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

ルールは `.eslintrc.js` で規定している。Vueファイル向けに、eslintのplugin（eslint-plugin-vue）をnpmで追加している（[ドキュメント](https://eslint.vuejs.org/user-guide/)）。

**参考**
- [VisualStudioCode向け設定](https://www.haneca.net/visual-studio-code-eslint-auto-format-setup/)
- [Vue向け設定](https://qiita.com/sympe/items/f6473c45d45c7be271e5)
- [VisualStudioCodeでもVueのLintを可能にする](https://qiita.com/taqm/items/316e7fe51ad9d9a21244)
- [VisualStudioCodeでもVueのLintを可能にする](https://qiita.com/neuwell/items/27ea4efee9f67b33e053)
- [VisualStudioCodeでもVueのLintを可能にする](https://qiita.com/fukasawah/items/cfff8957f3956850dc7e)


[ルール設定例](https://qiita.com/khsk/items/0f200fc3a4a3542efa90)

# Architecture

Domain Driven Design (Specified Clean Architeture) with Atomic Design.

| AtomicDesign	| directory									| CleanArchitecture	| Vue/Vuex      |                                                                                       |
|---------------|-------------------------------------------|-------------------|---------------|---------------------------------------------------------------------------------------|
| atoms			| system/components/`atoms`/xxx.vue			| -					| VueComponent  | vuex禁止												                                |
| molecules		| system/components/`molecules`/xxx.vue		| -					| VueComponent  | vuex禁止												                                |
| organisms		| system/components/`organisms`/xxx.vue		| -					| VueComponent  | vuex禁止												                                |
| templates		| service/presentation/xxx/`view.vue`		| Controllers		| VueComponent  | ユーザからの入力をPresenterに渡す。vuexはgetterは呼んで良い（action/mutationは禁止）。          |
| pages 		| service/presentation/xxx/`presenter.vue`	| Presenters		| VueComponent  | Usecaseの結果をViewに反映する。action（mutation）を呼んで良い。router.jsでRoutingする対象。もし Entity を import してインスタンス生成などしていたら、その処理は ApplicationServiceの範疇なので Interactor でやらせる。  |
| -				| service/application/`stores`/xxx.js		| Interactors		| Store         | Usecaseを実現する。ApplicationService。					                              |
| -				| service/domain/`entities`/xxx.js			| Entities			| -             | DomainModel。ドメイン知識による業務ロジックはここに持たせる。		                            |


## Presenter

```presenter.vue
<template lang="pug">
	//- hogehoge-view(:schema="schema", :entity="entity" @add="onAdd" @select="onSelect")
	hogehoge-view
</template>
<script>
	import Vue from "vue";
    import AbstractPresenter from "system/mixins/abstractPresenter";
	import HogehogeView from "./view"
	
	// import schema from "./schema";
    import { mapActions } from "vuex";

    import { 
        ユースケース
	} from "service/application/usecases";
    
	const _ = Vue.prototype._;

	export default {
		name : "Hogehoge"
		, mixins : [ AbstractPresenter ]
		, components : {
			HogehogeView
		}
		, data() {
			return {
				schema: schema
				, entity: null
			};
		}
		, methods : {
            ...mapActions({
                ユースケース
			})
			// イベントハンドラはここに記述
			// , onAdd() { ... }
			// , onSelect() { ... }
		}
		, created() {
			this.pushCrumb({ id: this._uid, name: _("Hogehoge") });
		}
		, sessionEnsured(me) {
			// セッションが準備できた時に呼ばれる（AbstractPresenterで定義）
		}
	};
</script>
```

```view.vue
<template lang="pug">
	.container
		.flex.align-center.justify-space-around
			.left
				button.button.is-primary(@click="$emit('add')")
					i.icon.fa.fa-plus 
					| {{ _("AddTask") }}
			.right
		data-table(:schema="schema", :rows="tasks", :order="order", :selectedRows="[entity]" @select="selectButtonDidPush")
</template>
<script>
	import Vue from "vue";
    import AbstractView from "system/mixins/abstractView";
    
    import { mapGetters } from "vuex";
    
	const _ = Vue.prototype._;

	export default {
		mixins : [ AbstractView ]
        , props: {
			schema : {
				type: Object
				, validator: function(value) { return true; } // TODO
			}
			, entity : {
				type: Object
				, validator: (value) => { return true; } // TODO
			}
        }
		, computed : {
			...mapGetters([
				"tasks"
			])
		}
		, data() {
			return {
				order : {}
			};
		}
		, methods : { 
			selectButtonDidPush(entity) {
				this.$emit("select", entity);
			}
		}
	};
</script>
<style lang="scss" scoped></style>
```

## Infrastructure

### API Client

#### api.js
axiosをラップしたRESTfulなAPI Client。


# ローカルでの開発について

## importについて

webpackでPathのしてをしているので、
- js部分は client/app または node_modules をルートに
- scss部分は client/scss または node_modules をルートに

指定できるようにしている。

[参考](https://zukucode.com/2017/04/webpack-absolute-path.html)
[参考](https://befool.co.jp/blog/8823-scholar/react-webpack-path-resolver/)



## 既知のエラー

### ブラウザの開発者ツール上

下記はどちらもローカルでのみ発生する（deploy後のTaschelでは発生していない）ので無視して良いです。

```
Refused to apply style from 'http://localhost:3000/app/styles/app.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
```

```
GET http://localhost:3000/app/images/icon/manifest.json 404 (Not Found)
```

# webpack

## import のパス

client/app/以下、絶対パスで指定できるようにしている。
https://zukucode.com/2017/04/webpack-absolute-path.html

```webpack.base.config.js
	, resolve: {
		extensions: [".vue", ".js", ".json"]
		, mainFiles: ["index"]
		, alias: {
			"images": path.resolve(__dirname, "..", "client", "images")
			, "vue$": "vue/dist/vue.common.js"
		}
		,  modules: [
			path.resolve("./client/app")
			, path.resolve("./node_modules")
		]
	}
```
# 開発手順

**画面の追加**

1. service/presentation 以下にフォルダを作成し、`presenter.vue` と `view.vue` を用意
2. `system/components/organisms/sidebar.vue` の <template> に追加する画面へのリンクを追加
3. `system/router.js` で 2 で追加したリンクのURLに対するVueコンポーネント（ 1 の `presenter.vue` ）を設定

**ユースケースの追加**

1. `service/application/usecases.js` にユースケースの定義を追加
2. service/application/stores 以下、ユースケースが属するドメインの Store に Actionとしてユースケースを記述（ビジネスロジックはできるだけ、ユースケース内で取り回すentityに持たせる）
3. `presenter.vue` で 1 のユースケースを import し、 mapActionで method として利用できるようにする
4. `presenter.vue` 内の呼びたい箇所で呼び出す