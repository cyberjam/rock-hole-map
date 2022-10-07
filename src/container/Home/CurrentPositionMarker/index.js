import { React, useEffect, useState } from 'react';
import Marker from '../../../components/NaverMap/Marker';

function CurrentPositionMarker({ state, setState }) {
    const findMyLocation = async () => {
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.watchPosition(
                (position) => {
                    setState((prev) => ({
                        ...prev,
                        center: {
                            lat: position.coords.latitude, // 위도
                            lng: position.coords.longitude, // 경도
                        },
                        isLoading: false,
                    }));
                    alert(state.center.lat);
                },
                (err) => {
                    setState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: false,
                    }));
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
            );
        } else {
            // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            setState((prev) => ({
                ...prev,
                errMsg: 'geolocation을 사용할수 없어요..',
                isLoading: false,
            }));
        }
    };

    useEffect(() => {
        findMyLocation();
    }, []);

    return (
        <>
            {' '}
            {!state.isLoading && (
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
