"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";

type SceneOverviewMiniMapProps = {
  extent: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };
};

const SOURCE_ID = "scene-overview-extent";
const FILL_LAYER_ID = "scene-overview-extent-fill";
const LINE_LAYER_ID = "scene-overview-extent-line";

export function SceneOverviewMiniMap({ extent }: SceneOverviewMiniMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style: "https://demotiles.maplibre.org/style.json",
      center: [
        (extent.minLng + extent.maxLng) / 2,
        (extent.minLat + extent.maxLat) / 2,
      ],
      zoom: 8,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      const coordinates = [
        [extent.minLng, extent.minLat],
        [extent.maxLng, extent.minLat],
        [extent.maxLng, extent.maxLat],
        [extent.minLng, extent.maxLat],
        [extent.minLng, extent.minLat],
      ];

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [coordinates],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: FILL_LAYER_ID,
        type: "fill",
        source: SOURCE_ID,
        paint: {
          "fill-color": "#2563EB",
          "fill-opacity": 0.2,
        },
      });

      map.addLayer({
        id: LINE_LAYER_ID,
        type: "line",
        source: SOURCE_ID,
        paint: {
          "line-color": "#1D4ED8",
          "line-width": 2,
        },
      });

      map.fitBounds(
        [
          [extent.minLng, extent.minLat],
          [extent.maxLng, extent.maxLat],
        ],
        {
          padding: 20,
          duration: 0,
        },
      );
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [extent.maxLat, extent.maxLng, extent.minLat, extent.minLng]);

  return <div ref={containerRef} className="h-20 w-full rounded-sm border" />;
}
