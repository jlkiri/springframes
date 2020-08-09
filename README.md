# Springframes

A spring physics based keyframe generator to be used with Web Animation API. Fast and simple.

## Install

- Node: `npm install springframes`
- UMD: https://unpkg.com/springframes@latest/lib/springframes.umd.js

## Options

|  Property   | Default | Required |   Type    |          Details          |
| :---------: | :-----: | :------: | :-------: | :-----------------------: |
|    `dx`     |    -    |  `true`  | `number`  |  Displacement on X axis   |
|    `dy`     |    -    |  `true`  | `number`  |  Displacement on Y axis   |
|  `reverse`  |  false  | `false`  | `boolean` | Revert order of keyframes |
| `stiffness` |   500   | `false`  | `number`  |     Spring stiffness      |
|  `damping`  |   50    | `false`  | `number`  |   Spring damping ratio    |
|   `mass`    |    1    | `false`  | `number`  |        Spring mass        |

## Usage

Simply import `createSpringAnimation` function and pass it displacement on X axis and Y axis. Other options are not required as you can see from the table above. You will get an object with `keyframes` and `frames` properties: keyframes are what you pass to `KeyframeEffect` and `frames` are used to calculate duration.

```js
import { createSpringAnimation } from "springframes";

const { keyframes, frames } = createSpringAnimation({
  dx: 500,
  dy: 500,
  stiffness: 700,
  mass: 2,
  damping: 10,
});

if (keyframes.length > 0) {
  const kfEffect = new KeyframeEffect(square, keyframes, {
    duration: (frames / 60) * 1000,
    fill: "both",
    easing: "linear", // This must be linear!
    iterations: 1,
  });

  animation = new Animation(kfEffect);

  animation.play();
}
```

You can play with it here:

[![Edit on codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/simple-spring-animation-package-3yz48?fontsize=14&hidenavigation=1&theme=dark)
