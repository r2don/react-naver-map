import { Nullable } from "../types";
import { Cluster } from "./Cluster";
import { ClusterOptions, OptionKey } from "./interface";

const DEFAULT_OPTIONS: ClusterOptions = {
  // 클러스터 마커를 올릴 지도입니다.
  map: null,
  // 클러스터 마커를 구성할 마커입니다.
  markers: [],
  // 클러스터 마커 클릭 시 줌 동작 여부입니다.
  disableClickZoom: true,
  // 클러스터를 구성할 최소 마커 수입니다.
  minClusterSize: 2,
  // 클러스터 마커로 표현할 최대 줌 레벨입니다. 해당 줌 레벨보다 높으면, 클러스터를 구성하고 있는 마커를 노출합니다.
  maxZoom: 13,
  // 클러스터를 구성할 그리드 크기입니다. 단위는 픽셀입니다.
  gridSize: 100,
  // 클러스터 마커의 아이콘입니다. NAVER Maps JavaScript API v3에서 제공하는 아이콘, 심볼, HTML 마커 유형을 모두 사용할 수 있습니다.
  icons: [],
  // 클러스터 마커의 아이콘 배열에서 어떤 아이콘을 선택할 것인지 인덱스를 결정합니다.
  indexGenerator: [10, 100, 200, 500, 1000],
  // 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부입니다.
  averageCenter: false,
  // 클러스터 마커를 갱신할 때 호출하는 콜백함수입니다. 이 함수를 통해 클러스터 마커에 개수를 표현하는 등의 엘리먼트를 조작할 수 있습니다.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stylingFunction() {},
};

/**
 * 마커 클러스터링을 정의합니다.
 */
export class MarkerClustering extends naver.maps.OverlayView {
  _clusters: Array<Cluster> = [];
  _mapRelations: Nullable<naver.maps.MapEventListener> = null;
  _markerRelations: Array<naver.maps.MapEventListener> = [];
  _geoTree = null;

  constructor(options?: Partial<ClusterOptions>) {
    super();

    this._clusters = [];

    this._mapRelations = null;
    this._markerRelations = [];

    this.setOptions({ ...DEFAULT_OPTIONS, ...options });
  }

  onAdd() {
    const map = this.getMap();

    this._mapRelations = naver.maps.Event.addListener(
      map,
      "idle",
      this._onIdle.bind(this),
    );

    if (this.getMarkers()?.length > 0) {
      this._createClusters();
      this._updateClusters();
    }
  }

  onRemove() {
    if (this._mapRelations) naver.maps.Event.removeListener(this._mapRelations);

    this._clearClusters();

    this._geoTree = null;
    this._mapRelations = null;
  }

  /**
   * 마커 클러스터링 옵션을 설정합니다. 설정한 옵션만 반영됩니다.
   * @param newOptions 옵션
   */
  setOptions(newOptions: Partial<ClusterOptions>) {
    Object.entries(newOptions).forEach(([key, value]) => {
      if (key === "map") {
        this.setMap(value as naver.maps.Map);
      } else {
        this.set(key, value);
      }
    });
  }

  /**
   * 마커 클러스터링 옵션을 반환합니다. 특정 옵션 이름을 지정하지 않으면, 모든 옵션을 반환합니다.
   * @param key 반환받을 옵션 이름
   * @return 옵션
   */
  getOptions(key?: OptionKey) {
    const options: Record<string, unknown> = {};

    if (key !== undefined) {
      return this.get(key);
    } else {
      Object.keys(DEFAULT_OPTIONS).forEach((key) => {
        options[key] = this.get(key);
      });

      return options;
    }
  }

  /**
   * 클러스터를 구성하는 최소 마커 수를 반환합니다.
   * @return 클러스터를 구성하는 최소 마커 수
   */
  getMinClusterSize(): ClusterOptions["minClusterSize"] {
    return this.getOptions("minClusterSize");
  }

