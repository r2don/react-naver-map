import type { Nullable } from "../types";
import { MarkerClustering } from "./MarkerClustering";

/**
 * 마커를 가지고 있는 클러스터를 정의합니다.
 */
export class Cluster {
  _clusterCenter: Nullable<naver.maps.Coord> = null;
  _clusterBounds: Nullable<naver.maps.LatLngBounds> = null;
  _clusterMarker: Nullable<naver.maps.Marker> = null;
  _relation: Nullable<naver.maps.MapEventListener> = null;
  _clusterMember: Array<naver.maps.Marker> = [];
  _markerClusterer: Nullable<MarkerClustering> = null;

  constructor(markerClusterer: MarkerClustering) {
    this._clusterCenter = null;
    this._clusterBounds = null;
    this._clusterMarker = null;
    this._relation = null;

    this._clusterMember = [];

    this._markerClusterer = markerClusterer;
  }

  /**
   * 클러스터에 마커를 추가합니다.
   * @param marker 클러스터에 추가할 마커
   */
  addMarker(marker: naver.maps.Marker) {
    if (this._isMember(marker)) return;

    if (!this._clusterCenter) {
      const position = marker.getPosition();
      this._clusterCenter = position;

      const bounds = this._calcBounds(position);
      if (bounds) this._clusterBounds = bounds;
    }

    this._clusterMember.push(marker);
  }

  /**
   * 클러스터를 제거합니다.
   */
  destroy() {
    if (this._relation) naver.maps.Event.removeListener(this._relation);

    const members = this._clusterMember;

    for (let i = 0; i < members.length; i++) {
      members[i].setMap(null);
    }

    this._clusterMarker?.setMap(null);

    this._clusterMarker = null;
    this._clusterCenter = null;
    this._clusterBounds = null;
    this._relation = null;

    this._clusterMember = [];
  }

  /**
   * 클러스터 중심점을 반환합니다.
   * @return 클러스터 중심점
   */
  getCenter(): naver.maps.Coord | null {
    return this._clusterCenter;
  }

  /**
   * 클러스터 경계 영역을 반환합니다.
   * @return 클러스터 경계 영역
   */
  getBounds() {
    return this._clusterBounds;
  }

  /**
   * 클러스터를 구성하는 마커 수를 반환합니다.
   * @return 클러스터를 구성하는 마커 수
   */
  getCount() {
    return this._clusterMember.length;
  }

  /**
   * 현재의 클러스터 멤버 마커 객체를 반환합니다.
   * @return 클러스터를 구성하는 마커 객체 집합
   */
  getClusterMember() {
    return this._clusterMember;
  }

  /**
   * 전달된 위/경도가 클러스터 경계 영역 내에 있는지 여부를 반환합니다.
   * @param position 위/경도
   * @return 클러스터 경계 영역 내의 위치 여부
   */
  isInBounds(position: naver.maps.Coord) {
    return this._clusterBounds && this._clusterBounds.hasLatLng(position);
  }

  /**
   * 클러스터 마커 클릭 시 줌 동작을 수행하도록 합니다.
   */
  enableClickZoom() {
    if (this._relation) return;

    const map = this._markerClusterer?.getMap();

    this._relation = naver.maps.Event.addListener(
      this._clusterMarker,
      "click",
      function (e: any) {
        if (!map) return;
        map.morph(e.coord, map.getZoom() + 1);
      }.bind(this),
    );
  }

  /**
   * 클러스터 마커 클릭 시 줌 동작을 수행하지 않도록 합니다.
   */
  disableClickZoom() {
    if (!this._relation) return;

    naver.maps.Event.removeListener(this._relation);
    this._relation = null;
  }

  /**
   * 클러스터 마커가 없으면 클러스터 마커를 생성하고, 클러스터 마커를 갱신합니다.
   * - 클러스터 마커 아이콘
   * - 마커 개수
   * - 클러스터 마커 노출 여부
   */
  updateCluster() {
    if (!this._clusterMarker) {
      let position;

      if (this._markerClusterer?.getAverageCenter()) {
        position = this._calcAverageCenter(this._clusterMember);
      } else {
        position = this._clusterCenter;
      }

      const map = this._markerClusterer?.getMap();
      if (!position || !map) return;
      this._clusterMarker = new naver.maps.Marker({
        position,
        map,
      });

      if (!this._markerClusterer?.getDisableClickZoom()) {
        this.enableClickZoom();
      }
    }

    this.updateIcon();
    this.updateCount();

    this.checkByZoomAndMinClusterSize();
  }

  /**
   * 조건에 따라 클러스터 마커를 노출하거나, 노출하지 않습니다.
   */
  checkByZoomAndMinClusterSize() {
    const clusterer = this._markerClusterer;
    if (!clusterer) return;
    const minClusterSize = clusterer.getMinClusterSize();
    const maxZoom = clusterer.getMaxZoom();
    const currentZoom = clusterer.getMap()?.getZoom();
    if (!currentZoom) return;

    if (this.getCount() < minClusterSize) {
      this._showMember();
    } else {
      this._hideMember();

      if (maxZoom <= currentZoom) {
        this._showMember();
      }
    }
  }

