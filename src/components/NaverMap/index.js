import React, { createContext, forwardRef, useEffect, useState } from 'react';

export const NaverMapContext = createContext(null);

const NaverMap = forwardRef((props, ref) => {
    const [map, setMap] = useState(null);
    useEffect(() => {
        if (typeof naver !== 'undefined') {
            const mapOptions = {
                center: new naver.maps.LatLng(
                    props.center.lat,
                    props.center.lng,
                ),
                zoom: props.zoom,
            };
            const map = new naver.maps.Map(props.id, mapOptions);
            setMap(map);
        }
    }, []);
    return (
        <>
            <div
                ref={ref}
                id={props.id}
                data-testid="map"
                style={{ width: props.width, height: props.height }}
            ></div>
            <NaverMapContext.Provider value={map}>
                {props.children}
            </NaverMapContext.Provider>
        </>
    );
});

NaverMap.defaultProps = {
    id: 'map',
    center: { lat: 36.435469, lng: 128.1582 },
    zoom: 11,
    width: '100vw',
    height: '90vh',
};

export default NaverMap;
