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

> 기본 스타일이 적용되어있지 않으니, 필요에 맞게 width와 height를 적용해주세요.

### Map component

```js
import { Map, useNaverMapInit, Marker } from "@r2don/react-naver-map";

const MARKERS = [
  { latitude: 37, longitude: 127 },
  { latitude: 37.5, longitude: 127.5 },
  { latitude: 38, longitude: 128 },
  { latitude: 38.5, longitude: 128.5 },
];

function App() {
  const { isLoaded } = useNaverMapInit();

  if (!isLoaded) return null;

  return (
    <Map
      center={{ latitude: 37.3595704, longitude: 127.105399 }}
      style={{ height: "500px", width: "500px" }}
    >
      {MARKERS.map((marker) => (
        <Marker key={JSON.stringify(marker)} position={marker} />
      ))}
    </Map>
  );
}
```

### PolyLine Component

```js
import { Map, useNaverMapInit, Marker, Poly } from "@r2don/react-naver-map";

const MARKERS = [
  { latitude: 37, longitude: 127 },
  { latitude: 37.5, longitude: 127.5 },
  { latitude: 38, longitude: 128 },
  { latitude: 38.5, longitude: 128.5 },
];

function App() {
  const { isLoaded } = useNaverMapInit();

  if (!isLoaded) return null;

  const path = [{ latitude: 37.3595704; longitude: 127.105399 }, { latitude: 37.3585781; longitude: 127.1053234 }];
  const mid = {
    latitude: (path[0].latitude + path[1].latitude) / 2,
    longitude: (path[0].longitude + path[1].longitude) / 2,
  }

  return (
    <Map
      center={{ latitude: mid.latitude, longitude: mid.longitude }}
      style={{ height: "500px", width: "500px" }}
    >
      {MARKERS.map((marker) => (
        <Marker key={JSON.stringify(marker)} position={marker} />
      ))}
      <Polyline path={path} />
    </Map>
  );
}
```

## License

Licensed under the MIT License, Copyright (c) 2022 r2don.

See [LICENSE](https://github.com/r2don/react-naver-map/blob/main/LICENSE) for more information.
