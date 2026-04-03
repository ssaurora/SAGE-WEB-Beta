"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  type Map as MapLibreMap,
  type MapMouseEvent,
} from "maplibre-gl";
import type { MapLayerMouseEvent } from "maplibre-gl";

type MapLibreCanvasProps = {
  layers: Array<{ name: string; visible: boolean; opacity?: number }>;
  focusLayerName?: string | null;
  focusSignal?: number;
  resetSignal?: number;
  activeLayerName?: string | null;
  onLayerPick?: (layerName: string) => void;
  onFeaturePick?: (feature: PickedFeature) => void;
};

export type PickedFeature = {
  layerName: string;
  objectName: string;
  objectType: string;
  status: string;
  updatedAt: string;
  taskId?: string;
  resultId?: string;
  lng: number;
  lat: number;
};

type CursorState = {
  lng: number;
  lat: number;
  zoom: number;
};

const defaultCursor: CursorState = {
  lng: 116.397,
  lat: 39.907,
  zoom: 7,
};

type DemoLayerName = "Study Area" | "Precipitation 2025" | "Water Yield Result";

type DemoLayerConfigItem = {
  sourceId: string;
  fillId: string;
  lineId: string;
  geojson: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      properties: Record<string, unknown>;
      geometry: {
        type: "Polygon";
        coordinates: number[][][];
      };
    }>;
  };
};

const DEMO_LAYER_CONFIG: Record<DemoLayerName, DemoLayerConfigItem> = {
  "Study Area": {
    sourceId: "source-study-area",
    fillId: "fill-study-area",
    lineId: "line-study-area",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            objectName: "Watershed Boundary A",
            objectType: "Boundary Polygon",
            status: "Bound",
            updatedAt: "2026-04-03 10:12",
            taskId: "task-001",
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [116.05, 39.75],
                [116.75, 39.75],
                [116.75, 40.2],
                [116.05, 40.2],
                [116.05, 39.75],
              ],
            ],
          },
        },
      ],
    },
  },
  "Precipitation 2025": {
    sourceId: "source-precipitation-2025",
    fillId: "fill-precipitation-2025",
    lineId: "line-precipitation-2025",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            objectName: "Precipitation Raster 2025",
            objectType: "Raster Footprint",
            status: "Visible",
            updatedAt: "2026-04-03 10:22",
            taskId: "task-001",
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [116.15, 39.82],
                [116.62, 39.82],
                [116.62, 40.05],
                [116.15, 40.05],
                [116.15, 39.82],
              ],
            ],
          },
        },
      ],
    },
  },
  "Water Yield Result": {
    sourceId: "source-water-yield-result",
    fillId: "fill-water-yield-result",
    lineId: "line-water-yield-result",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            objectName: "Water Yield Output v1",
            objectType: "Result Layer",
            status: "Generated",
            updatedAt: "2026-04-02 17:25",
            taskId: "task-000",
            resultId: "result-2026-001",
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [116.22, 39.88],
                [116.52, 39.88],
                [116.52, 40.03],
                [116.22, 40.03],
                [116.22, 39.88],
              ],
            ],
          },
        },
      ],
    },
  },
};

function isDemoLayerName(layerName: string): layerName is DemoLayerName {
  return layerName in DEMO_LAYER_CONFIG;
}

function toBounds(featureCollection: {
  features: Array<{ geometry: { coordinates: number[][][] } }>;
}) {
  const bounds = new maplibregl.LngLatBounds();
  for (const feature of featureCollection.features) {
    for (const ring of feature.geometry.coordinates) {
      for (const coordinate of ring) {
        bounds.extend([coordinate[0], coordinate[1]]);
      }
    }
  }
  return bounds;
}

function estimateScaleDenominator(zoom: number, latitude: number) {
  const metersPerPixel =
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  const denominator = metersPerPixel * 39.37 * 96;
  return Math.max(1, Math.round(denominator));
}

