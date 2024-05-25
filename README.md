<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://lf3-static.bytednsdoc.com/obj/eden-cn/rjhwzy/ljhwZthlaukjlkulzlp/rspack-banner-1610-dark.png">
  <img alt="Rspack Banner" src="https://lf3-static.bytednsdoc.com/obj/eden-cn/rjhwzy/ljhwZthlaukjlkulzlp/rspack-banner-1610.png">
</picture>

# rspack-plugin-prefresh

[![npm version](https://badgen.net/npm/v/rspack-plugin-prefresh)](https://www.npmjs.com/package/rspack-plugin-prefresh)

## Setup

```
npm i -s rspack-plugin-prefresh
## OR
yarn add rspack-plugin-prefresh
```

Then add it to your `rspack.config.js` config:

```js
import PreactRefreshPlugin from "rspack-plugin-prefresh";

export default {
  plugins: [PreactRefreshPlugin()],
};
```

### Using hooks

If you're using `preact/hooks` you'll need add following config to `builtin:swc-loader`:

```json
{
  "jsc:": {
    "transform": {
      "react": {
        "development": true,
        "refresh": true
    }
  }
}
```

## Best practices

### Recognition

We need to be able to recognise your components, this means that components should
start with a capital letter and hook should start with `use` followed by a capital letter.
This allows the Babel plugin to effectively recognise these.

Do note that a component as seen below is not named.

```jsx
export default () => {
  return <p>Want to refresh</p>;
};
```

Instead do:

```jsx
const Refresh = () => {
  return <p>Want to refresh</p>;
};

export default Refresh;
```

When you are working with HOC's be sure to lift up the `displayName` so we can
recognise it as a component.
