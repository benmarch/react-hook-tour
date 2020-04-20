# React Hook Tour

A library for creating a product tour using React hooks

## Getting Started

Install using a package manager:
```sh
npm install -S react-hook-tour

yard add --save react-hook-tour
```

Configure your tour and wrap your app with the TourProvider (see below for config options).

**NOTE:** A PopoverComponent is required, and it is recommended that you start with the template in `example/PopoverTemplate.jsx`:
```js
import { TourProvider } from 'react-hook-tour'
import Popover from './Popover'

// configure the tour
const tourConfig = {
  name: 'My First Tour',
  popover: {
    Component: Popover,
    className: 'my-first-tour-popover'
  }
  stepOrder: [
    'welcome',
    'menu',
    {
      name: 'async',
      fetch: () => {
        router.push('/next-page-with-step')
      }
    },
    {
      name: 'preconfigured',
      hasBackdrop: true,
      title: 'Preconfigured Step',
      content: 'Steps can be fully configured up front'
    }
  ]
}
// somewhere at the top of your component tree:
return (
  <TourProvider config={tourConfig}>
    <MyApp>
  </TourProvider>
)
```

Register your steps and create a Start button:
```js
// in a nested component
import { useTour, useStep } from 'react-hook-tour'

export default props => {
  const tour = useTour()

  // configure your steps here and get a ref (see below for config options)
  const welcomeStep = useStep({
    name: 'welcome',
    isModal: true,
    hasBackdrop: true,
    title: 'Welcome!',
    content: 'Welcome to my site',
  })

  const menuStep = useStep({
    name: 'menu',
    hasBackdrop: true,
    title: 'Main Menu',
    content: 'Click here for more options',
  })

  // or reference a preconfigured step and get a ref
  const preconfiguredStep = useStep('preconfigured')

  return (
    <div ref={welcomeStep}>
      <div ref={menuStep}>Main Menu</div>
      <button ref={preconfiguredStep} onClick={tour.start}>Start Tour</div>
    </div>
  )
}
```

## Config Options

 - stepOrder
 - name
 - placement
 - isModal
 - hasBackdrop
 - offset
 - skid
 - scrollOffsets
 - popover
   - Component
   - template
   - className
   - modalStyles
 - backdrop
 - onStart
 - onEnd
 - onNext
 - onPrev
 - onPause
 - onResume
 - onShow
 - onHide

### `stepOrder <array>` required

Configurable for `Tour` only

All steps must be listed here. Each element in the array can either be a string representing the step name, or a preconfigured step.

If it's a string, the step must be registered by the time the _previous_ step is displayed, otherwise it will be skipped.

If it is an object, it can be a fully configured step and can contain any of the configuration options below. Optionally, it can contain a `fetch()` method that instructs the tour to assume that the step exists but has not yet loaded. Note that `fetch()` can only be used in `stepOrder`, not on a step configuration using `useStep()`.

`fetch() => Promise<void>` - Called when the step is to be displayed but is not yet registered. It can change the route, fetch data, or conduct any other action that enables the step to load and register. When present, the tour will pause and will only resume once the step is registered. Life cycle events can be used to manage the UI when in the fetching state.

### `name <string>` required

Configurable for `Tour` and `Step`

The identifier for a tour or step.

### `placement <string>`

Configurable for `Tour` and `Step`

The placements of the popover relative to the step target:

 - top
 - bottom
 - left
 - right

### `isModal <boolean>`

Configurable for `Tour` and `Step`

If true, the popover will be placed fixed in the center of the viewport.

### `hasBackdrop <boolean>`

Configurable for `Tour` and `Step`

This requires the optional dependency benmarch/hone to be installed.

If true, it will place a backdrop behind the popover. See the example app for configuration.

### `offset <number>`

Configurable for `Tour` and `Step`

Number of pixels away from the target the popover will be. Useful for styling arrows; see the example app for configuration.

### `skid <number>`

Configurable for `Tour` and `Step`

Number of pixels off center from the target the popover will be. For example, if the `placement` is set to `'top'` pr `'bottom'` then a negative `skid` will move the popover to the left, and a positive `skid` will move it to the right.

### `scrollOffsets <object>`

Configurable for `Tour` and `Step`

Addition scroll distances for ensuring the popover and target remain in the viewport. Useful when there are fixed elements such as headers. Takes the shape:
```js
{
  top: number, 
  bottom: number,
  left: number,
  right: number
}
```

### `popover <Object>`

