# native-x-paginated-view

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This component will help you to implement a tab with a horizontal scroll to toggle between content.

## Install

### Yarn

```sh
yarn add native-x-paginated-view
```

### NPM

```sh
npm install native-x-paginated-view
```

## Usage

```tsx
import { Screen } from 'native-x-screen'
import React, { useEffect, useRef, useState } from 'react'
import { PaginatedView, PaginatedViewRef } from 'native-x-paginated-view'
import { DiscoverScreen, HomeScreen, UserProfileScreen } from '../screens'

export enum HomeScreenTab {
  HOME,
  DISCOVER,
  PROFILE,
}

export function MainScreen() {
  const [tab, setTab] = useState<HomeScreenTab>(HomeScreenTab.HOME)
  const paginatedViewRef = useRef<PaginatedViewRef>()

  useEffect(() => {
    paginatedViewRef?.current?.goto(tab)
  }, [tab])

  return (
    <Screen scrollable>
      <PaginatedView ref={paginatedViewRef} onIndexChange={setTab}>
        <HomeScreen />
        <DiscoverScreen />
        <UserProfileScreen />
      </PaginatedView>
      <TabHeader tab={tab} onChange={setTab} />
    </Screen>
  )
}
```

## API

| Property                                 | Default Value | Usage                                                                               |
| ---------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| children: ReactNode[]                    |               | Content of the paginated view                                                       |
| style?: ViewStyle                        |               | Container style                                                                     |
| scrollEnabled?: boolean                  | true          | Set to true to enable scroll                                                        |
| animated?: boolean                       | true          | Animate transition between views                                                    |
| showsHorizontalScrollIndicator?: boolean | false         | Set to true to show indicator                                                       |
| onIndexChange?: (index: number) => void  |               | Callback for index change                                                           |
| keepAlreadyRendered?: boolean            | true          | If set to true, all paged once rendered will be cached                              |
| cachePageCount?: number                  | 3             | Number of pages to cache at any time (works only if `keepAlreadyRendered` is false) |
| containerWidth?: number                  | Screen Size   | Width of the container. By default this is set to screen size                       |
| dynamicWidth?: boolean                   | false         | Set this to true for the component to calculate width of the content as it changes  |

## Automatic Release

Here is an example of the release type that will be done based on a commit messages:

| Commit message      | Release type          |
| ------------------- | --------------------- |
| fix: [comment]      | Patch Release         |
| feat: [comment]     | Minor Feature Release |
| perf: [comment]     | Major Feature Release |
| doc: [comment]      | No Release            |
| refactor: [comment] | No Release            |
| chore: [comment]    | No Release            |
