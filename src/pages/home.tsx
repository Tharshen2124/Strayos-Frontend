import { apiKey, apiUrl, mapId } from '@/src/utils/env';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AddStrayPetDialog from '@/src/components/AddPetStrayDialog';
import { Straypet } from '@/src/types/straypets';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'next/router';
import { NavigationBar } from '../components/NavigationBar';
import { getTimeDifference } from '../utils/getTimeDifference';
import MoreInfoDialog from '../components/MoreInfoPetDialog';

export default function Main() {
  const { token } = useAuthStore.getState()
  const [data, setData] = useState<Straypet[]>()
  const [latitude, setLatitude] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [longitude, setLongitude] = useState<number>(0)
  const [error, setError] = useState<string>()
  const router = useRouter()
  
  useEffect(() => {
    if(isLoading) {
      setIsLoading(false)
      return 
    }
    console.log('token', token)
    if (token && token == 'No Value') {
      router.push('/login')
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          setError("Error getting location. Please enable location services.");
          console.error(err);
        }
      );
    } else {
        setError("Geolocation is not supported by this browser.");
    }

    async function getData() {
      try {
        const response = await axios.get(`${apiUrl}/stray-pets`, {
          headers: {
            'Accept': "application/json",
            "Authorization":  `Bearer ${token}`
          }
        })
        setData(response.data.data)
      } catch(error) {
        console.error("Error occured", error)
      }
    }
    getData()  
  }, [token, isLoading, latitude, longitude])

  return (
    <>
     {!isLoading && <NavigationBar/>}
     <div className="h-[100vh] w-[100%]">
      <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: 2.9304793, lng: 101.5795701 }}
          mapId={mapId}
          mapTypeControl={false}
          fullscreenControl={false}
          disableDefaultUI={true}
        >
          {data && data.map((strayPet: Straypet, index) => {
            return (
              <MoreInfoDialog strayPet={strayPet} key={index}>
                <AdvancedMarker  position={{lat: Number(strayPet.Latitude), lng: Number(strayPet.Longitude)}}>
                <Image className="rounded-[100px] border-4 border-white dark:border-black" src={strayPet.ImageURL} alt="cat image" width="60" height="60"/>
                  <div className="text-center font-bold text-md bg-white dark:bg-black dark:text-white rounded-xl py-1 px-2 mt-[-5px]">{getTimeDifference(strayPet.CreatedAt)}</div>
                </AdvancedMarker>
              </MoreInfoDialog>
            )
          })}
        </Map>
      </APIProvider>
      <AddStrayPetDialog latitude={latitude} longitude={longitude}/>
    </div>
    </>
  );
}