  /**
   * 클러스터를 구성하는 최소 마커 수를 설정합니다.
   * @param minClusterSize 클러스터를 구성하는 최소 마커 수
   */
  setMinClusterSize(minClusterSize: ClusterOptions["minClusterSize"]) {
    this.setOptions({ minClusterSize });
  }

  /**
   * 클러스터 마커를 노출할 최대 줌 레벨을 반환합니다.
   * @return 클러스터 마커를 노출할 최대 줌 레벨
   */
  getMaxZoom(): ClusterOptions["maxZoom"] {
    return this.getOptions("maxZoom");
  }

  /**
   * 클러스터 마커를 노출할 최대 줌 레벨을 설정합니다.
   * @param maxZoom 클러스터 마커를 노출할 최대 줌 레벨
   */
  setMaxZoom(maxZoom: ClusterOptions["maxZoom"]) {
    this.setOptions({ maxZoom });
  }

  /**
   * 클러스터를 구성할 그리드 크기를 반환합니다. 단위는 픽셀입니다.
   * @return 클러스터를 구성할 그리드 크기
   */
  getGridSize(): ClusterOptions["gridSize"] {
    return this.getOptions("gridSize");
  }

  /**
   * 클러스터를 구성할 그리드 크기를 설정합니다. 단위는 픽셀입니다.
   * @param gridSize 클러스터를 구성할 그리드 크기
   */
  setGridSize(gridSize: ClusterOptions["gridSize"]) {
    this.setOptions({ gridSize });
  }

  /**
   * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 반환합니다.
   * @return 인덱스 생성기
   */
  getIndexGenerator(): ClusterOptions["indexGenerator"] {
    return this.getOptions("indexGenerator");
  }

  /**
   * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 설정합니다.
   * @param indexGenerator 인덱스 생성기
   */
  setIndexGenerator(indexGenerator: ClusterOptions["indexGenerator"]) {
    this.setOptions({ indexGenerator });
  }

  /**
   * 클러스터로 구성할 마커를 반환합니다.
   * @return 클러스터로 구성할 마커
   */
  getMarkers(): ClusterOptions["markers"] {
    return this.getOptions("markers");
  }

  /**
   * 클러스터로 구성할 마커를 설정합니다.
   * @param markers 클러스터로 구성할 마커
   */
  setMarkers(markers: ClusterOptions["markers"]) {
    this.setOptions({ markers });
  }

  /**
   * 클러스터 마커 아이콘을 반환합니다.
   * @return 클러스터 마커 아이콘
   */
  getIcons(): ClusterOptions["icons"] {
    return this.getOptions("icons");
  }

  /**
   * 클러스터 마커 아이콘을 설정합니다.
   * @param icons 클러스터 마커 아이콘
   */
  setIcons(icons: ClusterOptions["icons"]) {
    this.setOptions({ icons });
  }

  /**
   * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 반환합니다.
   * @return 콜백함수
   */
  getStylingFunction(): ClusterOptions["stylingFunction"] {
    return this.getOptions("stylingFunction");
  }

  /**
   * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 설정합니다.
   * @param stylingFunction 콜백함수
   */
  setStylingFunction(stylingFunction: ClusterOptions["stylingFunction"]) {
    this.setOptions({ stylingFunction });
  }

  /**
   * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 반환합니다.
   * @return 줌 동작 수행 여부
   */
  getDisableClickZoom(): ClusterOptions["disableClickZoom"] {
    return this.getOptions("disableClickZoom");
  }

  /**
   * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 설정합니다.
   * @param disableClickZoom 줌 동작 수행 여부
   */
  setDisableClickZoom(disableClickZoom: ClusterOptions["disableClickZoom"]) {
    this.setOptions({ disableClickZoom });
  }

  /**
   * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 반환합니다.
   * @return 평균 좌표로 클러스터링 여부
   */
  getAverageCenter(): ClusterOptions["averageCenter"] {
    return this.getOptions("averageCenter");
  }