Configurable for `Tour` and `Step`

Configures the popover and takes the following options:

#### `Component <React.Component>` required (or `template`)

**NOTE the capital _C_ in Component!**

A reference to a React Component that will be rendered within the popover element. It will receive the following props:

 - `tour` - reference to the current tour controller
 - `step` - reference to the current step
 - `updatePopover` - a function that forces the popover to reposition. This can be useful when the UI is very dynamic. See example app for usage.
 - `arrowRef` - a ref to put on an arrow element so that the positioning engine can properly position it
 - `arrowStyles` - a style object to be passed to the arrow element for positioning 
 - `popoverConfig` - a reference to the underlying popover config. Read Only.

See `example/PopoverTemplate.jsx` for an example.

#### `template <ReactNode>` required (or `Component`)

To be used _instead of_ `popover.Component`. This is an actual node instead of a component, and it does not receive any props. It is usefull if you need a static template for a given step. If both `popover.Component` and `popover.template` are set, `popover.template` will take precedence.

#### `className <string>`

The className to add to the outer popover element.

### `backdrop <Object>`

Configurable for `Tour` and `Step`

This object is passed directly to [Hone](https://github.com/benmarch/hone) to configure the optional backdrop. Please note that `react-hook-took` manipulates these options based on the step config, so if you overwrite them it could break things!

The most relevant option is `classPrefix` which can only be set on the `Tour` (for now, for performance reasons). To properly style the backdrop, the full className would be `<classPrefix>-component`. See benmarch/hone and the example app for usage.

### `shouldSkip <Function => boolean>`

Configurable for `Step` only.

A synchronous function that returns whether a step should be skipped. It will be evaluated twice: first to determine whether it can be navigated to next or previously, and again when a next or previous action is triggered. If the state change between those events, it might result in unexpected behavior. 

### Life cycle events

Configurable for `Tour` and `Step`

**NOTE: if the same life cycle event is defined on both the `Tour` and the `Step`, then the `Tour` event will fire first.**

If the function returns a promise, the tour will wait until it resolves before moving on. If it rejects or throws an error, the tour will need to be reset.

 - `onStart` - triggered when the tour starts, before a step is displayed
 - `onEnd` - triggered when the tour ends, before the last step is hidden
 - `onPause` - triggered when the tour pauses, before the step is hidden
 - `onResume` - triggered when a paused tour resumes, before the step is displayed
 - `onNext` - triggered when the tour progresses to the next step, before the current step is hidden
- `onPrev` - triggered when the tour progresses to the previous step, before the current step is hidden
- `onShow` - triggered after a step is displayed
- `onHide` - triggered before a step is hidden

### Additional Step Config

Steps can take any arbitrary key value pairs that can be used to store information about them. In the example app, steps are configured with `title` and `content` properties that are used in the `PopoverComponent` for display purposes. There are no rules or conventions, they just can't clash with the above config. Note that the config above is subject to change, so it might be safest to create a single object to hold all the properties in case a new configuration option is added.

Properties can be accessed using `step.getConfig(key)`.

## Tour Controller API

### Controlling the Tour

The following methods are available on the `tour` object for controlling the tour:

 - `start(startAtStepName?)` - starts the tour from the first step or at the step with the provided name
 - `end()` - ends the tour
 - `pause()` - turns the tour off but maintains state
 - `resume()` - starts a paused tour at the step left off when it was paused
 - `next()` - moves to the next step
 - `prev()` - moves to the previous step
 - `jumpTo(stepName)` - moves to the step with the provided name
 - `setStepOrder()` - resets the step order. Running this when a tour is running will cause problems!
 - `setCustomState(state)` - allows for arbitrary state to be stored on the tour. Useful for testing or saving values for displaying in the popover.

### Accessing Tour Data

The following methods are available on the `tour` object to access data about the tour:

 - `getSteps()` - returns all steps as `Map<name, config>`
 - `getCurrentStep()` - returns the current step config
 - `getStepOrder()` - returns the `stepOrder` array. Do not modify it, use the setter below.
 - `getStatus()` - returns a `TourStatus`
 - `hasNextStep()` - returns true if there is a next step
 - `hasPreviousStep()` - returns true if there is a previous step
 - `getCustomState()` - returns the custom state object
 - `getConfig(key)` - returns the value of a specific key. Useful for getting a life cycle event handler.

## Running the Example App

Just run the following commands and then visit `http://localhost:1234`:

```sh
$ npm install
$ npm start
```
