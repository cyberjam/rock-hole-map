/* eslint-disable @next/next/no-sync-scripts */
import Head from 'next/head';
import Script from 'next/script';
import Image from 'next/image';
import NaverMap from '../components/NaverMap';
import Header from '../container/Home/Header';
import HomeMarker from '../container/Home/HomeMarker';
import { getSpreadSheetData } from '../libs/sheets';
import { useMemo, useState } from 'react';
import CurrentPositionMarker from '../container/Home/CurrentPositionMarker';

export default function Home({ spreadSheetData }) {
    // const [homes, setHomes] = useState([]);
    // const [hide, setHide] = useState(false);
    const HomeBucket = useMemo(() => {
        return Object.values(spreadSheetData);
    }, []);
    const [currentPositionState, setCurrentPositionState] = useState({
        center: {
            lat: 33.450701,
            lng: 126.570667,
        },
        errMsg: null,
        isLoading: true,
    });

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
                <NaverMap>
                    {/* <Header /> */}
                    {/* <Drawer
                        state={homes}
                        hide={hide}
                        onToggleClick={handleDrawerEvent}
                    /> */}
                    {currentPositionState.center && (
                        <CurrentPositionMarker
                            state={currentPositionState}
                            setState={setCurrentPositionState}
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
        revalidate: 1,
    };
}