  /**
   * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 설정합니다.
   * @param averageCenter 평균 좌표로 클러스터링 여부
   */
  setAverageCenter(averageCenter: ClusterOptions["averageCenter"]) {
    this.setOptions({ averageCenter });
  }

  // KVO 이벤트 핸들러
  changed(key: OptionKey | "marker", value?: boolean) {
    if (!this.getMap()) return;

    switch (key) {
      case "marker":
      case "minClusterSize":
      case "gridSize":
      case "averageCenter":
        this._redraw();
        break;
      case "indexGenerator":
      case "icons":
        this._clusters.forEach(function (cluster) {
          cluster.updateIcon();
        });
        break;
      case "maxZoom":
        this._clusters.forEach(function (cluster) {
          if (cluster.getCount() > 1) {
            cluster.checkByZoomAndMinClusterSize();
          }
        });
        break;
      case "stylingFunction":
        this._clusters.forEach(function (cluster) {
          cluster.updateCount();
        });
        break;
      case "disableClickZoom":
        // eslint-disable-next-line no-case-declarations
        let exec: "enableClickZoom" | "disableClickZoom" = "enableClickZoom";

        if (value) {
          exec = "disableClickZoom";
        }

        this._clusters.forEach(function (cluster) {
          cluster[exec]();
        });
        break;
    }
  }

  /**
   * 현재 지도 경계 영역 내의 마커에 대해 클러스터를 생성합니다.
   */
  private _createClusters() {
    const map = this.getMap();
    if (!map) return;

    const bounds = map.getBounds();
    const markers = this.getMarkers();

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const position = marker.getPosition();

      if (!bounds.hasPoint(position)) continue;

      const closestCluster = this._getClosestCluster(position);

      closestCluster?.addMarker(marker);

      this._markerRelations.push(
        naver.maps.Event.addListener(
          marker,
          "dragend",
          this._onDragEnd.bind(this),
        ),
      );
    }
  }

  /**
   * 클러스터의 아이콘, 텍스트를 갱신합니다.
   */
  private _updateClusters() {
    const clusters = this._clusters;

    for (let i = 0; i < clusters.length; i++) {
      clusters[i].updateCluster();
    }
  }

  /**
   * 클러스터를 모두 제거합니다.
   */
  private _clearClusters() {
    const clusters = this._clusters;

    for (let i = 0; i < clusters.length; i++) {
      clusters[i].destroy();
    }

    naver.maps.Event.removeListener(this._markerRelations);

    this._markerRelations = [];
    this._clusters = [];
  }

  /**
   * 생성된 클러스터를 모두 제거하고, 다시 생성합니다.
   */
  private _redraw() {
    this._clearClusters();
    this._createClusters();
    this._updateClusters();
  }

  /**
   * 전달된 위/경도에서 가장 가까운 클러스터를 반환합니다. 없으면 새로 클러스터를 생성해 반환합니다.
   * @param position 위/경도
   * @return 클러스터
   */
  private _getClosestCluster(position: naver.maps.Coord) {
    const map = this.getMap();

    const proj = this.getProjection() || map?.getProjection();

    if (!proj) return;
    const clusters = this._clusters;
    let closestCluster = null;
    let distance = Infinity;

    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const center = cluster.getCenter();

      if (cluster.isInBounds(position) && center) {
        const delta = proj.getDistance(center, position);

        if (delta < distance) {
          distance = delta;
          closestCluster = cluster;
        }
      }
    }

    if (!closestCluster) {
      closestCluster = new Cluster(this);
      this._clusters.push(closestCluster);
    }

    return closestCluster;
  }

  /**
   * 지도의 Idle 상태 이벤트 핸들러입니다.
   */
  _onIdle() {
    this._redraw();
  }

  /**
   * 각 마커의 드래그 종료 이벤트 핸들러입니다.
   */
  _onDragEnd() {
    this._redraw();
  }
}
