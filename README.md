# react-naver-map

## Introduction
네이버 맵을 리액트에서 사용하기 편하게 만들어 둔 라이브러리입니다.

## Installation

```sh
# with npm
npm i @r2don/react-naver-map

# with yarn
yarn add @r2don/react-naver-map

# with pnpm
pnpm add @r2don/react-naver-map
```

## Usage

### Map component

```js
import { Map, useNaverMapInit, Marker } from '@r2don/react-naver-map'

const MARKERS = [
  {latitude: 30, longitude: 120},
  {latitude: 30.5, longitude: 120.5},
  {latitude: 31, longitude: 121},
  {latitude: 31.5, longitude: 121.5},
]

function App () {
  const {isLoaded} = useNaverMapInit();

  if(!isLoaded) return null;

  return (
    <Map position={{latitude: 30, longitude: 120}} style={{height: '500px', width: '500px'}}>
      {MARKERS.map((marker) => <Marker key={JSON.stringify(marker)} position={marker} />)}
    </Map>
  );
}
```

## License

Licensed under the MIT License, Copyright (c) 2022 r2don.

See [LICENSE](https://github.com/r2don/react-naver-map/blob/main/LICENSE) for more information.