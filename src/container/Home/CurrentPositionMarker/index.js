import { React, useEffect, useState } from 'react';
import Marker from '../../../components/NaverMap/Marker';

function CurrentPositionMarker({
    state,
    onPositionRender,
    locationId,
    setLocationId,
}) {
    // const [state, setState] = useState({
    //     center: {
    //         lat: 33.0,
    //         lng: 126.570667,
    //     },
    //     errMsg: null,
    //     isLoading: true,
    // });

    const findMyLocation = () => {
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            const watchPositionId = navigator.geolocation.watchPosition(
                (position) => {
                    const center = {
                        lat: position.coords.latitude, // 위도
                        lng: position.coords.longitude, // 경도
                    };
                    onPositionRender({
                        id: locationId,
                        center,
                        isLoading: false,
                    });
                    // setState((prev) => ({
                    //     ...prev,
                    //     id: locationId,
                    //     center,
                    //     isLoading: false,
                    // }));
                    // alert(state.center.lat);
                },
                (err) => {
                    return 0;
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
            );
            // alert(watchPositionId);
            setLocationId(watchPositionId);
        }
    };

    useEffect(() => {
        findMyLocation();
    }, []);

    return (
        <>
            {' '}
            {state.center.lat}
            {!state.isLoading && state.center.lat && (
                <Marker
                    position={state.center}
                    src={'https://i.ibb.co/F4q5WKP/image.png'}
                    size={25}
                />
            )}
        </>
    );
}

export default CurrentPositionMarker;

// export async function getStaticProps() {
//     const [state, setState] = useState();

//     findMyLocation();
//     return {
//         props: {
//             state: await findMyLocation(),
//         },
//         revalidate: 1,
//     };
// }