  /**
   * 클러스터를 구성하는 마커 수를 갱신합니다.
   */
  updateCount() {
    if (!this._markerClusterer || !this._clusterMarker) return;
    const stylingFunction = this._markerClusterer.getStylingFunction();

    stylingFunction && stylingFunction(this._clusterMarker, this.getCount());
  }

  /**
   * 클러스터 마커 아이콘을 갱신합니다.
   */
  updateIcon() {
    const count = this.getCount();
    let index = this._getIndex(count);
    const icons = this._markerClusterer?.getIcons();

    if (!icons) return;

    index = Math.max(index ?? 0, 0);
    index = Math.min(index, icons.length - 1);

    this._clusterMarker?.setIcon(icons[index]);
  }

  /**
   * 클러스터를 구성하는 마커를 노출합니다. 이때에는 클러스터 마커를 노출하지 않습니다.
   */
  private _showMember() {
    const map = this._markerClusterer?.getMap();
    const marker = this._clusterMarker;
    const members = this._clusterMember;
    if (!map) return;
    members.forEach((member) => {
      member.setMap(map);
    });

    if (marker) {
      marker.setMap(null);
    }
  }

  /**
   * 클러스터를 구성하는 마커를 노출하지 않습니다. 이때에는 클러스터 마커를 노출합니다.
   */
  private _hideMember() {
    const map = this._markerClusterer?.getMap();
    const marker = this._clusterMarker;
    const members = this._clusterMember;
    if (!map) return;

    members.forEach((member) => {
      member.setMap(null);
    });

    if (marker && !marker.getMap()) {
      marker.setMap(map);
    }
  }

  /**
   * 전달된 위/경도를 중심으로 그리드 크기만큼 확장한 클러스터 경계 영역을 반환합니다.
   * @param position 위/경도
   * @return 클러스터 경계 영역
   */
  private _calcBounds(position: naver.maps.Coord) {
    const map = this._markerClusterer?.getMap();
    if (!map) return;

    const bounds = new naver.maps.LatLngBounds(
      position.clone() as naver.maps.LatLng,
      position.clone() as naver.maps.LatLng,
    );
    const mapBounds = map.getBounds() as {
      getNE: () => naver.maps.Coord;
      getSW: () => naver.maps.Coord;
    };

    const proj = map.getProjection();
    const map_max_px = proj.fromCoordToOffset(mapBounds.getNE());
    const map_min_px = proj.fromCoordToOffset(mapBounds.getSW());
    const max_px = proj.fromCoordToOffset(bounds.getNE());
    const min_px = proj.fromCoordToOffset(bounds.getSW());
    if (!this._markerClusterer?.getGridSize()) return;
    const gridSize = this._markerClusterer?.getGridSize() / 2;

    max_px.add(gridSize, -gridSize);
    min_px.add(-gridSize, gridSize);

    const max_px_x = Math.min(map_max_px.x, max_px.x);
    const max_px_y = Math.max(map_max_px.y, max_px.y);
    const min_px_x = Math.max(map_min_px.x, min_px.x);
    const min_px_y = Math.min(map_min_px.y, min_px.y);
    const newMax = proj.fromOffsetToCoord(
      new naver.maps.Point(max_px_x, max_px_y),
    );
    const newMin = proj.fromOffsetToCoord(
      new naver.maps.Point(min_px_x, min_px_y),
    );

    return new naver.maps.LatLngBounds(
      newMin as naver.maps.LatLng,
      newMax as naver.maps.LatLng,
    );
  }

  /**
   * 클러스터를 구성하는 마커 수에 따라 노출할 아이콘을 결정하기 위한 인덱스를 반환합니다.
   * @param count 클러스터를 구성하는 마커 수
   * @return 인덱스
   */
  private _getIndex(count: number) {
    const indexGenerator = this._markerClusterer?.getIndexGenerator();

    if (typeof indexGenerator === "function") {
      return indexGenerator(count);
    } else if (Array.isArray(indexGenerator)) {
      let index = 0;

      for (let i = index; i < indexGenerator.length; i++) {
        const factor = indexGenerator[i];

        if (count < factor) break;

        index++;
      }

      return index;
    }
  }

  /**
   * 전달된 마커가 이미 클러스터에 속해 있는지 여부를 반환합니다.
   * @param marker 마커
   * @return 클러스터에 속해 있는지 여부
   */
  private _isMember(marker: naver.maps.Marker) {
    return this._clusterMember.indexOf(marker) !== -1;
  }

  /**
   * 전달된 마커들의 중심 좌표를 반환합니다.
   * @param markers 마커 배열
   * @return 마커들의 중심 좌표
   */
  private _calcAverageCenter(markers: Array<naver.maps.Marker>) {
    const numberOfMarkers = markers.length;
    const averageCenter = [0, 0];

    for (let i = 0; i < numberOfMarkers; i++) {
      const { x, y } = markers[i].getPosition();
      averageCenter[0] += x;
      averageCenter[1] += y;
    }

    averageCenter[0] /= numberOfMarkers;
    averageCenter[1] /= numberOfMarkers;

    return new naver.maps.Point(averageCenter[0], averageCenter[1]);
  }
}
