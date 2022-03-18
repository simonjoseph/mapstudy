import { useCallback, useEffect, useRef } from "react";
import leaflet, { Control } from "leaflet";
import Draw from "leaflet-draw";
import {
  useLeafletContext,
  createElementHook,
  createLeafComponent
} from "@react-leaflet/core";

const createControlComponent = (createInstance) => {
  function createElement(props, context) {
    const { layerContainer } = context;
    const { position } = props;
    const options = {
      position,
      edit: {
        featureGroup: layerContainer
      }
    };

    return { instance: createInstance(options), context };
  }
  const useElement = createElementHook(createElement);
  const useControl = createControlHook(useElement);
  return createLeafComponent(useControl);
};

const createControlHook = (useElement) => {
  return function useLeafletControl(props) {
    const context = useLeafletContext();
    const elementRef = useElement(props, context);
    const { instance } = elementRef.current;
    const positionRef = useRef(props.position);
    const { position, onCreated, onEdit, onEdited, onDeleted } = props;

    const onDrawCreate = useCallback(
      (e) => {
        context.layerContainer.addLayer(e.layer);
        onCreated(e);
      },
      [context.layerContainer, onCreated]
    );

    useEffect(
      function addControl() {
        instance.addTo(context.map);
        context.map.on(leaflet.Draw.Event.CREATED, onDrawCreate);

        if (onDeleted) {
          context.map.on(leaflet.Draw.Event.DELETED, onDeleted);
        }

        if (onEdit) {
          context.map.on(leaflet.Draw.Event.EDITRESIZE, onEdit);
          context.map.on(leaflet.Draw.Event.EDITMOVE, onEdit);
        }

        if (onEdited) {
          context.map.on(leaflet.Draw.Event.EDITED, onEdited);
        }

        return function removeControl() {
          context.map.off(leaflet.Draw.Event.CREATED, onDrawCreate);

          if (onDeleted) {
            context.map.off(leaflet.Draw.Event.DELETED, onDeleted);
          }

          if (onEdit) {
            context.map.off(leaflet.Draw.Event.EDITRESIZE, onEdit);
            context.map.off(leaflet.Draw.Event.EDITMOVE, onEdit);
          }

          if (onEdited) {
            context.map.on(leaflet.Draw.Event.EDITED, onEdited);
          }

          instance.remove();
        };
      },
      [context.map, instance, onDrawCreate, onDeleted, onEdit, onEdited]
    );

    useEffect(
      function updateControl() {
        if (position != null && position !== positionRef.current) {
          instance.setPosition(position);
          positionRef.current = position;
        }
      },
      [instance, position]
    );

    return elementRef;
  };
};

export const DrawOnlyControl = createControlComponent(
  (options) =>
    new Control.Draw({
      ...options,
      draw: {
        polyline: false,
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        ...options.edit,
        edit: false,
        remove: false
      }
    })
);

export const EditOnlyControl = createControlComponent(
  (options) =>
    new Control.Draw({
      ...options,
      draw: {
        polyline: false,
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false,
        circlemarker: false
      }
    })
);
