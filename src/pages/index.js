/* eslint-disable @next/next/no-sync-scripts */
import Head from 'next/head';
import Script from 'next/script';
import Image from 'next/image';
import NaverMap from '../components/NaverMap';
import Header from '../container/Home/Header';
import HomeMarker from '../container/Home/HomeMarker';
import { getSpreadSheetData } from '../libs/sheets';
import { useMemo, useState, useEffect } from 'react';
import CurrentPositionMarker from '../container/Home/CurrentPositionMarker';

export default function Home({ spreadSheetData }) {
    // const [homes, setHomes] = useState([]);
    // const [hide, setHide] = useState(false);
    const HomeBucket = useMemo(() => {
        return Object.values(spreadSheetData);
    }, []);
    const [currentPositionState, setCurrentPositionState] = useState({
        id: 0,
        center: {
            lat: 33.0,
            lng: 126.570667,
        },
        errMsg: null,
        isLoading: true,
    });
    const [locationId, setLocationId] = useState(0);

    const findMyLocation = () => {
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            const watchPositionId = navigator.geolocation.watchPosition(
                (position) => {
                    const center = {
                        lat: position.coords.latitude, // 위도
                        lng: position.coords.longitude, // 경도
                    };
                    setCurrentPositionState((prev) => ({
                        ...prev,
                        id: locationId,
                        center,
                        isLoading: false,
                    }));
                    // alert(state.center.lat);
                },
                (err) => {
                    setCurrentPositionState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: false,
                    }));
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
            );
            // alert(watchPositionId);
            setLocationId(watchPositionId);
        } else {
            // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            setCurrentPositionState((prev) => ({
                ...prev,
                errMsg: 'geolocation을 사용할수 없어요..',
                isLoading: false,
            }));
        }
    };

    useEffect(() => {
        findMyLocation();
    }, [locationId]);

    return (
        <div>
            <Head>
                <title>바위구멍 지도</title>
                <meta name="description" content="바위구멍 지도" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script
                strategy="beforeInteractive"
                src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_KEY}`}
            ></Script>
            <main>
                <p>
                    {currentPositionState.center.lat}{' '}
                    {currentPositionState.center.lng}
                </p>
                <NaverMap>
                    {/* <Header /> */}
                    {/* <Drawer
                        state={homes}
                        hide={hide}
                        onToggleClick={handleDrawerEvent}
                    /> */}

                    {currentPositionState.center.lat && (
                        <CurrentPositionMarker
                            state={currentPositionState}
                        ></CurrentPositionMarker>
                    )}

                    {HomeBucket.map((data) => {
                        return (
                            <HomeMarker
                                key={`key_${data.lat}${data.lng}`}
                                data={data}
                                // onMarkerClick={handlers}
                            />
                        );
                    })}
                </NaverMap>
            </main>
        </div>
    );
}

export async function getStaticProps() {
    const response = await getSpreadSheetData();
    return {
        props: {
            spreadSheetData: response,
        },
    };
}