export function MapLibreCanvas({
  layers,
  focusLayerName,
  focusSignal,
  resetSignal,
  activeLayerName,
  onLayerPick,
  onFeaturePick,
}: MapLibreCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [cursor, setCursor] = useState<CursorState>(defaultCursor);
  const scaleDenominator = estimateScaleDenominator(cursor.zoom, cursor.lat);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [defaultCursor.lng, defaultCursor.lat],
      zoom: defaultCursor.zoom,
    });

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "top-right",
    );
    map.addControl(
      new maplibregl.ScaleControl({ unit: "metric" }),
      "bottom-left",
    );

    map.on("load", () => {
      for (const layer of layers) {
        if (!isDemoLayerName(layer.name)) {
          continue;
        }

        const config = DEMO_LAYER_CONFIG[layer.name];

        if (!map.getSource(config.sourceId)) {
          map.addSource(config.sourceId, {
            type: "geojson",
            data: config.geojson,
          });
        }

        if (!map.getLayer(config.fillId)) {
          map.addLayer({
            id: config.fillId,
            type: "fill",
            source: config.sourceId,
            paint: {
              "fill-color":
                layer.name === "Study Area"
                  ? "#3B82F6"
                  : layer.name === "Precipitation 2025"
                    ? "#22C55E"
                    : "#A855F7",
              "fill-opacity":
                Math.max(0.05, Math.min(1, layer.opacity ?? 0.6)) * 0.38,
            },
            layout: {
              visibility: layer.visible ? "visible" : "none",
            },
          });
        }

        if (!map.getLayer(config.lineId)) {
          map.addLayer({
            id: config.lineId,
            type: "line",
            source: config.sourceId,
            paint: {
              "line-color":
                layer.name === "Study Area"
                  ? "#1D4ED8"
                  : layer.name === "Precipitation 2025"
                    ? "#15803D"
                    : "#7E22CE",
              "line-width": 2,
              "line-opacity": Math.max(0.05, Math.min(1, layer.opacity ?? 0.6)),
            },
            layout: {
              visibility: layer.visible ? "visible" : "none",
            },
          });
        }

        map.on("click", config.fillId, (event: MapLayerMouseEvent) => {
          onLayerPick?.(layer.name);

          const clicked = event.features?.[0];
          const props = (clicked?.properties ?? {}) as Record<string, unknown>;

          onFeaturePick?.({
            layerName: layer.name,
            objectName:
              typeof props.objectName === "string"
                ? props.objectName
                : `${layer.name} Object`,
            objectType:
              typeof props.objectType === "string"
                ? props.objectType
                : "Unknown",
            status: typeof props.status === "string" ? props.status : "Unknown",
            updatedAt:
              typeof props.updatedAt === "string" ? props.updatedAt : "N/A",
            taskId: typeof props.taskId === "string" ? props.taskId : undefined,
            resultId:
              typeof props.resultId === "string" ? props.resultId : undefined,
            lng: event.lngLat.lng,
            lat: event.lngLat.lat,
          });
        });
        map.on("mouseenter", config.fillId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", config.fillId, () => {
          map.getCanvas().style.cursor = "";
        });
      }
    });

    const handleMouseMove = (event: MapMouseEvent) => {
      const nextZoom = map.getZoom();
      setCursor({
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
        zoom: nextZoom,
      });
    };

    const handleMoveEnd = () => {
      const center = map.getCenter();
      setCursor({
        lng: center.lng,
        lat: center.lat,
        zoom: map.getZoom(),
      });
    };

    map.on("mousemove", handleMouseMove);
    map.on("moveend", handleMoveEnd);

    mapRef.current = map;

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("moveend", handleMoveEnd);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) {
      return;
    }

    const renderOrder = layers
      .map((layer) => {
        if (!isDemoLayerName(layer.name)) {
          return null;
        }
        const config = DEMO_LAYER_CONFIG[layer.name];
        return [config.fillId, config.lineId];
      })
      .filter((value): value is [string, string] => value !== null)
      .flat();

    for (const layerId of renderOrder) {
      if (map.getLayer(layerId)) {
        map.moveLayer(layerId);
      }
    }

    for (const layer of layers) {
      if (!isDemoLayerName(layer.name)) {
        continue;
      }

      const config = DEMO_LAYER_CONFIG[layer.name];
      const visibility = layer.visible ? "visible" : "none";

      if (map.getLayer(config.fillId)) {
        map.setLayoutProperty(config.fillId, "visibility", visibility);
        map.setPaintProperty(
          config.fillId,
          "fill-opacity",
          Math.max(0.05, Math.min(1, layer.opacity ?? 0.6)) * 0.38,
        );
      }
      if (map.getLayer(config.lineId)) {
        map.setLayoutProperty(config.lineId, "visibility", visibility);
        map.setPaintProperty(
          config.lineId,
          "line-opacity",
          Math.max(0.05, Math.min(1, layer.opacity ?? 0.6)),
        );
      }
    }
  }, [layers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusLayerName || !isDemoLayerName(focusLayerName)) {
      return;
    }

    const config = DEMO_LAYER_CONFIG[focusLayerName];
    const bounds = toBounds(config.geojson);
    map.fitBounds(bounds, { padding: 36, duration: 500, maxZoom: 12 });
  }, [focusLayerName, focusSignal]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.flyTo({
      center: [defaultCursor.lng, defaultCursor.lat],
      zoom: defaultCursor.zoom,
      duration: 700,
      essential: true,
    });
  }, [resetSignal]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-md border"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            Lng: {cursor.lng.toFixed(5)} · Lat: {cursor.lat.toFixed(5)}
          </span>
          <span>Zoom: {cursor.zoom.toFixed(2)}</span>
          <span>Scale: 1:{scaleDenominator.toLocaleString()}</span>
          <span>CRS: EPSG:3857</span>
          <span>Active Layer: {activeLayerName ?? "None"}</span>
        </div>
        <span>
          Layers: {layers.filter((layer) => layer.visible).length} visible
        </span>
      </div>
    </div>
  );
}
